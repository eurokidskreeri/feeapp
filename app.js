// EuroKids Application State
function setLoading(on) {
  const btn = document.getElementById('generateBtn');         // id on your submit button
  const overlay = document.getElementById('loadingOverlay');
  if (btn) btn.disabled = !!on;                                // prevent clicks [web:455]
  if (overlay) overlay.style.display = on ? 'flex' : 'none';   // show/hide overlay [web:450]
}
let appState = {
    students: [],
    receipts: [],
    feeTypes: [
        {name: "Monthly Fee - Nursery", defaultAmount: 1900},
        {name: "Monthly Fee - Play Group", defaultAmount: 1600},
        {name: "Admission Fee", defaultAmount: 500},
        {name: "Transport Fee", defaultAmount: 800},
        {name: "Books & Stationery", defaultAmount: 600},
        {name: "Uniform", defaultAmount: 400},
        {name: "Activities Fee", defaultAmount: 300},
        {name: "Meals", defaultAmount: 1200},
        {name: "Security Deposit", defaultAmount: 1000},
        {name: "Development Fee", defaultAmount: 500},
        {name: "Computer Lab Fee", defaultAmount: 200}
    ],
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

// Sample data with Indian names and EuroKids context
const sampleStudents = [
   
  { id: 1,  name: "Arwa Bint Mohammad",        class: "Euro Junior", rollNo: "EK/3589/0002/2526", fatherName: "Mir Mohammad",            phone: "7780808702" },
  { id: 5,  name: "Alina Lone",                 class: "Nursery",     rollNo: "EK/3589/0008/2526", fatherName: "Parvaz Lone",             phone: "9797242526" },
  { id: 6,  name: "Ammar Ibn Hamid",            class: "Nursery",     rollNo: "EK/3589/0007/2526", fatherName: "Abdul Hamid Ahangar",     phone: "9906587845" },
  { id: 7,  name: "Bareerah Bilal",             class: "Nursery",     rollNo: "EK/3589/0004/2526", fatherName: "Bilal Ahmad Wani",        phone: "8825076250" },
  { id: 8,  name: "Faizan Hilal",               class: "Nursery",     rollNo: "EK/3589/0026/2526", fatherName: "Hilal Ahmad",             phone: "6005151072" },
  { id: 9,  name: "Medhi Ibn Mohammad",         class: "Nursery",     rollNo: "EK/3589/0009/2526", fatherName: "",                        phone: "" },
  { id: 10, name: "Mohammad Abdullah Lone",     class: "Nursery",     rollNo: "EK/3589/0031/2526", fatherName: "Bilal Ahmad Lone",        phone: "9622422860" },
  { id: 11, name: "Mohammad Arsalan Mir",       class: "Nursery",     rollNo: "EK/3589/0021/2526", fatherName: "Javeed Ahmad Mir",        phone: "8825058265" },
  { id: 12, name: "Mohammad Soliha Lone",       class: "Nursery",     rollNo: "EK/3589/0019/2526", fatherName: "Imtayaz Ahmad Lone",      phone: "9797141267" },
  { id: 13, name: "Muhammad Bin Sajad",         class: "Nursery",     rollNo: "EK/3589/0001/2526", fatherName: "Sajad Nazir",             phone: "7045599019" },
  { id: 14, name: "Muhammad Nouman Sheikh",     class: "Nursery",     rollNo: "EK/3589/0006/2526", fatherName: "Aijaz Ahmad Shiekh",      phone: "7006103893" },
  { id: 15, name: "Syed Daaim",                 class: "Nursery",     rollNo: "EK/3589/0003/2526", fatherName: "Dr Zoofishan Syed",       phone: "8825003308" },
  { id: 16, name: "Syed Hyder Bukhari",         class: "Nursery",     rollNo: "EK/3589/0005/2526", fatherName: "",                        phone: "8899539265" },
  { id: 17, name: "Zeenat Binti Yasir",         class: "Nursery",     rollNo: "EK/3589/0020/2526", fatherName: "Yasir Arfat Bhat",        phone: "9596000590" },
  { id: 18, name: "Syed Faryal Musadiq",        class: "Nursery MTA", rollNo: "EK/3589/0029/2526", fatherName: "Syed Musadiq",           phone: "6006213107" },
  { id: 19, name: "Syed Zimaal Irfan",          class: "Nursery MTA", rollNo: "EK/3589/0028/2526", fatherName: "Syed Irfan",             phone: "6006288767" },
  { id: 22, name: "Arham Hilal",                class: "Play Group",  rollNo: "EK/3589/0023/2526", fatherName: "Hilal Ahmad Akhoon",      phone: "7006407807" },
  { id: 26, name: "Mir Areeba",                 class: "Play Group",  rollNo: "EK/3589/0017/2526", fatherName: "Reyaz Ahmad Mir",         phone: "9622417887" },
  { id: 27, name: "Mohammad Aasim Mir",         class: "Play Group",  rollNo: "EK/3589/0024/2526", fatherName: "Hilal Ahmad Mir",         phone: "7006797139" },
  { id: 28, name: "Mohammad Usman Ganai",       class: "Play Group",  rollNo: "EK/3589/0033/2526", fatherName: "Imtayaz Ahmad Ganai",     phone: "8825026592" },
  { id: 29, name: "Niamat Jan",                 class: "Play Group",  rollNo: "EK/3589/0030/2526", fatherName: "Farooq Ahmad Lone",       phone: "9797002764" },
  { id: 30, name: "Noorain Miran",              class: "Play Group",  rollNo: "EK/3589/0025/2526", fatherName: "Ummar Ali Khan",          phone: "7006221540" },
  { id: 31, name: "Taimur Aijaz Ali",           class: "Play Group",  rollNo: "EK/3589/0032/2526", fatherName: "Aijaz Ahmad", phone :"9898989870"}
];

 

// Google Sheets Web App endpoint (Apps Script /exec URL)
const EXEC_URL =  "https://script.google.com/macros/s/AKfycbxKm4POgX_diaiPsoPNZXTkqMRssSV00ejuJtwJJTa9L6IRugHaiLWSSIB8jMPpUiN1/exec";


async function syncReceiptToSheets(receipt) {
    // Prepare payload matching Code.gs fields A..L
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

    // Use text/plain so the browser sends a "simple request" (no OPTIONS preflight)
    const res = await fetch(EXEC_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload)
    });

    // Expect JSON: { ok:true } from Code.gs
    const json = await res.json().catch(() => ({}));
    if (!json.ok) {
        console.warn("Sheets sync failed:", json.error || res.statusText);
    } else {
        console.log("Sheets sync ok");
    }
}

// Navigation Functions
function showSection(sectionId) {
    console.log('Navigating to section:', sectionId);
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Section activated:', sectionId);
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }

    // Initialize section-specific content
    if (sectionId === 'reports') {
        setTimeout(() => {
            initializeCharts();
        }, 100);
    }
    
    window.scrollTo(0, 0);
}

// Student Management Functions
function fillStudentDetails() {
    const studentSelect = document.getElementById('studentSelect');
    const selectedId = studentSelect.value;
    
    if (selectedId) {
        const student = appState.students.find(s => s.id == selectedId);
        if (student) {
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentClass').value = student.class;
            document.getElementById('rollNumber').value = student.rollNo;
            document.getElementById('fatherName').value = student.fatherName || '';
            document.getElementById('phone').value = student.phone || '';
        }
    }
}

function generateReceiptForStudent(studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (student) {
        showSection('generate');
        setTimeout(() => {
            const studentSelect = document.getElementById('studentSelect');
            if (studentSelect) {
                studentSelect.value = studentId;
                fillStudentDetails();
            }
        }, 100);
    }
}

