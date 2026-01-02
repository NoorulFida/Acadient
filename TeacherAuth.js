
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js"
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js"
const firebaseConfig = {
    apiKey: "AIzaSyCYMh-jojmpS07qjB4hbAE4VRwU0w9zkw0",
    authDomain: "login-form-74d6e.firebaseapp.com",
    projectId: "login-form-74d6e",
    storageBucket: "login-form-74d6e.firebasestorage.app",
    messagingSenderId: "305047532936",
    appId: "1:305047532936:web:8f7df19681a700f66df63d",
    measurementId: "G-F3S2GXXENT"
};
const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;

    }, 5000);


}
const signUp = document.getElementById('submitSignUp')
signUp.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth();
    const db = getFirestore();


    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName
            };
            showMessage('Account Created Successfully', 'signUpMessage');
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error("error writing documnet", error);

                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode == 'auth/mail-already-in-use') {
                showMessage('Email Address Already Exists !!!', 'signUpMessage');
            }
            else {
                showMessage('unable to create user', 'signUpMessage');
            }
        })


});


const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();



    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);

            window.location.href = 'homepage.html';


        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'SignInMesaage');
            }
            else {
                showMessage('Account does not Exist', 'signInMesaage')
            }

        })
 })       

