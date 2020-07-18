import React, { useState, useEffect, useMemo } from 'react';
import { hot } from 'react-hot-loader';

import { format as formatDate, startOfMonth, endOfMonth } from 'date-fns';
import { debounce } from 'lodash-es';

import styles from './css/App.scss';

import * as firebase from 'firebase';
import { auth, authProviders, database } from '~/firebase';

// components
import Calender from '../components/Calendar';
import DayList from '../components/DayList';
import ReactMarkdown from 'react-markdown';

// interfaces
import { ITextMap } from '~/interfaces/App';

/**
 * 意図した表示になるように少し修正する
 * @param markdownText - マークダウンテキスト
 */
const adjustMarkdownText = (markdownText?: string) => {
  if (!markdownText) {
    return '';
  }
  // 改行の後ろにスペース2つを入れてプレビューでも改行されるようにする
  return markdownText
    .split('\n')
    .map((text) => text + '  ')
    .join('\n');
}

const App = () => {
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [targetMonth, setTargetMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markdownTextMap, setMarkdownTextMap] = useState<ITextMap>({});

  const selectedDateStr = useMemo(() => formatDate(selectedDate, 'yyyyMMdd'), [selectedDate]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsAuthorizing(false);
      setUser(user);
      if (user) {
        database.ref(`user/${user.uid}/email`).set(user.email);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    diaryRef
      .orderByKey()
      .startAt(formatDate(startOfMonth(targetMonth), 'yyyyMMdd'))
      .endAt(formatDate(endOfMonth(targetMonth), 'yyyyMMdd'))
      .once('value', (data) => {
        const textMap = data.val();
        setMarkdownTextMap({
          ...markdownTextMap,
          ...textMap,
        });
      });
  }, [user, targetMonth]);

  // 認証中
  if (isAuthorizing) {
    return (
      <div>認証中</div>
    );
  }

  // ログイン前
  if (!user) {
    return (
      <div>
        <button
          onClick={() => {
            auth.signInWithRedirect(authProviders.Google);
          }}
        >
          ログイン
        </button>
      </div>
    );
  }

  const diaryRef = database.ref(`diary/${user.uid}`);
  const uploadText = debounce(async (selectedDate: Date, text: string) => {
    try {
      await diaryRef.child(formatDate(selectedDate, 'yyyyMMdd')).set(text);
    } catch (error) {
      window.alert('登録でエラーが発生しました。');
      console.error(error);
    }
  }, 500);

  // ログイン後
  return (
    <div className={styles.root}>
      <div className={styles.root__side}>
        <div className={styles.root__side__calendar}>
          <Calender
            targetMonth={targetMonth}
            selectedDate={selectedDate}
            textMap={markdownTextMap}
            onChangeMonth={setTargetMonth}
            onChangeSelectedDate={setSelectedDate}
          />
        </div>
        <div className={styles.root__side__list}>
          <DayList
            targetMonth={targetMonth}
            selectedDate={selectedDate}
            textMap={markdownTextMap}
            onChangeSelectedDate={setSelectedDate}
          />
        </div>
      </div>
      <div className={styles.root__editor}>
        <textarea
          className={styles.textarea}
          value={markdownTextMap[selectedDateStr] || ''}
          placeholder="今日の内容を記入してください"
          onChange={(event) => {
            const newTextMap = {
              ...markdownTextMap,
              [selectedDateStr]: event.currentTarget.value
            };
            setMarkdownTextMap(newTextMap);
            uploadText(selectedDate, newTextMap[selectedDateStr]);
          }}
        />
      </div>
      <div className={styles.root__preview}>
        <ReactMarkdown
          className={styles.preview}
          source={adjustMarkdownText(markdownTextMap[selectedDateStr])}
        />
      </div>
    </div>
  );
}

export default hot(module)(App);
