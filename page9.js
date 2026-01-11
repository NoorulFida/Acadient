// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYMh-jojmpS07qjB4hbAE4VRwU0w9zkw0",
  authDomain: "login-form-74d6e.firebaseapp.com",
  projectId: "login-form-74d6e",
  storageBucket: "login-form-74d6e.appspot.com",
  messagingSenderId: "305047532936",
  appId: "1:305047532936:web:8f7df19681a700f66df63d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// ================= LOAD TIMETABLE =================
window.loadStudentTimetable = async function () {

  const dept = document.getElementById("dept").value;
  const sem = document.getElementById("sem").value;

  if (!dept || !sem) {
    alert("Select department and semester");
    return;
  }

  const deptId = dept.replace(/\s+/g, "_");
  const ref = doc(db, "timetables", deptId, "semesters", `sem_${sem}`);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("No timetable found");
    return;
  }

  const data = snap.data();
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  let html = `
    <tr>
      <th>Day / Period</th>
      <th>P1</th><th>P2</th><th>P3</th><th>P4</th><th>P5</th>
    </tr>
  `;

  days.forEach(day => {
    html += `<tr><th>${day.toUpperCase()}</th>`;
    for (let i = 1; i <= 5; i++) {
      html += `<td>${data[day]?.[i]?.subject || "-"}</td>`;
    }
    html += `</tr>`;
  });

  document.getElementById("studentTable").innerHTML = html;
};
