import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyAPInPdSxnveGyTlGG3Tp5BdMNytt7U6uw",
  authDomain: "social-coding-arena.firebaseapp.com",
  databaseURL: "https://social-coding-arena.firebaseio.com",
  projectId: "social-coding-arena",
  storageBucket: "social-coding-arena.appspot.com",
  messagingSenderId: "1090272572793",
  appId: "1:1090272572793:web:f09b05bb412e2a275beba8",
  measurementId: "G-CZ12Z27090",
};

const google_config = {
  client_id:
    "1090272572793-7l69jjadpu03rbd4ih2nh83a613t37g0.apps.googleusercontent.com",
  scope: "profile email",
};

firebase.initializeApp(config);

export default firebase;
export const googleConfig = google_config;
