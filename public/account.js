// account.js
import { app, auth, db } from "./firebase-init.js";  
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginBox = document.getElementById("login-box");
const signupBox = document.getElementById("signup-box");
const loggedBox = document.getElementById("logged-in-box");
const loggedEmail = document.getElementById("logged-in-email");

// ---------- LOGIN ----------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-pass").value;

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    alert(err.message);
  }
});

// ---------- SIGNUP ----------
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const pass = document.getElementById("signup-pass").value;

  try {
    await createUserWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    alert(err.message);
  }
});

// ---------- LOGOUT ----------
document.getElementById("logout-btn")?.addEventListener("click", async () => {
  await signOut(auth);
});

// ---------- AUTH CHANGE ----------
onAuthStateChanged(auth, (user) => {
  if (user) {
    loggedEmail.textContent = "Logged in as: " + user.email;

    loginBox.style.display = "none";
    signupBox.style.display = "none";
    loggedBox.style.display = "block";
  } else {
    loggedBox.style.display = "none";
    loginBox.style.display = "block";
    signupBox.style.display = "block";
  }
});
