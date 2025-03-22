// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZmSzphanrYQC0FqTyR_OYKNB42wOythQ",
  authDomain: "manflowyoga-a36a7.firebaseapp.com",
  projectId: "manflowyoga-a36a7",
  storageBucket: "manflowyoga-a36a7.firebasestorage.app",
  messagingSenderId: "512748165114",
  appId: "1:512748165114:web:1906b5e8d9d83062c5f643"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ----------- SIGNUP FUNCTION ----------- //
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email2").value;
  const password = document.getElementById("signup-password").value;

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send Email OTP for verification
    await sendEmailVerification(user);
    alert("Verification email sent! Please check your inbox.");

    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName: fullName,
      email: email,
      userId: user.uid
    });

    // Redirect to login after verification
    document.getElementById("signupForm").reset();
  } catch (error) {
    console.error("Error signing up:", error.message);
    alert(error.message);
  }
});

// ----------- LOGIN FUNCTION ----------- //
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if email is verified
    if (!user.emailVerified) {
      alert("Please verify your email before logging in.");
      return;
    }

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      alert(`Welcome back, ${userDoc.data().fullName}!`);
      window.location.href = "yoga.html";
 // Redirect to the user account
    } else {
      alert("User data not found. Please sign up.");
    }
  } catch (error) {
    console.error("Login error:", error.message);
    alert(error.message);
  }
});

// ----------- CHECK USER AUTH STATUS ----------- //
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user);
  } else {
    console.log("No user logged in");
  }
});