function editStudent(studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (student) {
        // Pre-fill the add student modal with existing data
        showAddStudentModal();
        setTimeout(() => {
            document.getElementById('newStudentName').value = student.name;
            document.getElementById('newStudentClass').value = student.class;
            document.getElementById('newStudentRoll').value = student.rollNo;
            document.getElementById('newFatherName').value = student.fatherName || '';
            document.getElementById('newStudentPhone').value = student.phone || '';
            
            // Store the ID for updating
            const form = document.getElementById('addStudentForm');
            form.dataset.editingId = studentId;
        }, 100);
    }
}

function showAddStudentModal() {
    const modal = document.getElementById('addStudentModal');
    if (modal) {
        modal.classList.remove('hidden');
        // Reset form and clear any editing state
        const form = document.getElementById('addStudentForm');
        if (form) {
            form.reset();
            delete form.dataset.editingId;
        }
    }
}

function hideAddStudentModal() {
    const modal = document.getElementById('addStudentModal');
    if (modal) {
        modal.classList.add('hidden');
        const form = document.getElementById('addStudentForm');
        if (form) {
            form.reset();
            delete form.dataset.editingId;
        }
    }
}

// Fee Management Functions
function addFeeRow() {
    const feeTableBody = document.getElementById('feeTableBody');
    if (!feeTableBody) return;
    
    const rowCount = feeTableBody.children.length;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <select class="fee-type-select" onchange="updateFeeAmount(this)">
                <option value="">Select fee type</option>
                ${appState.feeTypes.map(fee => 
                    `<option value="${fee.name}" data-amount="${fee.defaultAmount}">${fee.name}</option>`
                ).join('')}
            </select>
        </td>
        <td>
            <input type="number" class="fee-amount-input" min="0" step="1" onchange="calculateTotal()" placeholder="0">
        </td>
        <td>
            <button type="button" class="remove-fee-btn" onclick="removeFeeRow(this)" ${rowCount === 0 ? 'style="display:none"' : ''}>
                Remove
            </button>
        </td>
    `;
    
    feeTableBody.appendChild(row);
    calculateTotal();
}

function removeFeeRow(button) {
    button.closest('tr').remove();
    calculateTotal();
}

function updateFeeAmount(select) {
    const selectedOption = select.selectedOptions[0];
    const amountInput = select.closest('tr').querySelector('.fee-amount-input');
    
    if (selectedOption && selectedOption.dataset.amount) {
        amountInput.value = selectedOption.dataset.amount;
        calculateTotal();
    }
}

function calculateTotal() {
    const feeAmountInputs = document.querySelectorAll('.fee-amount-input');
    let subtotal = 0;
    
    feeAmountInputs.forEach(input => {
        const amount = parseFloat(input.value) || 0;
        subtotal += amount;
    });
    
    const discountEl = document.getElementById('discount');
    const discount = discountEl ? parseFloat(discountEl.value) || 0 : 0;
    const total = Math.max(0, subtotal - discount);
    
    const subtotalEl = document.getElementById('subtotal');
    const totalAmountEl = document.getElementById('totalAmount');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (totalAmountEl) totalAmountEl.textContent = `₹${total.toLocaleString('en-IN')}`;
}

// Preview and PDF Functions
function previewReceipt() {
    const receiptData = collectReceiptData();
    if (!receiptData) return;
    
    const preview = generateReceiptHTML(receiptData);
    const previewEl = document.getElementById('receiptPreview');
    const modalEl = document.getElementById('previewModal');
    
    if (previewEl && modalEl) {
        previewEl.innerHTML = preview;
        modalEl.classList.remove('hidden');
    }
}

function hidePreviewModal() {
    const modalEl = document.getElementById('previewModal');
    if (modalEl) {
        modalEl.classList.add('hidden');
    }
}

function generatePDF() {
    const receiptData = collectReceiptData();
    if (!receiptData) return;
    
    if (!window.jspdf) { alert('PDF generation library not loaded.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // ADD LOGO HERE - Right after creating the PDF document
  const EUROKIDS_LOGO ="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIbGNtcwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABzYXdzY3RybAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWhhbmSdkQA9QICwPUB0LIGepSKOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAF9jcHJ0AAABDAAAAAx3dHB0AAABGAAAABRyWFlaAAABLAAAABRnWFlaAAABQAAAABRiWFlaAAABVAAAABRyVFJDAAABaAAAAGBnVFJDAAABaAAAAGBiVFJDAAABaAAAAGBkZXNjAAAAAAAAAAV1UkdCAAAAAAAAAAAAAAAAdGV4dAAAAABDQzAAWFlaIAAAAAAAAPNUAAEAAAABFslYWVogAAAAAAAAb6AAADjyAAADj1hZWiAAAAAAAABilgAAt4kAABjaWFlaIAAAAAAAACSgAAAPhQAAtsRjdXJ2AAAAAAAAACoAAAB8APgBnAJ1A4MEyQZOCBIKGAxiDvQRzxT2GGocLiBDJKwpai5+M+s5sz/WRldNNlR2XBdkHWyGdVZ+jYgskjacq6eMstu+mcrH12Xkd/H5////2wBDAAkGBwgHBgkICAgKCgkLDhcPDg0NDhwUFREXIh4jIyEeICAlKjUtJScyKCAgLj8vMjc5PDw8JC1CRkE6RjU7PDn/2wBDAQoKCg4MDhsPDxs5JiAmOTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTn/wAARCASeBJ4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3GiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAopGYKMsQB7momuoF6yD8OaLhYmoqv9tg/vH8jSrdwH+PH1FK6HZk9FIrKwyrAj2NLTEFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAASAMngVQuL7krF/wB9GmXtzvYxofkHX3qpUSl2NIx7jmZnOWYk+9NooqCwooooAcrMpypIPtVy3vuQsv8A31VGihOwmkzdByMjpRWfYXG1hEx4P3fatCtU7mTVgooopiCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqvezeVFgfebgVYrKvZN85HZeBUydkVFXZXooorM1CiiigAooooAKKKKAFrXtpfNhVu/Q/Wser2mv8zp6jIqovUma0L9FFFaGQUUUUAFFFFABTJZUiXLnH9ajurhYFwOXPQVlu7SMWY5JqXKxUY3LUt87cRjaPXqarNLI/wB52P40yis22zRJIXc3qfzqRLiZOkh/HmoqKB2L0V/2kX8Vq5HIki5RgRWLTkdo2DKSDVKTJcF0Nuiq9rciYbWwHHb1qxWidzNqwUUUUCCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAa7bEZj2GaxScnJ6mtS+bbbN74FZVZzNIbBRRRUlhRTZZEijaSR1RFGSzHAArmb7xvYQOUtopLkj+L7qn8Tz+lJuxvRw1Wu7U43OoorjE8fKWG/TSF9RNk/+g1rab4s0y+cRl2t5DwBKMA/Q9KXMjapl2Jpq8ofr+Ru0UUVRxBU9m225T3OKgp0Z2yKfQg0IGbdFFFbGAUUUUAFRXMwgjz1Y9BUjMFUsTgDrWRcSmaQsenYegqZOxUVcY7F2LMck02iiszUKKKKACiiigAooooAVWKsGU4I6VsW8omiD9+h+tY1XNNfEjJ2IzVRepM1oaNFFFaGQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAFPUj+7QepzWdV7UzzGPrVGspbmsdgoorG8XagdP0WUocSzfuk/HqfyzUvQ2o0nVmoR3Zx/i7Xn1K6a2gf/AEOI4GP4z6/T0rnqKKzPvKFGFCCpw2QUUUUGp2XgrX3Ey6bdyFlbiFmPIP8Ad+npXcV4sjtG6uhIZTkEdjXr+lXYv9Nt7odZEBPse/65qovofLZ1hI05qrBaPf1/4JaoooqzwzcHIBpabH9xfoKdWxgFFFMlcRxs57CgCnqM3SJT7tVGnMxZix6k5ptYt3ZslZBRRVLVtVtdJtjNcv1+4g+859BSLhCU5KMVdsu0V5lq3irUdQZlSQ20PZIjg49z1NYhkkL+YXYv/ezzU8x7lLIqko3nKz+89oory7TPE2p6eygTmeIdY5TuGPY9RXfaHrdrrMBaLKSr9+Jjyv8AiKalc4sXltbDLmese6NOiiiqPOCp7M4uU+uKgqa0/wCPmP60LcT2NeiiitjEKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDO1I/vEHtVOrmpf61f92qdZS3No7BXCfEW53Xdrag8IhkI9ycf0/Wu7ry/xlMZvEV16JtQfgB/XNRI9jJafNib9k3+n6mLRRRUH1wUUUUAFei+AJ/N0Roj1hlZR9Dg/wAya86rt/hxITFfx9gyN+ef8Kcdzy84hzYVvs1/l+p2dFFL1rQ+ONtOFA9qWiitjAKoajLlhED05NXmYKpY9AM1iyOZHZz1JzUyehcFqNoooJAGScAVmaFTVdQg0uye6nPyr0UdWPYCvK9V1G41S7a5uGyTwq9lHoK0fFmsnVdQKxt/osJKxjs3q34/yrDrNu59fleAWHhzzXvP8PL/ADCiiikesFWdOvZtOvI7qBsOhzjsR3BqtRQKUVJOL2Z7LaXCXdrFcR/clQOPxFS1heCZDJ4dtwTnYWX/AMeP+NbtaLY+BxFP2VWUOzaCrNgubkH0BNVqv6YnDv8AgKqO5hLYvUUUVqYhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAZ2pD94h9qp1e1MfNGfY1RrKW5tHYK8j1yTzdZvn9Z3x9MmvXK8c1A5v7k5zmVufxNZyPoMhXvzfkiCiiipPpgooooAK7L4cf66/wD91P5muNrsvhx/rr//AHU/rTW55+a/7pP5fmjuKfEMyIPUimVLajNxGPfNaI+KZsUUUVsYFXUJNsIQdWP6VmVYvpN9wR2Xiq9ZSd2bRVkFc3441b7Fp4tImxPc8HB5VO5/Hp+ddGzBFLMQFAySewryXXdRbVNUmuSfkJ2xj0UdP8fxqJM9bKcL7etzS2jr8+hQoooqD7AKKKKACiilRWd1RQSzHAA7mgD07wZEYvDtrkYL7m/Njj9K26gsbcWllBbr0ijVPyFT1otj4DEVPaVZT7thWvaJ5cCjueTWbbR+bMq9up+lbFaQXU5pvoFFFFWZhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAUdTHyxn3NUK0tSH7lT6NWbWUtzWGwV4zc/wDHzL/vn+dezV43eqFvZ1HQSMP1rOR9HkHxVPl+pDRRRUn0gUUUUAFdv8N1ITUH7Exj8t3+NcRXffDpMaddP6ygfkB/jTW55mbu2El8vzOsqzYDNyp9ATVarumr+8dvQYrWO58ZLY0KbI+yNnPYZp1VNRfbCF/vGtG7IySuzOJJJJ6mkoorI2Od8caj9j0k26HEt0dn/Af4v8PxrzetvxhqH2/WpQpzFB+6X8Op/PNYlZt3Z9rlmH9hh0nu9WFFFFI9AKKKKACt3wZY/bdbiZhmO3/et9R0/XH5VhV6R4H077HpP2hxiW6O/wD4D/D/AFP400rs8/M8R7DDu270R0VFFPiQySKg6k1ofFF7TotqGQ9W4H0q5SKoVQo6AYFLWqVkYt3YUUUUxBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAV78Ztm9iDWVWxcjdbyD/AGTWPWc9zSGwV4/qi7NTvFxjEzjH/AjXsFeS+Ik8vXb9eeZmbn3Of61lI+hyF/vJryM+iiipPpwooooAK9H8Ax7NCLf35mb9AP6V5xXqPg6Py/DloD1YM35sacdzx88lbDpd2v1NmtHTVxG7epxWdWtYrttl9+a2jufIT2J6zNQfdPt7KMVpnisSRt8jN6nNOb0JgtRtUdcvhp2lXF1n5lXCf7x4H61eri/iJfYW2sFbr+9cfoP61m3od+Boe3rxh06+hxJJJJJyT1JooorM+6CiiigAooooA0NA046pqkNtg+XndIR2Udf8Pxr1lVCKFUAKBgAdhXN+BtL+x6cbuRcTXOCPZO359fyrpauKPj82xXtq3Kto6fPqFaGnQ4UynqeB9KpwRmWUIO/X6VsKAqhQMAcCtIrqePN9BaKKK0MwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBGGVI9axCMHFblY1wu2dx/tGomXAjry7xhH5fiO8GOCVYfior1GvOPH0ezXt39+FW/mP6VlI93I5WxDXdf5HOUUUVB9YFFFFABXrmgx+VotihGCIEJ+pGa8jAycDrXs8EflQRx/3FC/kKqJ8/n0vchHzY+tuJdkaL6ACseFd8qL6kVtVtA+XmQ3b7Ldz6jFZFaGpNhET1Oaz6Utxw2CvJ/Ed79v1q6mBym/Yn+6OB/jXpGv3n2DR7q4BwwQhP948D9TXktZSPpMho/FVfp/n+gUUUVJ9GFFFFABWp4b0s6rqkcJB8lPnlP+yO349Ky69P8JaT/ZemKZFxcT4eTPUeg/D+pppXPPzLF/VqLa+J6L+vI21AVQqgAAYAHaiirFnD5suSPlXk1okfFN9S5Yw+XHuI+Zv0FWaKK1SsYt3CiiimIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKy9QXFwT/eANalUNTXlG+oqZbFQ3KNcL8Ro8XdlL/ejZfyP/wBeu6rkviLFmwtJsfdlK/mM/wDstYy2PWyqXLi4fP8AI4KiiioPtAooooAs6bH5uo2sf9+ZF/MivYa8q8LR+b4gsV9JN35An+leq1UT5jPpfvIR8v6/Is2C7rkH+6Ca1KoaYvLt9BV+t47Hzk9zM1Bt0+P7oxVWpJ23zO3qajrN7mi2OP8AiJd7ba1s1PLsZG+g4H8z+VcLW34yu/tWvzgHKw4iH4df1JrErJ7n3GW0fZYaK76/eFFFFB3BRRT4YnnmSKJS0jsFUDuTQDdtWb3gvSf7Q1IXEq5t7Yhjnozdh/X/APXXpNUdE01NK06K1TBYDLsP4mPU1eq0rHxGYYv6zWclstEKqlmCgZJ4FbEEQhjCDr3PqarafBgeaw5P3au1rFdTzZvoFFFFWQFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABVbUF3W5P90g1Zpk674XX1FJ7DW5i1g+N4fN8PTMBkxsr/rj+tb1Uddh+0aNexDkmFsfUDIrF7HbhZ8laEuzR5HRRRWZ98FFFFAHQeBY9/iCNsf6uN2/TH9a9KrgPh3HnU7mX+7Dt/Mj/AArv6uOx8hnUr4m3ZI1NPXbbg/3iTU0rbI3b0BNEC7IUX0AqK/bbbN7kCt9keHuzKqO6mW2tpZ3+7Ghc/QDNSVg+Nrr7NoEqg4aZhGP5n9Aaxex2Yel7WrGHdnms0jTSvK5y7sWJ9zTaKKzPv0raBRRRQAV2XgHSN7tqcy/KuVhz69z/AE/OuX0uxk1K/htYurnk/wB0dzXrdpbxWltFbwrtjjUKopxVzxc5xfsqfso7y/L/AIJLU1rCZpMfwjk1EoLEADJPSte2hEMYXv1JrWKufJSdiQAAYHQUtFFamQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBizLsldfQmo2UOpVhkEYNW9QXbcZ/vDNVaxe5un1PGbiIwTyRHrGxU/gcVHWr4pg+z+IL1MYDSbx/wIZ/rWVWR+g0Z+0pxn3SYUUUUGh23w4j+W/lPcoo/8ez/Su3jXfIq+pArkvh2mNKuX9Z8fko/xrsrJd1yntzWkT4nNZXxU3/Wxq1S1NvlRfUk1drN1Fszgei1rLY8uO5UrhviLdbri0tAeEUyMPqcD+R/Ou5ryzxZdfatfu2ByqN5Y/wCA8H9c1jI9zJaXPiebsv8AgGRRRRUH1wUUVq+GtLOrapHEwPkp88p/2R2/HpQRVqRpQc5bI63wLpP2SyN9KuJrgfLn+FP/AK/X8q6ihQFUKoAAGAB2qe1g86TB+6OtaJdD4PE4iVeo6kupZ0+DA81hyfu1doAwMDpRWyVjjbuFFFFMQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBS1JMoj+hxWfWvdpvt3HoM1kVnLc1g9Dz34gweXq8Uw6SxD8wSP5Yrl67z4i2+6ytLjHKSFCfqM/+y1wdYvc+3yupz4WHloFFFFI9A9K8CJt8Pof70jH9cf0rrNNXMrN6Cua8HJs8OWY4yQzfmxrqdMHyO3qQK1h0PgsfK9eo/N/mXayLtt1xIffFa9YjHcxPqc1czjgQ3My29vLM33Y0Ln6AZrxuR2lkeRzlnJYn3NeneMbn7N4fucH5pMRj8Tz+ma8vrGW59XkVO1OVTu7fd/w4UUUVJ7wV6h4S0n+y9LXzFxcT4eT1HoPw/qa47wbpX9o6oJZFzBb4dsjgnsP6/hXpdVFdT5zO8XtQj6v9F+o5VLMFUZJ6VrwRCGMKOvc+pqtp8GB5rDk/dq7W0V1PmZvoFFFFWQFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAAeRisSRdjsvocVt1l36bbgnswzUTLg9TnfGFv9o8PXQA+aMCQfgef0zXl1ey3cIubWaBukqFDn3GK8bZSjFWGGBwRWMtz6vIal6codnf7/8AhhKKKKk949Y8Nrt0GxH/AEyB/Oum08Yt8+pJrn9EXZo1gpGCLePI99oro7MYtox7ZraB+e4p3qSfmx87bYXPoprFrVvji2b3wKyqc9zGGxx3xGuMQWdsD95mkP4DA/ma4aui8d3Hna80YORDGqfj1/rXO1g9z7nLKfs8LBd9fvClUFiFUEk8ADvSV0ngfSvtupfapFzDbENz3ft+XX8qDpxFaNCm6kuh2fhzTBpWlxQEDzW+eU/7R/w6Vs20JmlC/wAI5NRVrWkPkxAH7x5NbRR8FWqynJzluyUAAYHQUtFFanMFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVT1JMxq/ocVcqO4TzIHXvjik1dDTszGryfxLbfZddvYwMAyFx9G5/rXrFef/EK28vVILgdJosH6g/4EVhI9/JKnLiHHujlaKKKg+sPY9PUrp9sp6iJR+groYRiFB6KKwLPi0gB/wCea/yroVGAB6VvTPzms/eZV1I4iUerVm1e1M/NGvsTWRqdx9l065uM4McTMPqBxSluOnFysl1PKtZuPtWrXc/Z5WI+meP0qnRRWJ+hwioRUV0FUFiFUEk8ADvXq/h7ThpelQ25A8zG6Q+rHr+XT8K4nwRpv23VRcOuYbXDnPdv4f8AH8K9JVSzBR1JwKqKPnM8xV5Kgumr/QtWEO+TeR8q/wA60qZDGIo1QdutProSsj5mTuwooopiCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMadPLmdfQ8VyfxBtvN0mGcDmGXn6EY/niu11JMSK/qMVheILb7Xot5DjJMZI+o5H6isJI78DV9nXhPzPJaKKKzPvT2m2GY4h7Ct6sKzGfIH+7W7XRDY/N6u5maiczgei1zHja48jw/OAcGVljH55P6A10l6c3L/lXD/EafFvZ24P3nZyPoMD+ZrOfU78tp8+Jprzv92pw1FFbPhLTv7R1mIMMxQ/vH98dB+eKzPta1WNKDnLZHd+FtN/szR4o2XE0n7yT1ye34DAro9OhyxlPQcCqiKXcKvUnFbMSCONUHQCtoI/P8RVlUm5y3Y6iiitTnCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCvfJvtye681lEZGD0rcYBlIPQjFYrqUcqeoOKzmjSDPHNTtjZ6jc22MeXIyj6Z4/Sq1dH48tfI1vzgPlnjDZ9xwf5D865ysD9BwtX2tGM+6Pa7AZNv/wGtysPTju+zkdCFNbldENj8+q/EY05zNIf9o15v8QJzJrSRZ4iiAx7kk/4V6KTkk+teUeJ5hca/fODnEmz/vn5f6VlI9zI6d67l2Rl16R4H077HpAuHGJbo7/+A/w/4/jXCaNYtqWp29qAcO3zEdlHJ/SvXYowAkca4AwqgUoo7c8xHLBUV11f9f1sXtOiyTKe3Aq/TIkEcaoOgFProSsj5Nu7CiiimIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACszUE2z7uzDNadVdRTdCG7qf0qZLQqLszgPiHa+Zp9tdAcxSFT9GH+IH51wNeteIbX7bot3CBljGWUe45H8q8lrnlufZZJV58O4fyv8z2rSPuWn+4v8q2pTiJz6KawtDP+jWJPP7tP5Ctu6OLeT6VtD4T5GsvfZjOwRGZjgKMmvGZ5TNPJK3V2LH8TmvWdem+z6LeyA4IhYD6kYH868lijaWRI0G53IVR6k1lI+lyGFozm/I7b4e6ftjn1B15b93H9O5/l+Vd9p0W6QyEcL0+tZWmWa2GnwWidI0AJ9T3P510NtH5UKr36n61pBHh4/Ee3rSn329CWiiitTgCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKbIodGU9CMU6igDDYYJUjpwa8f1e1+xapdW2MCOQhfp2/TFe0X6bJyezc1594u0W4vvEVqtqmXu0wSegK9ST6AYrnmj38kxCp1WpOya/L/AIFzsPDPzaZppHIEEZJ9MKK2bi4ilUwhm+bjcBxWXZQix0+3so33LCgQvjG8gdfpVq2VQ3mv9xP1PpVp2Vjya1pTcl3MjxJp93qGlzWdooLu6qzFtqqAckk/hWXofg23067hu7q8aeWM52Rx4UHHqeT+QrqJZTJx0UdFFNjRpG2qMmpsrm9PGVqdJ0ouye5atYEklDoxKqckMOfatGqUc0FqmwNvbvtoGoJnlCB9a1TSOJpsu0UisGUMDkHkUtUQFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRUcsyRDLtj27mqM1678J8i/rSbSGotl+SWOMfOwFVZL9RwiE+54qgSSck5NJUOTNFBEs87zkbscdMChwI0AwPMYcnuAe38qipSSxyTk1NyrCU9nLKq8AL6UyigApQSOh60lFAD0jdzhVJp+yOP77bz/dU/1phkcqFLHaO3amUAacN5CQF5THGD0qyCCMggj1FYdPjleI5RiKpT7kOHY2qKpwXytxKNp9R0q2CCMg5FWnchpoWiiimIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA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5z8q55/AAdPwpLBtVvaX0vcPbe5y2NL4fo8njLSVj+8Jtx4zwASf0Brf+NX/ACNNr/14p/6HJXR/C7wXcaU7axqcRiuXTbBC33owerN6E9Mduc+3OfGr/kabX/rxT/0OSmqsZ4pcvRByuNPU2/gd/wAeur/78X8mr0+vMPgd/wAeur/78X8mr0+vPxn8aX9dDej8CCiiiuY0CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqq2nWLMWaytixOSTEuSfyq1RTTaAbFGkSCONFRB0VRgD8KdRRSARlDKVYAqRggjgiqv9maf/z42v8A36X/AAq3RTTaAAMDA6UUUUgKt7p1jqChb2yt7kDoJolfH5iqtt4c0O1YNBpFgjg5DCBcj8cVqUVSlJKyYrIAMDA6UUUVIwooooAZLHHNG0cqK6MMFWGQfwrKPhbw+0nmHRNP3f8AXuuPyxitiiqUmtmJpPcjt4IbaIRW8McUa9EjUKB+AqSiipGMmijnjaOaNJI24KuoIP4GsseF/D4k8waJp27/AK9kx+WK16KpSa2YmkxkUUcMYjijSNF6KowB+FRS2FnK5kktLd3PVmjBJ/GrFFK7GRwwRW6bIYkjTOdqKAM/hTZ7S2uGDT28MrAYBdAxA/GpqKLsCGC1t7ckwW8URbrsQLn8qmoopAZ15oGj3zmS60uymkPV3hUsfxxmpbHStO0/P2KwtbbPBMMSoT+Qq5RVc0rWuKyCiiipGUL7RNK1By95ptpcOf45IVZvzIzTrHSNM047rLT7W2bpuihVSfxAq7RVc0rWuKyCoJ7O1uHDz20MrAYBdAxx+NT0VN7DIoLaC3BEEEUQbrsQLn8qloooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z" ; // your base64 string
  
  // Place logo at top-left (15mm from left, 12mm from top, 26mm wide, 26mm tall)
  doc.addImage(EUROKIDS_LOGO, "JPEG", 15, 12, 46, 26);
    
    // Set font
    doc.setFont('helvetica');
    
    // Header with EuroKids branding
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('EuroKids Kreeri', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(appState.schoolInfo.address, 105, 28, { align: 'center' });
    doc.text(`Phone: ${appState.schoolInfo.phone} | Email: ${appState.schoolInfo.email}`, 105, 34, { align: 'center' });
    doc.text('EuroKids International - Where Learning Meets Fun!', 105, 40, { align: 'center' });
    
    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('FEE RECEIPT', 105, 52, { align: 'center' });
    
    // Receipt details
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Receipt No: ${receiptData.id}`, 20, 65);
    doc.text(`Date: ${formatDate(receiptData.date)}`, 150, 65);
    
    // Student info
    let yPos = 75;
    doc.text(`Student Name: ${receiptData.studentName}`, 20, yPos);
    yPos += 6;
    doc.text(`Class: ${receiptData.class}`, 20, yPos);
    doc.text(`Roll No: ${receiptData.rollNo}`, 100, yPos);
    yPos += 6;
    if (receiptData.fatherName) {
        doc.text(`Father's Name: ${receiptData.fatherName}`, 20, yPos);
        yPos += 6;
    }
    if (receiptData.phone) {
        doc.text(`Contact: ${receiptData.phone}`, 20, yPos);
        yPos += 6;
    }
    doc.text(`Academic Session: ${receiptData.academicSession}`, 20, yPos);
    yPos += 6;
    doc.text(`Payment Method: ${receiptData.paymentMethod}`, 20, yPos);
    yPos += 10;
    
    // Fee table
    doc.setFont(undefined, 'bold');
    doc.text('Fee Particulars', 20, yPos);
    doc.text('Amount (₹)', 160, yPos, { align: 'right' });
    yPos += 2;
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    
    doc.setFont(undefined, 'normal');
    receiptData.feeItems.forEach(item => {
        doc.text(item.type, 20, yPos);
        doc.text(item.amount.toLocaleString('en-IN'), 160, yPos, { align: 'right' });
        yPos += 6;
    });
    
    yPos += 2;
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    
    // Totals
    doc.text(`Subtotal: ₹${receiptData.subtotal.toLocaleString('en-IN')}`, 160, yPos, { align: 'right' });
    yPos += 6;
    
    if (receiptData.discount > 0) {
        doc.text(`Discount: -₹${receiptData.discount.toLocaleString('en-IN')}`, 160, yPos, { align: 'right' });
        yPos += 6;
    }
    
    doc.setFont(undefined, 'bold');
    doc.text(`Total Amount: ₹${receiptData.total.toLocaleString('en-IN')}`, 160, yPos, { align: 'right' });
    
    // Signatures
    yPos += 20;
    doc.setFont(undefined, 'normal');
    doc.text('Parent Signature', 20, yPos);
    doc.text('Authorized Signature', 140, yPos);
    
    yPos += 15;
    doc.line(20, yPos, 70, yPos);
    doc.line(140, yPos, 190, yPos);
    
    // Footer
    yPos += 20;
    doc.setFontSize(8);
    doc.text('Thank you for choosing--++ EuroKids!', 105, yPos, { align: 'center' });
    doc.text('This is a computer generated receipt. For queries: eurokidskreeri@gmail.com', 105, yPos + 4, { align: 'center' });
    
    // Save PDF
    doc.save(`EuroKids_Receipt_${receiptData.id}_${receiptData.studentName.replace(/\s+/g, '_')}.pdf`);
    
    hidePreviewModal();

   // E) Reset form & defaults
    const form = document.getElementById('receiptForm');
    if (form) form.reset();
    const body = document.getElementById('feeTableBody');
    if (body) body.innerHTML = '';
}

