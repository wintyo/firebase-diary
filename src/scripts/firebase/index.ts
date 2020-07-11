import firebase from 'firebase/app';

// 必要な機能をimportする
import 'firebase/auth';
import 'firebase/database';

import config from '../../../config/firebase';

firebase.initializeApp(config);

export const authProviders = {
  Google: new firebase.auth.GoogleAuthProvider(),
};

export const auth = firebase.auth();

export const database = firebase.database();

export default firebase;
