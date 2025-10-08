// ====== CONFIG ======
const EXEC_URL = "https://script.google.com/macros/s/REPLACE_WITH_EXEC_ID/exec"; // /exec URL of your Apps Script Web App [CORS-safe post]

// Optional: base64 EuroKids logo for later (keep blank for now; add when ready)
// const EUROKIDS_LOGO_BASE64 = "data:image/png;base64,....";

// ====== APP STATE ======
const appState = {
  students: [],                 // fill with your sampleStudents or load dynamically
  receipts: [],                 // dynamic only
  schoolInfo: {
    name: "EuroKids Kreeri",
    address: "Kreeri, Baramulla, Jammu & Kashmir - 193502",
    phone: "+91-9797813480",
    email: "eurokidskreeri@gmail.com",
    website: "www.eurokids.in",
    principalName: "Ms. Shahana Kouser",
    affiliation: "EuroKids International",
    regNumber: "EK-KRI-2024"
  },
  currentReceiptNumber: 1,
  currentYear: new Date().getFullYear()
};

// ====== UI HELPERS ======
function setLoading(on) {
  const btn = document.getElementById('generateBtn');
  const overlay = document.getElementById('loadingOverlay');
  if (btn) btn.disabled = !!on;
  if (overlay) overlay.style.display = on ? 'flex' : 'none';
}

// ====== STORAGE ======
function loadData() {
  // Students: either load a predefined array or hydrate from storage if saved earlier
  const savedStudents = localStorage.getItem('eurokids_students');
  if (savedStudents) {
    appState.students = JSON.parse(savedStudents);
  } else {
    // Minimal placeholder to avoid empty dropdown; replace with your prepared list
    appState.students = [];
  }

  // Receipts dynamic only
  const savedReceipts = localStorage.getItem('eurokids_receipts');
  appState.receipts = savedReceipts ? JSON.parse(savedReceipts) : [];

  // Increment based on existing length
  const savedReceiptNumber = localStorage.getItem('eurokids_receiptNumber');
  appState.currentReceiptNumber = savedReceiptNumber
    ? parseInt(savedReceiptNumber, 10)
    : appState.receipts.length + 1;

  // School info (optional hydration)
  const savedSchoolInfo = localStorage.getItem('eurokids_schoolInfo');
  if (savedSchoolInfo) appState.schoolInfo = JSON.parse(savedSchoolInfo);
}

function saveData() {
  localStorage.setItem('eurokids_students', JSON.stringify(appState.students));
  localStorage.setItem('eurokids_receipts', JSON.stringify(appState.receipts));
  localStorage.setItem('eurokids_receiptNumber', String(appState.currentReceiptNumber));
  localStorage.setItem('eurokids_schoolInfo', JSON.stringify(appState.schoolInfo));
}

// ====== INIT FORM DEFAULTS ======
function generateReceiptNumber() {
  const receiptNumber = `EK-KRI-${appState.currentYear}-${String(appState.currentReceiptNumber).padStart(3, '0')}`;
  const receiptNumberEl = document.getElementById('receiptNumber');
  if (receiptNumberEl) receiptNumberEl.value = receiptNumber;
}

// Populate dropdown/list UIs (no-op stubs if markup missing)
function populateStudentDropdown() {
  const studentSelect = document.getElementById('studentSelect');
  if (!studentSelect) return;
  studentSelect.innerHTML = '<option value="">Select existing student or enter new details</option>' +
    appState.students.map(s => `<option value="${s.id}">${s.name} - ${s.class}</option>`).join('');
}

function populateStudentsList() {
  const el = document.getElementById('studentsList');
  if (!el) return;
  el.innerHTML = appState.students.map(student => `
    <div class="student-card">
      <div class="student-avatar">👶</div>
      <div class="student-info">
        <h4>${student.name}</h4>
        <div class="student-details">
          <div><strong>Class:</strong> ${student.class}</div>
          <div><strong>Roll No:</strong> ${student.rollNo}</div>
          <div><strong>Father:</strong> ${student.fatherName || 'N/A'}</div>
          <div><strong>Phone:</strong> ${student.phone || 'N/A'}</div>
        </div>
        <div class="student-actions">
          <button class="btn btn--sm btn--primary" onclick="generateReceiptForStudent(${student.id})">Generate Receipt</button>
          <button class="btn btn--sm btn--secondary" onclick="editStudent(${student.id})">Edit</button>
        </div>
      </div>
    </div>
  `).join('');
}

