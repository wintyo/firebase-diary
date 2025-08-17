import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

import config from "./config/sdkConfig";

export const app = initializeApp(config);

export const auth = getAuth(app);

export const authProviders = {
  Google: new GoogleAuthProvider(),
};

export const database = getDatabase(app);
