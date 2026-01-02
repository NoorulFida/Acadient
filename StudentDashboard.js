import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

/* 🔹 Firebase Config */
const firebaseConfig = {
    apiKey: "AIzaSyCYMh-jojmpS07qjB4hbAE4VRwU0w9zkw0",
    authDomain: "login-form-74d6e.firebaseapp.com",
    projectId: "login-form-74d6e",
    storageBucket: "login-form-74d6e.firebasestorage.app",
    messagingSenderId: "305047532936",
    appId: "1:305047532936:web:8f7df19681a700f66df63d"
};

/* 🔹 Init */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* 🔹 Set Date */
document.getElementById("date").textContent = new Date().toDateString();

/* 🔹 Get logged in user ID */
const userId = localStorage.getItem("loggedInUserId");

if (!userId) {
    alert("Not logged in");
    window.location.href = "page10.html";
}

/* 🔹 Fetch student data */
async function loadStudentData() {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("Student data not found in Firestore");
            return;
        }

        const student = userSnap.data();

        // ✅ DISPLAY DATA
        document.getElementById("dept").textContent = student.department;
        document.getElementById("sem").textContent = "Semester " + student.semester;

        console.log("Student Loaded:", student);

    } catch (error) {
        console.error(error);
        alert("Failed to load student data");
    }
}

loadStudentData();

/* 🔹 Logout */
document.getElementById("logout").addEventListener("click", async () => {
    await signOut(auth);
    localStorage.clear();
    window.location.href = "page10.html";
});