function populateReceiptsHistory() {
  const grid = document.getElementById('receiptsGrid');
  if (!grid) return;
  grid.innerHTML = appState.receipts.slice().reverse().map(receipt => `
    <div class="receipt-card">
      <div class="receipt-header">
        <span class="receipt-id">${receipt.id}</span>
        <span class="receipt-date">${formatDate(receipt.date)}</span>
      </div>
      <div class="receipt-student">${receipt.studentName}</div>
      <div class="receipt-details">
        ${receipt.class} • Roll: ${receipt.rollNo} • ${receipt.paymentMethod}
      </div>
      <div class="receipt-footer">
        <div class="receipt-total">₹${(receipt.total || receipt.amount).toLocaleString('en-IN')}</div>
        <button class="btn btn--sm btn--primary" onclick="generatePDFFromById('${receipt.id}')">📄 PDF</button>
      </div>
    </div>
  `).join('');
}

function updateDashboard() {
  const totalReceipts = appState.receipts.length;
  const totalStudents = appState.students.length;
  const totalAmount = appState.receipts.reduce((sum, r) => sum + (r.total || r.amount), 0);
  const today = new Date().toISOString().split('T')[0];
  const todayReceipts = appState.receipts.filter(r => r.date === today).length;

  const totalReceiptsEl = document.getElementById('totalReceipts');
  const totalStudentsEl = document.getElementById('totalStudents');
  const totalAmountEl = document.getElementById('totalAmount');
  const todayReceiptsEl = document.getElementById('todayReceipts');

  if (totalReceiptsEl) totalReceiptsEl.textContent = totalReceipts;
  if (totalStudentsEl) totalStudentsEl.textContent = totalStudents;
  if (totalAmountEl) totalAmountEl.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
  if (todayReceiptsEl) todayReceiptsEl.textContent = todayReceipts;

  const recent = appState.receipts.slice(-5).reverse();
  const list = document.getElementById('recentReceiptsList');
  if (list) {
    list.innerHTML = recent.map(r => `
      <div class="receipt-item">
        <div class="receipt-info">
          <h4>${r.studentName}</h4>
          <div class="receipt-meta">${r.id} • ${formatDate(r.date)} • ${r.paymentMethod}</div>
        </div>
        <div class="receipt-amount">₹${(r.total || r.amount).toLocaleString('en-IN')}</div>
      </div>
    `).join('');
  }
}

// ====== STUDENT AUTOFILL ======
function fillStudentDetails() {
  const studentSelect = document.getElementById('studentSelect');
  if (!studentSelect) return;
  const selectedId = studentSelect.value;
  if (!selectedId) return;

  const s = appState.students.find(x => String(x.id) === String(selectedId));
  if (!s) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set('studentName', s.name);
  set('studentClass', s.class);
  set('rollNumber', s.rollNo);
  set('fatherName', s.fatherName || '');
  set('phone', s.phone || '');
}

function generateReceiptForStudent(studentId) {
  const s = appState.students.find(x => x.id === studentId);
  if (!s) return;
  showSection('generate');
  setTimeout(() => {
    const studentSelect = document.getElementById('studentSelect');
    if (studentSelect) {
      studentSelect.value = studentId;
      fillStudentDetails();
    }
  }, 100);
}

