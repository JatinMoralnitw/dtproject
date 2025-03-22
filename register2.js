// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

// Function to generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP via email (Replace with actual email service)
async function sendOTP(email, otp) {
    alert(`OTP sent to ${email}: ${otp}`); // Simulated email send
    // You need to integrate an email API like SMTP.js, SendGrid, or Firebase Extensions for real emails.
}

// ----------- SIGNUP FUNCTION ----------- //
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("full-name").value;
    const email = document.getElementById("email2").value;
    const password = document.getElementById("signup-password").value;

    try {
        // Generate OTP and store in Firestore
        const otp = generateOTP();
        await setDoc(doc(db, "otp_verifications", email), { otp: otp, createdAt: new Date() });

        // Send OTP to the user's email
        await sendOTP(email, otp);

        // Show OTP input field
        document.getElementById("otpSection").style.display = "block";
        document.getElementById("signupBtn").disabled = true; // Disable signup button temporarily

        alert("OTP sent! Check your email and enter the OTP below.");
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        alert(error.message);
    }
});

// ----------- VERIFY OTP & CREATE ACCOUNT ----------- //
document.getElementById("verifyOtpBtn").addEventListener("click", async () => {
    const email = document.getElementById("email2").value;
    const enteredOtp = document.getElementById("otp").value;
    const fullName = document.getElementById("full-name").value;
    const password = document.getElementById("signup-password").value;

    try {
        const otpDoc = await getDoc(doc(db, "otp_verifications", email));

        if (otpDoc.exists() && otpDoc.data().otp === enteredOtp) {
            // OTP is correct, create user account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user details in Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName: fullName,
                email: email,
                userId: user.uid
            });

            // Delete OTP from Firestore after successful signup
            await deleteDoc(doc(db, "otp_verifications", email));

            alert("Account created successfully!");
            window.location.href = "login.html"; // Redirect to login page
        } else {
            alert("Invalid OTP. Please try again.");
        }
    } catch (error) {
        console.error("Error verifying OTP:", error.message);
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

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            alert(`Welcome back, ${userDoc.data().fullName}!`);
            window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
            alert("User data not found. Please sign up.");
        }
    } catch (error) {
        console.error("Login error:", error.message);
        alert(error.message);
    }
});
