
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js"
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js"

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

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {

        // const docRef = doc(db, "users", loggedInUserId);
        // getDoc(docRef)
        //     .then((docSnap) => {

        //         if (docSnap.exists()) {
        //             const userData = docSnap.data();
                    
                 
        //         }
        //         else {
        //             console.log("no document found matching id")
        //         }

        //     })
        //     .catch((error) => {
        //         console.log("Error getting document");
        //     })
    }
    else {
        window.location.href = "page2.html"
        console.log("User Id not Found in Local storage")
    }
})

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error Signing out:', error);
        })

})