// ====== FEE ROWS ======
function addFeeRow() {
  const body = document.getElementById('feeTableBody');
  if (!body) return;
  const rowCount = body.children.length;
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>
      <select class="fee-type-select" onchange="updateFeeAmount(this)">
        <option value="">Select fee type</option>
        <option value="Monthly Fee - Nursery" data-amount="1900">Monthly Fee - Nursery</option>
        <option value="Monthly Fee - Play Group" data-amount="1600">Monthly Fee - Play Group</option>
        <option value="Admission Fee" data-amount="500">Admission Fee</option>
        <option value="Transport Fee" data-amount="800">Transport Fee</option>
        <option value="Books & Stationery" data-amount="600">Books & Stationery</option>
        <option value="Uniform" data-amount="400">Uniform</option>
        <option value="Activities Fee" data-amount="300">Activities Fee</option>
        <option value="Meals" data-amount="1200">Meals</option>
        <option value="Security Deposit" data-amount="1000">Security Deposit</option>
        <option value="Development Fee" data-amount="500">Development Fee</option>
        <option value="Computer Lab Fee" data-amount="200">Computer Lab Fee</option>
      </select>
    </td>
    <td><input type="number" class="fee-amount-input" min="0" step="1" onchange="calculateTotal()" placeholder="0"></td>
    <td>
      <button type="button" class="remove-fee-btn" onclick="removeFeeRow(this)" ${rowCount === 0 ? 'style="display:none"' : ''}>Remove</button>
    </td>
  `;
  body.appendChild(row);
  calculateTotal();
}

function removeFeeRow(btn) {
  btn.closest('tr').remove();
  calculateTotal();
}

function updateFeeAmount(select) {
  const opt = select.selectedOptions[0];
  const inp = select.closest('tr').querySelector('.fee-amount-input');
  if (opt && opt.dataset.amount) inp.value = opt.dataset.amount;
  calculateTotal();
}

function calculateTotal() {
  const amounts = document.querySelectorAll('.fee-amount-input');
  let subtotal = 0;
  amounts.forEach(i => { subtotal += (parseFloat(i.value) || 0); });
  const discount = parseFloat((document.getElementById('discount') || {}).value) || 0;
  const total = Math.max(0, subtotal - discount);
  const st = document.getElementById('subtotal');
  const tt = document.getElementById('totalAmount');
  if (st) st.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (tt) tt.textContent = `₹${total.toLocaleString('en-IN')}`;
}

// ====== VALIDATION + DATA CAPTURE ======
function collectReceiptData() {
  const val = id => (document.getElementById(id) || {}).value || '';
  const studentName  = val('studentName').trim();
  const studentClass = val('studentClass').trim();
  const rollNumber   = val('rollNumber').trim();
  if (!studentName || !studentClass || !rollNumber) {
    alert('Please fill in all required student information');
    return null;
  }

  const feeRows = document.querySelectorAll('#feeTableBody tr');
  const feeItems = [];
  feeRows.forEach(row => {
    const type = (row.querySelector('.fee-type-select') || {}).value || '';
    const amount = parseFloat((row.querySelector('.fee-amount-input') || {}).value) || 0;
    if (type && amount > 0) feeItems.push({ type, amount });
  });
  if (feeItems.length === 0) {
    alert('Please add at least one fee item');
    return null;
  }

  const subtotal = feeItems.reduce((s, x) => s + x.amount, 0);
  const discount = parseFloat(val('discount')) || 0;
  const total = Math.max(0, subtotal - discount);

  return {
    id: val('receiptNumber'),
    studentName,
    class: studentClass,
    rollNo: rollNumber,
    fatherName: val('fatherName'),
    phone: val('phone'),
    date: val('receiptDate'),
    academicSession: val('academicSession'),
    paymentMethod: val('paymentMethod'),
    feeItems,
    subtotal,
    discount,
    total
  };
}

// ====== SYNC TO SHEETS (simple request: avoids preflight) ======
async function syncReceiptToSheets(receipt) {
  const payload = {
    receiptNo: receipt.id,
    date: receipt.date,
    studentName: receipt.studentName,
    className: receipt.class,
    rollNo: receipt.rollNo,
    fatherName: receipt.fatherName || "",
    phone: receipt.phone || "",
    feeType: (receipt.feeItems || []).map(i => i.type).join(", "),
    amount: Number(receipt.total || receipt.amount || 0),
    paymentMethod: receipt.paymentMethod,
    balance: Number(receipt.balance || 0),
    total: Number(receipt.total || receipt.amount || 0)
  };
  const res = await fetch(EXEC_URL, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(payload)
  });
  const json = await res.json().catch(() => ({}));
  return json && json.ok === true;
}

// ====== PDF (from object) ======
function generatePDFFrom(receipt) {
  if (!window.jspdf) { alert('PDF generation library not loaded.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Optional: add EuroKids logo (uncomment when base64 added)
  // const margin = 15;
  // doc.addImage(EUROKIDS_LOGO_BASE64, "PNG", margin, 12, 26, 26);

  // Header
  doc.setFont('helvetica'); doc.setFontSize(18); doc.setFont(undefined, 'bold');
  doc.text('EuroKids Kreeri', 105, 20, { align: 'center' });
  doc.setFontSize(10); doc.setFont(undefined, 'normal');
  doc.text(appState.schoolInfo.address, 105, 28, { align: 'center' });
  doc.text(`Phone: ${appState.schoolInfo.phone} | Email: ${appState.schoolInfo.email}`, 105, 34, { align: 'center' });
  doc.text('EuroKids International - Where Learning Meets Fun!', 105, 40, { align: 'center' });

  // Title
  doc.setFontSize(16); doc.setFont(undefined, 'bold');
  doc.text('FEE RECEIPT', 105, 52, { align: 'center' });

  // Receipt details
  doc.setFontSize(10); doc.setFont(undefined, 'normal');
  doc.text(`Receipt No: ${receipt.id}`, 20, 65);
  doc.text(`Date: ${formatDate(receipt.date)}`, 150, 65);

  // Student info
  let y = 75;
  doc.text(`Student Name: ${receipt.studentName}`, 20, y); y += 6;
  doc.text(`Class: ${receipt.class}`, 20, y);
  doc.text(`Roll No: ${receipt.rollNo}`, 100, y); y += 6;
  if (receipt.fatherName) { doc.text(`Father's Name: ${receipt.fatherName}`, 20, y); y += 6; }
  if (receipt.phone) { doc.text(`Contact: ${receipt.phone}`, 20, y); y += 6; }
  if (receipt.academicSession) { doc.text(`Academic Session: ${receipt.academicSession}`, 20, y); y += 6; }
  doc.text(`Payment Method: ${receipt.paymentMethod}`, 20, y); y += 10;

  // Fee table
  doc.setFont(undefined, 'bold');
  doc.text('Fee Particulars', 20, y);
  doc.text('Amount (₹)', 160, y, { align: 'right' }); y += 2;
  doc.line(20, y, 190, y); y += 8;

  doc.setFont(undefined, 'normal');
  receipt.feeItems.forEach(item => {
    doc.text(item.type, 20, y);
    doc.text(item.amount.toLocaleString('en-IN'), 160, y, { align: 'right' });
    y += 6;
  });

  y += 2; doc.line(20, y, 190, y); y += 8;

  // Totals
  doc.text(`Subtotal: ₹${receipt.subtotal.toLocaleString('en-IN')}`, 160, y, { align: 'right' }); y += 6;
  if (receipt.discount > 0) { doc.text(`Discount: -₹${receipt.discount.toLocaleString('en-IN')}`, 160, y, { align: 'right' }); y += 6; }
  doc.setFont(undefined, 'bold');
  doc.text(`Total Amount: ₹${receipt.total.toLocaleString('en-IN')}`, 160, y, { align: 'right' });

  // Signatures
  y += 20; doc.setFont(undefined, 'normal');
  doc.text('Parent Signature', 20, y);
  doc.text('Authorized Signature', 140, y);
  y += 15; doc.line(20, y, 70, y); doc.line(140, y, 190, y);

  // Footer
  y += 20; doc.setFontSize(8);
  doc.text('Thank you for choosing EuroKids!', 105, y, { align: 'center' });
  doc.text('This is a computer generated receipt. For queries: eurokidskreeri@gmail.com', 105, y + 4, { align: 'center' });

  doc.save(`EuroKids_Receipt_${receipt.id}_${receipt.studentName.replace(/s+/g, '_')}.pdf`);
}

