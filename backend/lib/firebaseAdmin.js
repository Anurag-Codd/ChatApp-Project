import firebase from "firebase-admin";

import serviceAccount from "../adminService.json" assert { type: "json" };

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

export default firebase;
