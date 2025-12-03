/* ===========================
   CLEAN WORKING app.js
   NO confirm() popups
   Compatible with your HTML
=========================== */

window.onbeforeunload = null;

/* ---------- Helpers ---------- */
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

/* Fake auth (for frontend demo) */
function fakeSaveUser(email, pass, name) {
    localStorage.setItem("hms_user_email", email);
    localStorage.setItem("hms_user_pass", pass);
    localStorage.setItem("hms_user_name", name);
}
function fakeIsLogged() {
    return localStorage.getItem("hms_user_email") !== null;
}
function fakeGetUserName() {
    return localStorage.getItem("hms_user_name") || "User";
}

/* ---------- Doctors (backend-ready) ---------- */
const doctors = [
    { id: "d1", name: "Dr. Priya Sharma", specialist: "Cardiology", fee: 1200 },
    { id: "d2", name: "Dr. Amit Verma", specialist: "Neurology", fee: 1400 },
    { id: "d3", name: "Dr. Sneha Patil", specialist: "Dermatology", fee: 800 },
    { id: "d4", name: "Dr. Ramesh Kulkarni", specialist: "Orthopedics", fee: 1500 },
    { id: "d5", name: "Dr. Kavita Joshi", specialist: "Pediatrics", fee: 900 },
    { id: "d6", name: "Dr. Neha Jadhav", specialist: "ENT", fee: 700 },
    { id: "d7", name: "Dr. Mohan Shetty", specialist: "Gynecology", fee: 1100 },
    { id: "d8", name: "Dr. Aditya Rao", specialist: "Physician", fee: 600 },
    { id: "d9", name: "Dr. Manish Pathak", specialist: "Urology", fee: 1300 },
    { id: "d10", name: "Dr. Aditi Joshi", specialist: "Psychiatry", fee: 1000 }
];

/* ---------- Appointments ---------- */
function loadAppointments() {
    return JSON.parse(localStorage.getItem("hms_appointments") || "[]");
}
function saveAppointments(list) {
    localStorage.setItem("hms_appointments", JSON.stringify(list));
}
function genId() {
    return "a" + Date.now().toString(36);
}

/* On load logic */
window.onload = () => {
    if (fakeIsLogged()) {
        document.getElementById("userName").innerText = fakeGetUserName();
        renderAppointments();
        showPage("homePage");
    } else {
        showPage("loginPage");
    }
};

/* ---------- Navigation ---------- */
document.getElementById("goRegister").onclick = () => showPage("registerPage");
document.getElementById("goLogin").onclick = () => showPage("loginPage");

document.getElementById("openSearch").onclick = () => { showPage("searchPage"); loadDoctorsList(); };
document.getElementById("openBook").onclick = () => { showPage("bookPage"); loadDragDoctors(); };
document.getElementById("openBilling").onclick = () => showPage("billingPage");

["backHome1","backHome2","backHome3","backHome4","backHome5"].forEach(id => {
    let b = document.getElementById(id);
    if (b) b.onclick = () => showPage("homePage");
});

["logoutBtn","logoutBtn2","logoutBtn3","logoutBtn4","logoutBtn5","logoutBtn6"].forEach(id => {
    let b = document.getElementById(id);
    if (b) b.onclick = () => {
        localStorage.clear();
        showPage("loginPage");
    };
});

/* ---------- Register ---------- */
document.getElementById("regSubmit").onclick = () => {
    let name = document.getElementById("regName").value.trim();
    let email = document.getElementById("regEmail").value.trim();
    let pass = document.getElementById("regPass").value.trim();
    let msg = document.getElementById("regMsg");

    if (!name || !email || !pass) {
        msg.innerText = "All fields required";
        msg.style.color = "red";
        return;
    }

    fakeSaveUser(email, pass, name);

    msg.innerText = "Registered Successfully! Redirecting…";
    msg.style.color = "lightgreen";

    setTimeout(() => showPage("loginPage"), 800);
};

/* ---------- Login ---------- */
document.getElementById("loginSubmit").onclick = () => {
    let email = document.getElementById("loginEmail").value.trim();
    let pass = document.getElementById("loginPassword").value.trim();
    let msg = document.getElementById("loginMsg");

    if (!email || !pass) {
        msg.innerText = "Enter email & password";
        msg.style.color = "red";
        return;
    }

    let savedEmail = localStorage.getItem("hms_user_email");
    let savedPass = localStorage.getItem("hms_user_pass");

    if (email === savedEmail && pass === savedPass) {
        msg.innerText = "Login Successful!";
        msg.style.color = "lightgreen";

        document.getElementById("userName").innerText = fakeGetUserName();
        renderAppointments();
        setTimeout(() => showPage("homePage"), 600);

    } else {
        msg.innerText = "Invalid credentials";
        msg.style.color = "red";
    }
};

