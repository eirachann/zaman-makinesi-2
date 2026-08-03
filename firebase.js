import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
getFirestore
}
from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {

apiKey: "AIzaSyC68pRBRnXsbtPz2C1I1ShEL_UctSwyHXQ",

authDomain: "zaman-makinesi-bd397.firebaseapp.com",

projectId: "zaman-makinesi-bd397",

storageBucket: "zaman-makinesi-bd397.firebasestorage.app",

messagingSenderId: "1091085398195",

appId: "1:1091085398195:web:56f6a97bdf13e256f080c6"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