// Helper for history action
function generatePDFFromById(receiptId) {
  const r = appState.receipts.find(x => x.id === receiptId);
  if (r) generatePDFFrom(r);
}

// ====== SUBMIT HANDLER (dynamic only) ======
let submitting = false;

async function handleReceiptSubmission(e) {
  e.preventDefault();
  if (submitting) return;
  submitting = true;
  setLoading(true);

  try {
    const receiptData = collectReceiptData();
    if (!receiptData) return;

    const ok = await syncReceiptToSheets(receiptData).catch(() => false);

    appState.receipts.push(receiptData);
    appState.currentReceiptNumber++;
    saveData();

    updateDashboard();
    populateReceiptsHistory();

    alert(ok ? 'Receipt generated and synced! 🎉' : 'Receipt generated locally! Sync pending.');

    // Reset inputs
    const form = document.getElementById('receiptForm');
    if (form) form.reset();
    const body = document.getElementById('feeTableBody');
    if (body) body.innerHTML = '';
    addFeeRow();
    generateReceiptNumber();
    const today = new Date().toISOString().split('T')[0];
    const dateEl = document.getElementById('receiptDate');
    if (dateEl) dateEl.value = today;

    // PDF from the created object
    generatePDFFrom(receiptData);
  } finally {
    setLoading(false);
    submitting = false;
  }
}

// ====== NAV + INIT ======
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
  if (activeNavItem) activeNavItem.classList.add('active');
  window.scrollTo(0, 0);
}

function formatDate(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('en-IN'); } catch { return iso; }
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  // Basic defaults
  const today = new Date().toISOString().split('T')[0];
  const dateEl = document.getElementById('receiptDate');
  if (dateEl) dateEl.value = today;
  generateReceiptNumber();

  // Ensure at least one fee row exists
  addFeeRow();

  // Wire submit once
  const form = document.getElementById('receiptForm');
  if (form) {
    const clone = form.cloneNode(true); // remove any duplicate listeners
    form.replaceWith(clone);
    clone.addEventListener('submit', handleReceiptSubmission);
  }

  populateStudentDropdown();
  populateStudentsList();
  populateReceiptsHistory();
  updateDashboard();
});







