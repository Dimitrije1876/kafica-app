import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDtKQKP2Z700-UV0bEI52imPIz_NLhIIaw",
  authDomain: "kafica-46330.firebaseapp.com",
  projectId: "kafica-46330",
  storageBucket: "kafica-46330.firebasestorage.app",
  messagingSenderId: "1037684345163",
  appId: "1:1037684345163:web:c87043ec104a2c696fc0ce"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)