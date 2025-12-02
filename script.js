/* ----------------------
   Simple page router
   ---------------------- */
function showPage(id){
  document.querySelectorAll(".page").forEach(el => el.classList.add("hidden"));
  const target = document.getElementById(id);
  if(target) target.classList.remove("hidden");
}

/* Wire nav-link anchors and buttons that have data-target */
document.addEventListener("click", function(e){
  const a = e.target.closest("[data-target]");
  if(a){
    e.preventDefault();
    const t = a.getAttribute("data-target");
    showPage(t);
  }
});

/* Demo login/register/logout (no backend) */
document.getElementById("loginBtn").addEventListener("click", function(){
  // basic client-side "login" simulation
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();
  if(!email || !pass){
    alert("Please enter email and password.");
    return;
  }
  // show home
  showPage("homePage");
});

document.getElementById("registerBtn").addEventListener("click", function(){
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPassword").value.trim();
  if(!name || !email || !pass){
    alert("Please fill all fields.");
    return;
  }
  // simple registration simulation -> go to home
  showPage("homePage");
});

document.getElementById("logoutBtn").addEventListener("click", function(){
  // clear demo fields (optional)
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
  showPage("loginPage");
});

/* ----------------------
   Fake doctor data
   ---------------------- */
const doctors = [
  { name: "Dr. Priya Sharma", specialist: "Cardiologist", experience: 8 },
  { name: "Dr. Amit Verma", specialist: "Neurologist", experience: 10 },
  { name: "Dr. Sneha Patil", specialist: "Dermatologist", experience: 6 },
  { name: "Dr. Ramesh Kulkarni", specialist: "Orthopedist", experience: 12 },
  { name: "Dr. Kavita Joshi", specialist: "Pediatrician", experience: 5 }
];

/* ----------------------
   Search doctor
   ---------------------- */
function renderDoctors(list){
  const box = document.getElementById("doctorResults");
  box.innerHTML = "";
  if(list.length === 0){
    box.innerHTML = "<p class='small'>No doctor found.</p>";
    return;
  }
  list.forEach(doc => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <h3>${doc.name}</h3>
        <p style="margin:6px 0;color:var(--muted)">Specialist: ${doc.specialist} • ${doc.experience} yrs</p>
      </div>
      <div>
        <button class="primary book-btn">Book</button>
      </div>
    `;
    // Book button opens appointment page and fills doctor name
    card.querySelector(".book-btn").addEventListener("click", function(){
      document.getElementById("doctorName").value = doc.name;
      showPage("appointmentPage");
    });
    box.appendChild(card);
  });
}

document.getElementById("searchBtn").addEventListener("click", function(){
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  if(!q){
    // show all
    renderDoctors(doctors);
    return;
  }
  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(q) || d.specialist.toLowerCase().includes(q)
  );
  renderDoctors(filtered);
});

/* Enter key on search input triggers search */
document.getElementById("searchInput").addEventListener("keydown", function(e){
  if(e.key === "Enter"){
    document.getElementById("searchBtn").click();
  }
});

/* ----------------------
   Appointment submit
   ---------------------- */
document.getElementById("submitAppointment").addEventListener("click", function(){
  const pname = document.getElementById("patientName").value.trim();
  const dname = document.getElementById("doctorName").value.trim();
  const date = document.getElementById("appDate").value;
  const time = document.getElementById("appTime").value;

  if(!pname || !dname || !date || !time){
    alert("Please fill all appointment fields.");
    return;
  }

  // In a real app we'd send data to the server here.
  // For this frontend demo simply show success page.
  // Optionally clear form:
  document.getElementById("patientName").value = "";
  // keep doctorName cleared to allow new booking
  document.getElementById("doctorName").value = "";
  document.getElementById("appDate").value = "";
  document.getElementById("appTime").value = "";

  showPage("successPage");
});

/* ----------------------
   On load: show login
   ---------------------- */
showPage("loginPage");
