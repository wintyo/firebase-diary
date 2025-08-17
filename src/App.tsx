import { useState, useEffect } from "react";
import "./App.css";

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

  return <div>ログイン完了</div>;
}

export default App;
