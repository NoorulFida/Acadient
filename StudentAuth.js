import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

/* 🔹 Firebase Config */
const firebaseConfig = {
    apiKey: "AIzaSyCYMh-jojmpS07qjB4hbAE4VRwU0w9zkw0",
    authDomain: "login-form-74d6e.firebaseapp.com",
    projectId: "login-form-74d6e",
    storageBucket: "login-form-74d6e.firebasestorage.app",
    messagingSenderId: "305047532936",
    appId: "1:305047532936:web:8f7df19681a700f66df63d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= TOGGLE UI ================= */
const registrationForm = document.getElementById("registrationForm");
const loginForm = document.getElementById("loginForm");
const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");

showLogin.onclick = () => {
    registrationForm.style.display = "none";
    loginForm.style.display = "block";
    showLogin.style.display = "none";
    showRegister.style.display = "inline";
};

showRegister.onclick = () => {
    registrationForm.style.display = "block";
    loginForm.style.display = "none";
    showLogin.style.display = "inline";
    showRegister.style.display = "none";
};

/* ================= REGISTRATION ================= */
registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const dept = document.getElementById("dept").value;
    const semester = document.getElementById("semester").value;
    const admno = document.getElementById("admno").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        await setDoc(doc(db, "users", user.uid), {
            fullname,
            department: dept,
            semester,
            admissionNumber: admno,
            email,
            role: "student",  
            createdAt: new Date()
        });
        localStorage.setItem('loggedInUserId', user.uid);
        localStorage.setItem('role', 'student');
        window.location.href = "page11.html";
    } catch (err) {
        alert(err.message);
    }
});

/* ================= LOGIN ================= */
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        // Check role
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().role === "student") {
            localStorage.setItem('loggedInUserId', user.uid);
            localStorage.setItem('role', 'student');
            window.location.href = "page11.html";
        } else {
            alert("Access denied");
        }
    } catch (err) {
        alert("Invalid login details");
    }
});
