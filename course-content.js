import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Elements
const teacherNameElement = document.getElementById("teacherName");
const teacherImageElement = document.getElementById("teacherImage");

// Get teacher details from Firestore
async function loadTeacher() {
    try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        if (!querySnapshot.empty) {
            const teacherData = querySnapshot.docs[0].data(); // Fetch first teacher

            teacherNameElement.innerText = teacherData.name;
            teacherImageElement.src = teacherData.imageUrl;
        } else {
            teacherNameElement.innerText = "No teacher found.";
        }
    } catch (error) {
        console.error("Error loading teacher:", error);
        teacherNameElement.innerText = "Error loading teacher.";
    }
}

loadTeacher();