/* ---------- Search Doctors ---------- */
function loadDoctorsList() {
    let box = document.getElementById("doctorList");
    box.innerHTML = "";

    doctors.forEach(d => {
        let card = document.createElement("div");
        card.className = "drag-card";
        card.innerHTML = `
            <strong>${d.name}</strong>
            <div class="dept">${d.specialist}</div>
            <div style="margin-top:8px;font-weight:700">₹${d.fee}</div>
        `;
        box.appendChild(card);
    });
}

/* ---------- DRAG & DROP for booking ---------- */
function loadDragDoctors() {
    let container = document.getElementById("dragDoctors");
    container.innerHTML = "";

    doctors.forEach(d => {
        let div = document.createElement("div");
        div.className = "drag-card";
        div.draggable = true;
        div.dataset.id = d.id;
        div.innerHTML = `
            <strong>${d.name}</strong>
            <div class="dept">${d.specialist}</div>
            <div style="margin-top:8px;font-weight:700">₹${d.fee}</div>
        `;

        div.ondragstart = e => {
            e.dataTransfer.setData("text/plain", d.id);
        };

        container.appendChild(div);
    });

    let dropBox = document.getElementById("dropBox");

    dropBox.ondragover = e => e.preventDefault();

    dropBox.ondrop = e => {
        e.preventDefault();
        let id = e.dataTransfer.getData("text/plain");
        let doc = doctors.find(x => x.id === id);

        dropBox.innerText = `Selected: ${doc.name} — ${doc.specialist}`;
        dropBox.dataset.doctorId = id;
    };
}

/* ---------- Book Appointment ---------- */
document.getElementById("bookSubmit").onclick = () => {
    let name = document.getElementById("patientName").value.trim();
    let doctorId = document.getElementById("dropBox").dataset.doctorId || "";
    let date = document.getElementById("appDate").value;
    let time = document.getElementById("appTime").value;
    let msg = document.getElementById("bookMsg");

    if (!name || !doctorId || !date || !time) {
        msg.innerText = "Fill all fields & drop a doctor!";
        msg.style.color = "red";
        return;
    }

    let doc = doctors.find(d => d.id === doctorId);

    let appt = {
        id: genId(),
        patient: name,
        doctor: doc.name,
        doctorFee: doc.fee,
        appointmentFee: 200,
        date, time,
        paid: false
    };

    let list = loadAppointments();
    list.unshift(appt);
    saveAppointments(list);

    msg.innerText = "Appointment Booked!";
    msg.style.color = "lightgreen";

    renderAppointments();

    document.getElementById("dropBox").innerText = "Drop Doctor Here";
    delete document.getElementById("dropBox").dataset.doctorId;
    document.getElementById("patientName").value = "";
    document.getElementById("appDate").value = "";
    document.getElementById("appTime").value = "";
};

/* ---------- Render Appointments ---------- */
function renderAppointments() {
    let box = document.getElementById("appointmentsList");
    if (!box) return;

    let list = loadAppointments();
    box.innerHTML = "";

    list.forEach(a => {
        let div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h3>${a.patient}</h3>
            <p><strong>Doctor:</strong> ${a.doctor}</p>
            <p><strong>Date:</strong> ${a.date} — ${a.time}</p>
            <p><strong>Status:</strong> ${a.paid ? "Paid" : "Pending"}</p>

            <button class="primary payBtn" data-id="${a.id}">Pay</button>
        `;
        box.appendChild(div);
    });

    document.querySelectorAll(".payBtn").forEach(btn => {
        btn.onclick = () => openBill(btn.dataset.id);
    });
}

/* ---------- Billing ---------- */
function openBill(id) {
    let list = loadAppointments();
    let appt = list.find(a => a.id === id);

    document.getElementById("billPatient").innerText = appt.patient;
    document.getElementById("billDoctor").innerText = appt.doctor;
    document.getElementById("billDoctorFee").innerText = appt.doctorFee;
    document.getElementById("billAppFee").innerText = appt.appointmentFee;

    let total = appt.doctorFee + appt.appointmentFee;
    document.getElementById("billTotal").innerText = total;

    document.getElementById("payAmount").value = total;

    document.getElementById("billingNotice").classList.add("hidden");
    document.getElementById("billCard").classList.remove("hidden");

    document.getElementById("payNowBtn").onclick = () => {
        document.getElementById("paymentMsg").innerText = "";
        showPage("paymentPage");

        document.getElementById("paymentSubmit").onclick = () => confirmPayment(id);
    };
}

/* ---------- Payment ---------- */
function confirmPayment(id) {
    let list = loadAppointments();
    let appt = list.find(a => a.id === id);

    appt.paid = true;
    saveAppointments(list);

    document.getElementById("successText").innerText = "Payment Successful!";
    showPage("successPage");
}

