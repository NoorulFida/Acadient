import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYMh-jojmpS07qjB4hbAE4VRwU0w9zkw0",
  authDomain: "login-form-74d6e.firebaseapp.com",
  projectId: "login-form-74d6e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load existing timetable if editing
window.onload = async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const deptParam = urlParams.get('dept');
  const semesterParam = urlParams.get('semester');
  
  if (deptParam && semesterParam) {
    document.getElementById('dept').value = deptParam;
    document.getElementById('semester').value = semesterParam;
    updateTimetableTitle();
    await loadExistingCompleteTimetable(deptParam, semesterParam);
  }
};

async function loadExistingCompleteTimetable(dept, semester) {
  try {
    const docRef = doc(db, "completeTimetables", `${dept}_${semester}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Fill timetable grid
      const timetable = data.timetable;
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      
      days.forEach(day => {
        for (let period = 1; period <= 5; period++) {
          const subject = timetable[day]?.[period];
          const input = document.querySelector(`.period-input[data-day="${day}"][data-period="${period}"]`);
          if (input && subject) {
            input.value = subject.subject || subject;
          }
        }
      });
      
      // Fill notes
      if (data.notes) {
        document.getElementById('notes').value = data.notes;
      }
      
      updatePeriodCount();
    }
  } catch (error) {
    console.error("Error loading timetable:", error);
  }
}

window.saveCompleteTimetable = async function() {
  const dept = document.getElementById("dept").value;
  const semester = document.getElementById("semester").value;
  const notes = document.getElementById("notes").value;

  if (!dept || !semester) {
    alert("Please select both department and semester");
    return;
  }

  // Collect all timetable data
  const timetable = {};
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = {
    1: "9:00 - 10:00 AM",
    2: "10:00 - 11:00 AM", 
    3: "11:15 - 12:15 PM",
    4: "1:15 - 2:15 PM",
    5: "2:15 - 3:15 PM"
  };

  let totalPeriods = 0;
  
  days.forEach(day => {
    timetable[day] = {};
    for (let period = 1; period <= 5; period++) {
      const input = document.querySelector(`.period-input[data-day="${day}"][data-period="${period}"]`);
      const subject = input.value.trim();
      
      if (subject) {
        totalPeriods++;
        timetable[day][period] = {
          subject: subject,
          time: timeSlots[period],
          period: period,
          day: day
        };
      } else {
        timetable[day][period] = {
          subject: "Free Period",
          time: timeSlots[period],
          period: period,
          day: day
        };
      }
    }
  });

  const timetableData = {
    department: dept,
    semester: semester,
    createdAt: new Date().toISOString(),
    totalPeriods: totalPeriods,
    timetable: timetable,
    notes: notes,
    days: days,
    hours: 5
  };

  try {
    await setDoc(
      doc(db, "completeTimetables", `${dept}_${semester}`),
      timetableData
    );

    // Show success message
    const successMsg = document.getElementById("successMessage");
    successMsg.innerHTML = `
      ✅ Complete Timetable Saved Successfully!<br>
      <strong>${totalPeriods}/25 Periods Filled</strong><br>
      <small>Department: ${dept} | Semester: ${semester}</small><br>
      <a href="timetableViewComplete.html?dept=${encodeURIComponent(dept)}&semester=${semester}" 
         style="color:#0c5460; font-weight:bold; text-decoration:none;">
        👁️ View Complete Timetable
      </a>
    `;
    successMsg.style.display = "block";
    
    // Scroll to success message
    successMsg.scrollIntoView({ behavior: 'smooth' });
    
  } catch (err) {
    alert("Error saving timetable: " + err.message);
    console.error(err);
  }
};