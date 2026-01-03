import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
    getFirestore,
    setDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

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

/* ================= TOGGLE ================= */
const regForm = document.getElementById("registrationForm");
const loginForm = document.getElementById("loginForm");
const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");

showLogin.onclick = () => {
    regForm.style.display = "none";
    loginForm.style.display = "block";
    showLogin.style.display = "none";
    showRegister.style.display = "inline";
    document.getElementById("formTitle").innerText = "Teacher Login";
};

showRegister.onclick = () => {
    regForm.style.display = "block";
    loginForm.style.display = "none";
    showLogin.style.display = "inline";
    showRegister.style.display = "none";
    document.getElementById("formTitle").innerText = "Teacher Registration";
};

/* ================= REGISTER ================= */
regForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const dept = document.getElementById("dept").value;
    const subject = document.getElementById("subject").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        await setDoc(doc(db, "users", user.uid), {
            fullname,
            department: dept,
            subject,
            email,
            role: "teacher",
            verified: false,
            createdAt: new Date()
        });

        localStorage.setItem("loggedInUserId", user.uid);
        localStorage.setItem("role", "teacher");

        // ✅ Redirect after successful registration
        window.location.href = "page4.html";

    } catch (err) {
        alert(err.message);
    }
});

/* ================= LOGIN ================= */
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists() && snap.data().role === "teacher") {
            localStorage.setItem("loggedInUserId", user.uid);
            localStorage.setItem("role", "teacher");

            // ✅ Redirect after successful login
            window.location.href = "page4.html";
        } else {
            alert("Not a teacher account");
        }

    } catch (err) {
        alert("Invalid login details");
    }
});
