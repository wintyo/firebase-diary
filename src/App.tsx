import { useState, useEffect } from "react";
import styles from "./App.module.scss";

import type { User } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, authProviders, database } from "./firebase";

function App() {
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsAuthorizing(false);
      setUser(user);
      if (user) {
        set(ref(database, `user/${user.uid}/email`), user.email);
      }
    });
  }, []);

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

  // ログイン後
  return (
    <div className={styles.root}>
      <div className={styles.root__side}>
        <div className={styles.root__side__calendar}>
          カレンダー
          {/* <Calender
            targetMonth={targetMonth}
            selectedDate={selectedDate}
            textMap={markdownTextMap}
            onChangeMonth={setTargetMonth}
            onChangeSelectedDate={setSelectedDate}
          /> */}
        </div>
        <div className={styles.root__side__list}>
          日付リスト
          {/* <DayList
            targetMonth={targetMonth}
            selectedDate={selectedDate}
            textMap={markdownTextMap}
            onChangeSelectedDate={setSelectedDate}
          /> */}
        </div>
      </div>
      <div className={styles.root__editor}>
        テキストエリア
        {/* <textarea
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
        /> */}
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
