import firebase from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

export default firebase;
