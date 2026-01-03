// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore, collection, query, where, getDocs,
  updateDoc, doc, setDoc, getDoc
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

// =================================================
// ================= TEACHERS ======================
// =================================================
async function loadTeachers() {
  const q = query(collection(db, "users"), where("role", "==", "teacher"));
  const snap = await getDocs(q);

  const div = document.getElementById("teachersTable");
  div.innerHTML = "";

  const table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  `;

  snap.forEach(d => {
    const t = d.data();
    const verified = t.verified === true;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.name || ""}</td>
      <td>${t.email || ""}</td>
      <td>${verified ? "Verified" : "Not Verified"}</td>
      <td>
        <button onclick="toggleVerify('${d.id}', ${verified})">
          ${verified ? "Unverify" : "Verify"}
        </button>
      </td>
    `;
    table.appendChild(row);
  });

  div.appendChild(table);
}

window.toggleVerify = async (uid, status) => {
  await updateDoc(doc(db, "users", uid), { verified: !status });
  loadTeachers();
};

loadTeachers();

// =================================================
// ================= TIMETABLE =====================
// =================================================

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function buildEmptyGrid() {
  const table = document.getElementById("timetableGrid");
  table.innerHTML = `
    <tr>
      <th>Day / Period</th>
      <th>P1</th><th>P2</th><th>P3</th><th>P4</th><th>P5</th>
    </tr>
  `;

  days.forEach(day => {
    const row = document.createElement("tr");
    row.innerHTML = `<th>${day}</th>`;

    for (let i = 1; i <= 5; i++) {
      row.innerHTML += `
        <td>
          <input placeholder="Subject"><br>
         <select>
  <option value="class">Class</option>
  <option value="free">Free</option>
  <option value="exam">Exam</option>
  <option value="seminar">Seminar</option>
  <option value="assignment">Assignment</option>
</select>
        </td>
      `;
    }
    table.appendChild(row);
  });
}



buildEmptyGrid();

window.loadTimetable = async () => {
  buildEmptyGrid();

  const dept = Department.value;
  const sem = Semester.value;
  if (!dept || !sem) return alert("Select Department & Semester");

  const ref = doc(db, "timetables", dept.replace(/\s+/g, "_"), "semesters", `sem_${sem}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const table = timetableGrid;

  for (let i = 1; i < table.rows.length; i++) {
    const day = table.rows[i].cells[0].innerText.toLowerCase();
    for (let j = 1; j <= 5; j++) {
      const cell = table.rows[i].cells[j];
      cell.children[0].value = data[day][j].subject;
      cell.children[2].value = data[day][j].availability;
    }
  }
};

window.saveTimetable = async () => {
  const dept = Department.value;
  const sem = Semester.value;
  if (!dept || !sem) return alert("Select Department & Semester");

  const data = {};
  const table = timetableGrid;

  for (let i = 1; i < table.rows.length; i++) {
    const day = table.rows[i].cells[0].innerText.toLowerCase();
    data[day] = {};
    for (let j = 1; j <= 5; j++) {
      const cell = table.rows[i].cells[j];
      data[day][j] = {
        subject: cell.children[0].value,
        availability: cell.children[2].value,
        assignments: [],
        seminars: [],
        exams: []
      };
    }
  }

  const ref = doc(db, "timetables", dept.replace(/\s+/g, "_"), "semesters", `sem_${sem}`);
  await setDoc(ref, data);
  alert("Timetable Saved ✅");
};