function regenerateReceipt(receiptId) {
    const receipt = appState.receipts.find(r => r.id === receiptId);
    if (!receipt) return;
    
    if (!window.jspdf) {
        alert('PDF generation library not loaded. Please try again.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Use the same PDF generation logic as above
    doc.setFont('helvetica');
    
    // Header
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('EuroKids Kreeri', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(appState.schoolInfo.address, 105, 28, { align: 'center' });
    doc.text(`Phone: ${appState.schoolInfo.phone} | Email: ${appState.schoolInfo.email}`, 105, 34, { align: 'center' });
    doc.text('EuroKids International - Where Learning Meets Fun!', 105, 40, { align: 'center' });
    
    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('FEE RECEIPT', 105, 52, { align: 'center' });
    
    // Receipt details
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Receipt No: ${receipt.id}`, 20, 65);
    doc.text(`Date: ${formatDate(receipt.date)}`, 150, 65);
    
    // Student info
    let yPos = 75;
    doc.text(`Student Name: ${receipt.studentName}`, 20, yPos);
    yPos += 6;
    doc.text(`Class: ${receipt.class}`, 20, yPos);
    doc.text(`Roll No: ${receipt.rollNo}`, 100, yPos);
    yPos += 6;
    if (receipt.fatherName) {
        doc.text(`Father's Name: ${receipt.fatherName}`, 20, yPos);
        yPos += 6;
    }
    doc.text(`Payment Method: ${receipt.paymentMethod}`, 20, yPos);
    yPos += 10;
    
    // Fee table
    doc.setFont(undefined, 'bold');
    doc.text('Fee Particulars', 20, yPos);
    doc.text('Amount (₹)', 160, yPos, { align: 'right' });
    yPos += 2;
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    
    doc.setFont(undefined, 'normal');
    if (receipt.feeItems && receipt.feeItems.length > 0) {
        receipt.feeItems.forEach(item => {
            doc.text(item.type, 20, yPos);
            doc.text(item.amount.toLocaleString('en-IN'), 160, yPos, { align: 'right' });
            yPos += 6;
        });
    } else {
        doc.text('Fee Payment', 20, yPos);
        doc.text((receipt.total || receipt.amount).toLocaleString('en-IN'), 160, yPos, { align: 'right' });
        yPos += 6;
    }
    
    yPos += 2;
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    
    // Total
    doc.setFont(undefined, 'bold');
    doc.text(`Total Amount: ₹${(receipt.total || receipt.amount).toLocaleString('en-IN')}`, 160, yPos, { align: 'right' });
    
    // Signatures
    yPos += 20;
    doc.setFont(undefined, 'normal');
    doc.text('Parent Signature', 20, yPos);
    doc.text('Authorized Signature', 140, yPos);
    
    yPos += 15;
    doc.line(20, yPos, 70, yPos);
    doc.line(140, yPos, 190, yPos);
    
    // Footer
    yPos += 20;
    doc.setFontSize(8);
    doc.text('Thank you for choosing EuroKids!', 105, yPos, { align: 'center' });
    doc.text('This is a computer generated receipt.', 105, yPos + 4, { align: 'center' });
    
    // Save PDF
    doc.save(`EuroKids_Receipt_${receipt.id}_${receipt.studentName.replace(/\s+/g, '_')}.pdf`);
}

// Export Functions
function exportToCSV() {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `EuroKids_Receipts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToGoogleSheets() {
    alert('Google Sheets integration is ready! Connect your eurokidskreeri@gmail.com account to automatically sync all receipt data.');
}

function connectGoogleSheets() {
    alert('Google Sheets connection feature is ready for implementation. This will sync all data to eurokidskreeri@gmail.com account.');
}

function generateCSVContent() {
    let csvContent = "Receipt Number,Date,Student Name,Class,Roll Number,Father Name,Payment Method,Amount,Academic Session\n";
    
    appState.receipts.forEach(receipt => {
        csvContent += `"${receipt.id}","${receipt.date}","${receipt.studentName}","${receipt.class}","${receipt.rollNo}","${receipt.fatherName || ''}","${receipt.paymentMethod}","${(receipt.total || receipt.amount)}","${receipt.academicSession || '2025-26'}"\n`;
    });
    
    return csvContent;
}

// Helper Functions
function loadData() {
    const savedStudents = localStorage.getItem('eurokids_students');
    const savedReceipts = localStorage.getItem('eurokids_receipts');
    const savedReceiptNumber = localStorage.getItem('eurokids_receiptNumber');
    const savedSchoolInfo = localStorage.getItem('eurokids_schoolInfo');

    if (savedStudents) {
        appState.students = JSON.parse(savedStudents);
    } else {
        appState.students = [...sampleStudents];
        saveData();
    }

    if (savedReceipts) {
        appState.receipts = JSON.parse(savedReceipts);
    } else {
        appState.receipts = [...sampleReceipts];
        saveData();
    }

    if (savedReceiptNumber) {
        appState.currentReceiptNumber = parseInt(savedReceiptNumber);
    } else {
        appState.currentReceiptNumber = appState.receipts.length + 1;
    }

    if (savedSchoolInfo) {
        appState.schoolInfo = JSON.parse(savedSchoolInfo);
    }
}

function saveData() {
    localStorage.setItem('eurokids_students', JSON.stringify(appState.students));
    localStorage.setItem('eurokids_receipts', JSON.stringify(appState.receipts));
    localStorage.setItem('eurokids_receiptNumber', appState.currentReceiptNumber.toString());
    localStorage.setItem('eurokids_schoolInfo', JSON.stringify(appState.schoolInfo));
}

function generateReceiptNumber() {
    const receiptNumber = `EK-KRI-${appState.currentYear}-${appState.currentReceiptNumber.toString().padStart(3, '0')}`;
    const receiptNumberEl = document.getElementById('receiptNumber');
    if (receiptNumberEl) {
        receiptNumberEl.value = receiptNumber;
    }
}

function populateStudentDropdown() {
    const studentSelect = document.getElementById('studentSelect');
    if (studentSelect) {
        studentSelect.innerHTML = '<option value="">Select existing student or enter new details</option>' +
            appState.students.map(student => 
                `<option value="${student.id}">${student.name} - ${student.class}</option>`
            ).join('');
    }
}

function populateStudentsList() {
    const studentsList = document.getElementById('studentsList');
    if (studentsList) {
        studentsList.innerHTML = appState.students.map(student => `
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
                        <button class="btn btn--sm btn--primary" onclick="generateReceiptForStudent(${student.id})">
                            Generate Receipt
                        </button>
                        <button class="btn btn--sm btn--secondary" onclick="editStudent(${student.id})">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function populateReceiptsHistory() {
    const receiptsGrid = document.getElementById('receiptsGrid');
    if (receiptsGrid) {
        receiptsGrid.innerHTML = appState.receipts.slice().reverse().map(receipt => `
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
                    <button class="btn btn--sm btn--primary" onclick="regenerateReceipt('${receipt.id}')">
                        📄 PDF
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Populate class filter
    const classFilter = document.getElementById('classFilter');
    if (classFilter) {
        const classes = [...new Set(appState.receipts.map(r => r.class))];
        classFilter.innerHTML = '<option value="">All Classes</option>' +
            classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
    }
}

function updateDashboard() {
    const totalReceipts = appState.receipts.length;
    const totalStudents = appState.students.length;
    const totalAmount = appState.receipts.reduce((sum, receipt) => sum + (receipt.total || receipt.amount), 0);
    
    // Today's receipts
    const today = new Date().toISOString().split('T')[0];
    const todayReceipts = appState.receipts.filter(receipt => receipt.date === today).length;

    // Update stats
    const totalReceiptsEl = document.getElementById('totalReceipts');
    const totalStudentsEl = document.getElementById('totalStudents');
    const totalAmountEl = document.getElementById('totalAmount');
    const todayReceiptsEl = document.getElementById('todayReceipts');
    
    if (totalReceiptsEl) totalReceiptsEl.textContent = totalReceipts;
    if (totalStudentsEl) totalStudentsEl.textContent = totalStudents;
    if (totalAmountEl) totalAmountEl.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
    if (todayReceiptsEl) todayReceiptsEl.textContent = todayReceipts;

    // Update recent receipts
    const recentReceipts = appState.receipts.slice(-5).reverse();
    const recentReceiptsList = document.getElementById('recentReceiptsList');
    
    if (recentReceiptsList) {
        recentReceiptsList.innerHTML = recentReceipts.map(receipt => `
            <div class="receipt-item">
                <div class="receipt-info">
                    <h4>${receipt.studentName}</h4>
                    <div class="receipt-meta">
                        ${receipt.id} • ${formatDate(receipt.date)} • ${receipt.paymentMethod}
                    </div>
                </div>
                <div class="receipt-amount">₹${(receipt.total || receipt.amount).toLocaleString('en-IN')}</div>
            </div>
        `).join('');
    }
}

function collectReceiptData() {
    const studentName = document.getElementById('studentName').value;
    const studentClass = document.getElementById('studentClass').value;
    const rollNumber = document.getElementById('rollNumber').value;

  
    if (!studentName || !studentClass || !rollNumber) {
        alert('Please fill in all required student information');
        return null;
    }
    
    const feeRows = document.querySelectorAll('#feeTableBody tr');
    const feeItems = [];
    let hasValidFees = false;
    
    feeRows.forEach(row => {
        const feeType = row.querySelector('.fee-type-select').value;
        const amount = parseFloat(row.querySelector('.fee-amount-input').value) || 0;
        
        if (feeType && amount > 0) {
            feeItems.push({type: feeType, amount: amount});
            hasValidFees = true;
        }
    });
    
    if (!hasValidFees) {
        alert('Please add at 6 least one fee item');
        return null;
    }
    
    const subtotal = feeItems.reduce((sum, item) => sum + item.amount, 0);
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const total = Math.max(0, subtotal - discount);
    
    return {
        id: document.getElementById('receiptNumber').value,
        studentName: studentName,
        class: studentClass,
        rollNo: rollNumber,
        fatherName: document.getElementById('fatherName').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('receiptDate').value,
        academicSession: document.getElementById('academicSession').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        feeItems: feeItems,
        subtotal: subtotal,
        discount: discount,
        total: total
    };
}

function generateReceiptHTML(data) {
    return `
        <div class="eurokids-header">
            <div class="school-logo">🐰</div>
            <div class="school-name">EuroKids Kreeri</div>
            <div class="school-tagline">Where Learning Meets Fun!</div>
            <div style="font-size: 11px;">${appState.schoolInfo.address}</div>
            <div style="font-size: 11px;">Phone: ${appState.schoolInfo.phone} | Email: ${appState.schoolInfo.email}</div>
            <div style="font-size: 10px;">EuroKids International</div>
        </div>
        
        <div class="receipt-title">FEE RECEIPT</div>
        
        <div class="receipt-info">
            <div><strong>Receipt No:</strong> ${data.id}</div>
            <div><strong>Date:</strong> ${formatDate(data.date)}</div>
        </div>
        
        <div class="student-info">
            <div><strong>Student Name:</strong> ${data.studentName}</div>
            <div><strong>Class:</strong> ${data.class} | <strong>Roll No:</strong> ${data.rollNo}</div>
            ${data.fatherName ? `<div><strong>Father's Name:</strong> ${data.fatherName}</div>` : ''}
            ${data.phone ? `<div><strong>Contact:</strong> ${data.phone}</div>` : ''}
            <div><strong>Academic Session:</strong> ${data.academicSession}</div>
            <div><strong>Payment Method:</strong> ${data.paymentMethod}</div>
        </div>
        
        <div class="fee-details">
            <table class="fee-table">
                <thead>
                    <tr>
                        <th>Fee Particulars</th>
                        <th style="text-align: right;">Amount (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.feeItems.map(item => `
                        <tr>
                            <td>${item.type}</td>
                            <td style="text-align: right;">${item.amount.toLocaleString('en-IN')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="total-section">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${data.subtotal.toLocaleString('en-IN')}</span>
            </div>
            ${data.discount > 0 ? `
                <div class="total-row">
                    <span>Discount:</span>
                    <span>-₹${data.discount.toLocaleString('en-IN')}</span>
                </div>
            ` : ''}
            <div class="total-row" style="font-size: 14px; border-top: 2px solid #1E40AF; padding-top: 6px; background: #FCD34D; color: #1E40AF; padding: 8px; border-radius: 4px;">
                <span>Total Amount:</span>
                <span>₹${data.total.toLocaleString('en-IN')}</span>
            </div>
        </div>
        
        <div class="signature-section">
            <div>
                <div>Parent Signature</div>
                <div style="margin-top: 20px;">_________________</div>
            </div>
            <div>
                <div>Authorized Signature</div>
                <div style="margin-top: 20px;">_________________</div>
            </div>
        </div>
        
        <div class="footer">
            <div>Thank you for choosing EuroKids!</div>
            <div>For queries: eurokidskreeri@gmail.com | +91-9797813480</div>
        </div>
    `;
}



let submitting = false;


async function handleReceiptSubmission(e) {
  e.preventDefault();                                     // stop native submit [web:433]
  if (submitting) return;
  submitting = true;
  setLoading(true);

  try {
    // A) Validate immediately
    const receiptData = collectReceiptData();             // requires name, class, roll [web:406]
    if (!receiptData) return;                             // collectReceiptData already alerts

    // B) Sync to Google Sheets (non‑blocking on failure; optional strict check)
    let syncOk = false;
    try {
      const resp = await syncReceiptToSheets(receiptData);
      syncOk = !!(resp && resp.ok === true);
      if (!syncOk) console.warn('Sheets sync not ok:', resp);
    } catch (err) {
      console.warn('Sheets sync error:', err);
    }

    // C) Save locally and refresh UI
    appState.receipts.push(receiptData);
    appState.currentReceiptNumber++;
    saveData();
    updateDashboard();
    populateReceiptsHistory();

    // D) Success UI
    alert(syncOk ? 'Receipt generated and synced! 🎉' : 'Receipt generated locally! Sync pending.'); 

   
    addFeeRow();
    generateReceiptNumber();
    const today = new Date().toISOString().split('T')[0];
    const dateEl = document.getElementById('receiptDate');
    if (dateEl) dateEl.value = today;

    // F) Create PDF after a valid submission
    generatePDF();
  } finally {
    setLoading(false);
    submitting = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('receiptForm');
  if (form) {
    // Clear any accidental duplicate listeners by cloning
    const clone = form.cloneNode(true);
    form.replaceWith(clone);
    clone.addEventListener('submit', handleReceiptSubmission, { once: false });
  }
});
function handleAddStudent(e) {
    e.preventDefault();
    
    const form = e.target;
    const editingId = form.dataset.editingId;
    
    const studentData = {
        name: document.getElementById('newStudentName').value,
        class: document.getElementById('newStudentClass').value,
        rollNo: document.getElementById('newStudentRoll').value,
        fatherName: document.getElementById('newFatherName').value,
        phone: document.getElementById('newStudentPhone').value
    };
    
    if (editingId) {
        // Update existing student
        const studentIndex = appState.students.findIndex(s => s.id == editingId);
        if (studentIndex !== -1) {
            appState.students[studentIndex] = { ...appState.students[studentIndex], ...studentData };
        }
        alert('Student updated successfully! 👍');
    } else {
        // Add new student
        const newStudent = {
            id: Date.now(),
            ...studentData
        };
        appState.students.push(newStudent);
        alert('Student added successfully! 🎉');
    }
    
    saveData();
    populateStudentDropdown();
    populateStudentsList();
    updateDashboard();
    hideAddStudentModal();
}

function filterReceipts() {
    const searchTerm = document.getElementById('searchFilter').value.toLowerCase();
    const classFilter = document.getElementById('classFilter').value;
    const paymentMethodFilter = document.getElementById('paymentMethodFilter').value;
    
    let filteredReceipts = appState.receipts.filter(receipt => {
        const matchesSearch = !searchTerm || 
            receipt.studentName.toLowerCase().includes(searchTerm) ||
            receipt.id.toLowerCase().includes(searchTerm);
        
        const matchesClass = !classFilter || receipt.class === classFilter;
        const matchesPayment = !paymentMethodFilter || receipt.paymentMethod === paymentMethodFilter;
        
        return matchesSearch && matchesClass && matchesPayment;
    });
    
    const receiptsGrid = document.getElementById('receiptsGrid');
    if (receiptsGrid) {
        receiptsGrid.innerHTML = filteredReceipts.slice().reverse().map(receipt => `
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
                    <button class="btn btn--sm btn--primary" onclick="regenerateReceipt('${receipt.id}')">
                        📄 PDF
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function initializeCharts() {
    if (!window.Chart) {
        console.warn('Chart.js not loaded');
        return;
    }
    
    initializeMonthlyChart();
    initializeClassChart();
    initializePaymentMethodChart();
}

function initializeMonthlyChart() {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx || !window.Chart) return;
    
    // Get monthly data
    const monthlyData = {};
    appState.receipts.forEach(receipt => {
        const date = new Date(receipt.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (receipt.total || receipt.amount);
    });
    
    const labels = Object.keys(monthlyData).sort().slice(-6);
    const data = labels.map(label => monthlyData[label] || 0);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(label => {
                const [year, month] = label.split('-');
                return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            }),
            datasets: [{
                label: 'Monthly Collection (₹)',
                data: data,
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                borderColor: '#1E40AF',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#FCD34D',
                pointBorderColor: '#1E40AF',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });
}

function initializeClassChart() {
    const ctx = document.getElementById('classChart');
    if (!ctx || !window.Chart) return;
    
    const classData = {};
    appState.receipts.forEach(receipt => {
        classData[receipt.class] = (classData[receipt.class] || 0) + (receipt.total || receipt.amount);
    });
    
    const labels = Object.keys(classData);
    const data = Object.values(classData);
    const colors = ['#1E40AF', '#FCD34D', '#10B981', '#F59E0B'];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function initializePaymentMethodChart() {
    const ctx = document.getElementById('paymentMethodChart');
    if (!ctx || !window.Chart) return;
    
    const paymentMethodData = {};
    appState.receipts.forEach(receipt => {
        paymentMethodData[receipt.paymentMethod] = (paymentMethodData[receipt.paymentMethod] || 0) + 1;
    });
    
    const labels = Object.keys(paymentMethodData);
    const data = Object.values(paymentMethodData);
    const colors = ['#1E40AF', '#FCD34D', '#10B981', '#F59E0B', '#EF4444'];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Transactions',
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function handleSchoolSettings(e) {
    e.preventDefault();
    
    appState.schoolInfo = {
        name: document.getElementById('schoolName').value,
        address: document.getElementById('schoolAddress').value,
        phone: document.getElementById('schoolPhone').value,
        email: document.getElementById('schoolEmail').value,
        principalName: document.getElementById('principalName').value,
        website: appState.schoolInfo.website,
        affiliation: appState.schoolInfo.affiliation,
        regNumber: appState.schoolInfo.regNumber
    };
    
    saveData();
    alert('Settings saved successfully! ✅');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function initializeApp() {
    // Set current date
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('receiptDate');
    if (dateInput) {
        dateInput.value = today;
    }

    // Generate receipt number
    generateReceiptNumber();
    
    // Populate student dropdown
    populateStudentDropdown();
    
    // Populate students list
    populateStudentsList();
    
    // Populate receipts history
    populateReceiptsHistory();
    
    // Initialize first fee row
    addFeeRow();
    
    // Show PWA install banner if available
    setTimeout(checkPWAInstall, 2000);
}

function checkPWAInstall() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install banner
        const banner = document.createElement('div');
        banner.className = 'install-banner show';
        banner.innerHTML = `
            <div class="install-text">📱 Install EuroKids Receipt App for easy offline access!</div>
            <button class="btn btn--sm btn--secondary" onclick="installPWA()" style="margin-right: 10px;">Install</button>
            <button class="install-close" onclick="this.parentElement.style.display='none'">×</button>
        `;
        document.body.appendChild(banner);
        
        window.installPWA = () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                deferredPrompt = null;
                banner.style.display = 'none';
            });
        };
    });
}

function setupEventListeners() {
    // Receipt form submission
    const receiptForm = document.getElementById('receiptForm');
    if (receiptForm) {
        receiptForm.addEventListener('submit', handleReceiptSubmission);
    }

    // Add student form submission
    const addStudentForm = document.getElementById('addStudentForm');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', handleAddStudent);
    }

    // School settings form submission
    const schoolSettingsForm = document.getElementById('schoolSettingsForm');
    if (schoolSettingsForm) {
        schoolSettingsForm.addEventListener('submit', handleSchoolSettings);
    }

    // Search and filter functionality
    const searchFilter = document.getElementById('searchFilter');
    if (searchFilter) {
        searchFilter.addEventListener('input', filterReceipts);
    }

    const classFilter = document.getElementById('classFilter');
    if (classFilter) {
        classFilter.addEventListener('change', filterReceipts);
    }

    const paymentMethodFilter = document.getElementById('paymentMethodFilter');
    if (paymentMethodFilter) {
        paymentMethodFilter.addEventListener('change', filterReceipts);
    }

    // Discount input
    const discountInput = document.getElementById('discount');
    if (discountInput) {
        discountInput.addEventListener('input', calculateTotal);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('EuroKids Fee Receipt App - Initializing...');
    loadData();
    initializeApp();
    updateDashboard();
    setupEventListeners();
    console.log('EuroKids Fee Receipt App - Ready! 🎉');
    
    // Make all functions globally accessible
    window.showSection = showSection;
    window.fillStudentDetails = fillStudentDetails;
    window.addFeeRow = addFeeRow;
    window.removeFeeRow = removeFeeRow;
    window.updateFeeAmount = updateFeeAmount;
    window.calculateTotal = calculateTotal;
    window.previewReceipt = previewReceipt;
    window.hidePreviewModal = hidePreviewModal;
    window.showAddStudentModal = showAddStudentModal;
    window.hideAddStudentModal = hideAddStudentModal;
    window.generateReceiptForStudent = generateReceiptForStudent;
    window.editStudent = editStudent;
    window.regenerateReceipt = regenerateReceipt;
    window.generatePDF = generatePDF;
    window.exportToCSV = exportToCSV;
    window.exportToGoogleSheets = exportToGoogleSheets;
    window.connectGoogleSheets = connectGoogleSheets;
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swContent = `
            const CACHE_NAME = 'eurokids-v1';
            const urlsToCache = ['/'];
            
            self.addEventListener('install', (event) => {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.addAll(urlsToCache))
                );
            });
            
            self.addEventListener('fetch', (event) => {
                event.respondWith(
                    caches.match(event.request)
                        .then((response) => {
                            return response || fetch(event.request);
                        })
                );
            });
        `;
        
        const blob = new Blob([swContent], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);
        
        navigator.serviceWorker.register(swUrl)
            .then((registration) => {
                console.log('ServiceWorker registration successful');
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed');
            });
    });
}
