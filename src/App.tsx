import { useState, useEffect, useMemo } from "react";
import { formatDate, startOfMonth, endOfMonth } from "date-fns";
import { debounce } from "es-toolkit";

import type { User } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import {
  ref,
  set,
  child,
  get,
  query,
  orderByKey,
  startAt,
  endAt,
} from "firebase/database";

import styles from "./App.module.scss";
import { auth, authProviders, database } from "./firebase";
import type { DiaryTextMap } from "./types/DiaryTextMap";

import { Calender } from "./components/Calendar";
import { DayList } from "./components/DayList";

function App() {
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [targetMonth, setTargetMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markdownTextMap, setMarkdownTextMap] = useState<DiaryTextMap>({});

  const selectedDateStr = useMemo(
    () => formatDate(selectedDate, "yyyyMMdd"),
    [selectedDate]
  );

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsAuthorizing(false);
      setUser(user);
      if (user) {
        set(ref(database, `user/${user.uid}/email`), user.email);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    get(
      query(
        diaryRef,
        orderByKey(),
        startAt(formatDate(startOfMonth(targetMonth), "yyyyMMdd")),
        endAt(formatDate(endOfMonth(targetMonth), "yyyyMMdd"))
      )
    )
      .then((snapshot) => {
        const textMap = snapshot.val();
        setMarkdownTextMap({
          ...markdownTextMap,
          ...textMap,
        });
      })
      .catch((err) => {
        window.alert("データの取得に失敗しました");
        console.error(err);
      });
  }, [user, targetMonth]);

  // 認証中
  if (isAuthorizing) {
    return <div>認証中</div>;
  }

  // ログイン前
  if (!user) {
    return (
      <div>
        <button
          onClick={() => {
            signInWithPopup(auth, authProviders.Google);
          }}
        >
          ログイン
        </button>
      </div>
    );
  }

  const diaryRef = ref(database, `diary/${user.uid}`);
  const uploadText = debounce(async (selectedDate: Date, text: string) => {
    try {
      await set(child(diaryRef, formatDate(selectedDate, "yyyyMMdd")), text);
    } catch (error) {
      window.alert("登録でエラーが発生しました。");
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
          value={markdownTextMap[selectedDateStr] || ""}
          placeholder="今日の内容を記入してください"
          onChange={(event) => {
            const newTextMap = {
              ...markdownTextMap,
              [selectedDateStr]: event.currentTarget.value,
            };
            setMarkdownTextMap(newTextMap);
            uploadText(selectedDate, newTextMap[selectedDateStr]);
          }}
        />
      </div>
      <div className={styles.root__preview}>
        マークダウン表示
        {/* <ReactMarkdown
          className={styles.preview}
          source={adjustMarkdownText(markdownTextMap[selectedDateStr])}
        /> */}
      </div>
    </div>
  );
}

export default App;
