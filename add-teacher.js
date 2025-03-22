import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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
const nameInput = document.getElementById("teacherName");
const imageUrlInput = document.getElementById("teacherImageUrl");
const addTeacherBtn = document.getElementById("addTeacherBtn");
const statusMessage = document.getElementById("statusMessage");

addTeacherBtn.addEventListener("click", async () => {
    try {
        const name = nameInput.value.trim();
        const imageUrl = imageUrlInput.value.trim();

        if (!name || !imageUrl) {
            statusMessage.innerText = "⚠️ Please enter a name and image URL.";
            return;
        }

        // Save teacher data in Firestore
        await addDoc(collection(db, "teachers"), { name, imageUrl });

        statusMessage.innerText = "✅ Teacher added successfully!";
        nameInput.value = "";
        imageUrlInput.value = "";

    } catch (error) {
        console.error("Error:", error);
        statusMessage.innerText = "❌ Something went wrong. Try again.";
    }
});
