import React, { useState, useEffect, useMemo } from 'react';
import { hot } from 'react-hot-loader';

import { format as formatDate } from 'date-fns';
import { debounce } from 'lodash-es';

import styles from './css/App.scss';

// components
import Calender from '../components/Calendar';
import DayList from '../components/DayList';
import ReactMarkdown from 'react-markdown';

// interfaces
import { ITextMap } from '~/interfaces/App';

/**
 * テキストの保存
 * @param targetMonth - 対象月
 * @param textMap - テキストデータ
 */
const saveTextData = debounce((targetMonth: Date, textMap: ITextMap) => {
  const yearMonthStr = formatDate(targetMonth, 'yyyyMM');
  const updateTextMap = Object.assign(
    {},
    ...Object.keys(textMap)
      .filter((dateStr) => (new RegExp('^' + yearMonthStr).test(dateStr)))
      .map((dateStr) => ({
        [dateStr]: textMap[dateStr],
      }))
  );
  return window.IPC.saveMonthTexts(targetMonth, updateTextMap);
}, 500);

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
  const [targetMonth, setTargetMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markdownTextMap, setMarkdownTextMap] = useState<ITextMap>({});

  const selectedDateStr = useMemo(() => formatDate(selectedDate, 'yyyyMMdd'), [selectedDate]);

  // useEffect(() => {
  //   window.IPC.loadMonthTexts(targetMonth)
  //     .then(((loadedTextMap: ITextMap) => {
  //       setMarkdownTextMap({
  //         ...markdownTextMap,
  //         ...loadedTextMap,
  //       });
  //     }));
  // }, [targetMonth]);

  return (
    <div className={styles.root}>
      <div className={styles.root__side}>
        <div className={styles.root__side__calendar}>
          <Calender
            targetMonth={targetMonth}
            selectedDate={selectedDate}
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
            saveTextData(selectedDate, newTextMap);
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
