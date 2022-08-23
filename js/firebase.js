import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDi6_sQ9h-mC2GBF57sE6hUH32SR-MKIyM",
  authDomain: "quiz-app-database-6a54a.firebaseapp.com",
  projectId: "quiz-app-database-6a54a",
  storageBucket: "quiz-app-database-6a54a.appspot.com",
  messagingSenderId: "819771888856",
  appId: "1:819771888856:web:97f95fb8b679d3175733ad",
  measurementId: "G-ZCGRPF6JEG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();

auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    localStorage.setItem("user", user.uid);
  }
});

window.login = (e) => {
  let email = document.getElementById("login-email").value;
  let password = document.getElementById("login-pass").value;

  console.log(email, password);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      localStorage.setItem("user", userCredential.user.uid);
      window.location.href = "/index.html";
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
};

window.writeUserData = function writeUserData(name, email, surname) {
  let userId = localStorage.getItem("user");

  set(ref(db, "users/" + userId), {
    username: name,
    email: email,
    surname: surname,
  });
};

window.logout = () => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("user");
      window.location.href = "/pages/login.html";
    })
    .catch((error) => {
      // An error happened.
    });
};

window.register = () => {
  let email = document.getElementById("register-email").value;
  let password = document.getElementById("register-password").value;
  let name = document.getElementById("register-name").value;
  let surname = document.getElementById("register-surname").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      localStorage.setItem("user", userCredential.user.uid);
      writeUserData(name, email, surname);
      window.location.href = "/index.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
};

const QuestionsDBRef = ref(db, "questions/");
onValue(QuestionsDBRef, (snapshot) => {
  const data = snapshot.val();
  localStorage.setItem("questions", JSON.stringify(data));
});
