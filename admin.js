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
  projectId: "login-form-74d6e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= TEACHERS ================= */
async function loadTeachers() {
  const q = query(collection(db, "users"), where("role", "==", "teacher"));
  const snap = await getDocs(q);

  const div = document.getElementById("teachersTable");
  div.innerHTML = "";

  if (snap.empty) {
    div.innerHTML = "<p style='text-align:center;'>No teachers found</p>";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Department</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  `;

  snap.forEach(d => {
    const t = d.data();
    const verified = t.verified === true;

    table.innerHTML += `
      <tr>
        <td>${t.name || ""}</td>
        <td>${t.email || ""}</td>
        <td>${t.department || ""}</td>
        <td>${verified ? "Verified" : "Not Verified"}</td>
        <td>
          <button class="action" onclick="toggleVerify('${d.id}', ${verified})">
            ${verified ? "Unverify" : "Verify"}
          </button>
        </td>
      </tr>
    `;
  });

  div.appendChild(table);
}

window.toggleVerify = async (id, status) => {
  await updateDoc(doc(db, "users", id), { verified: !status });
  loadTeachers();
};

loadTeachers();

/* ================= TIMETABLE ================= */
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

function buildGrid() {
  const table = document.getElementById("timetableGrid");
  table.innerHTML = `
    <tr>
      <th>Day / Hour</th>
      <th>H1</th><th>H2</th><th>H3</th><th>H4</th><th>H5</th>
    </tr>
  `;

  days.forEach(day => {
    let row = `<tr><th>${day}</th>`;
    for (let i = 1; i <= 5; i++) {
      row += `<td><input></td>`;
    }
    row += "</tr>";
    table.innerHTML += row;
  });
}

buildGrid();

window.loadTimetable = async () => {
  buildGrid();

  const dept = Department.value;
  const sem = Semester.value;
  if (!dept || !sem) return;

  const ref = doc(db, "timetables", dept.replace(/\s+/g,"_"), "semesters", `sem_${sem}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const table = document.getElementById("timetableGrid");

  for (let i = 1; i < table.rows.length; i++) {
    const day = table.rows[i].cells[0].innerText.toLowerCase();
    for (let j = 1; j <= 5; j++) {
      table.rows[i].cells[j].children[0].value =
        data[day]?.[`P${j}`]?.subject || "";
    }
  }
};

window.saveTimetable = async () => {
  const dept = Department.value;
  const sem = Semester.value;
  if (!dept || !sem) return alert("Select Department & Semester");

  const table = document.getElementById("timetableGrid");
  const data = {};

  for (let i = 1; i < table.rows.length; i++) {
    const day = table.rows[i].cells[0].innerText.toLowerCase();
    data[day] = {};
    for (let j = 1; j <= 5; j++) {
      data[day][`P${j}`] = {
        subject: table.rows[i].cells[j].children[0].value,
        availability: "notknown"
      };
    }
  }

  const ref = doc(db, "timetables", dept.replace(/\s+/g,"_"), "semesters", `sem_${sem}`);
  await setDoc(ref, data);
  alert("Timetable Saved");
};
