// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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

// Elements from HTML
const courseList = document.getElementById("courseList");
const availableCoursesList = document.getElementById("availableCourses");
const logoutBtn = document.getElementById("logoutBtn");

// List of available courses
const availableCourses = [
  { id: "yoga_beginner", name: "Yoga for Beginners", price: 10 },
  { id: "yoga_weight_loss", name: "Yoga for Weight Loss", price: 15 },
  { id: "yoga_flexibility", name: "Yoga for Flexibility", price: 12 }
];

// Check if user is logged in and fetch their courses
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const purchasedCourses = userData.purchasedCourses || [];

      // Display purchased courses
      courseList.innerHTML = purchasedCourses.length > 0
        ? purchasedCourses.map(course => `
          <li>
            ${course} <button onclick="accessCourse('${course}')">Access</button>
          </li>
        `).join("")
        : "<p>No courses purchased yet.</p>";

      // Display available courses to buy
      availableCoursesList.innerHTML = availableCourses
        .filter(course => !purchasedCourses.includes(course.name))
        .map(course => `
          <li>
            ${course.name} - $${course.price} 
            <button onclick="buyCourse('${course.id}', '${course.name}')">Buy</button>
          </li>
        `).join("");
    }
  } else {
    window.location.href = "login.html"; // Redirect to login if not logged in
  }
});

// Buy Course Function
window.buyCourse = async (courseId, courseName) => {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to buy a course.");
    return;
  }

  const userDocRef = doc(db, "users", user.uid);
  await updateDoc(userDocRef, {
    purchasedCourses: arrayUnion(courseName)
  });

  alert(`You have successfully purchased: ${courseName}`);
  window.location.reload();
};

// Access Course Function
window.accessCourse = (courseName) => {
  alert(`Accessing: ${courseName}`);
  window.location.href = `course-content.html?course=${encodeURIComponent(courseName)}`;
};

// Logout Function
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("You have logged out.");
    window.location.href = "login.html"; // Redirect to login page
  } catch (error) {
    console.error("Logout Error:", error);
    alert("Failed to log out. Please try again.");
  }
});
