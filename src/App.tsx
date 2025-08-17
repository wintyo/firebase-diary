import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import type { User } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, authProviders, database } from "./firebase";

function App() {
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [count, setCount] = useState(0);

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

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
