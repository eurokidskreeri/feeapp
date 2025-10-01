// EuroKids Application State
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
    {id: 1, name: "Aarav Sharma", class: "Nursery", rollNo: "EK001", fatherName: "Rajesh Sharma", phone: "9419123456"},
    {id: 2, name: "Zara Khan", class: "Play Group", rollNo: "EK002", fatherName: "Mohammad Khan", phone: "9469234567"},
    {id: 3, name: "Arjun Singh", class: "Nursery", rollNo: "EK003", fatherName: "Vikram Singh", phone: "9796345678"},
    {id: 4, name: "Aisha Begum", class: "Play Group", rollNo: "EK004", fatherName: "Abdul Rashid", phone: "9622456789"},
    {id: 5, name: "Ishaan Gupta", class: "LKG", rollNo: "EK005", fatherName: "Sunil Gupta", phone: "9419567890"},
    {id: 6, name: "Fatima Sheikh", class: "UKG", rollNo: "EK006", fatherName: "Ahmed Sheikh", phone: "9796678901"}
];

const sampleReceipts = [
    {
        id: "EK-KRI-2025-001", 
        studentName: "Aarav Sharma", 
        class: "Nursery", 
        rollNo: "EK001",
        fatherName: "Rajesh Sharma",
        amount: 2700, 
        date: "2025-01-10", 
        paymentMethod: "UPI", 
        academicSession: "2025-26",
        feeItems: [
            {type: "Monthly Fee - Nursery", amount: 1900}, 
            {type: "Transport Fee", amount: 800}
        ],
        discount: 0,
        total: 2700
    },
    {
        id: "EK-KRI-2025-002", 
        studentName: "Zara Khan", 
        class: "Play Group", 
        rollNo: "EK002",
        fatherName: "Mohammad Khan",
        amount: 2200, 
        date: "2025-01-08", 
        paymentMethod: "Cash", 
        academicSession: "2025-26",
        feeItems: [
            {type: "Monthly Fee - Play Group", amount: 1600}, 
            {type: "Books & Stationery", amount: 600}
        ],
        discount: 0,
        total: 2200
    },
    {
        id: "EK-KRI-2025-003", 
        studentName: "Arjun Singh", 
        class: "Nursery", 
        rollNo: "EK003",
        fatherName: "Vikram Singh",
        amount: 2200, 
        date: "2025-01-05", 
        paymentMethod: "Net Banking", 
        academicSession: "2025-26",
        feeItems: [
            {type: "Monthly Fee - Nursery", amount: 1900}, 
            {type: "Activities Fee", amount: 300}
        ],
        discount: 0,
        total: 2200
    }
];

// Google Sheets Web App endpoint (Apps Script /exec URL)
const EXEC_URL =  "https://script.google.com/macros/s/AKfycby97CCgR1mwcS8lanLsC2TN4DFi8duLqQWuSiQrsdWYHVDtGXavNwltjx6GtmOVifI/exec";


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
    
    if (!window.jspdf) {
        alert('PDF generation library not loaded. Please try again.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // Header with EuroKids branding
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
    doc.text('Thank you for choosing EuroKids!', 105, yPos, { align: 'center' });
    doc.text('This is a computer generated receipt. For queries: eurokidskreeri@gmail.com', 105, yPos + 4, { align: 'center' });
    
    // Save PDF
    doc.save(`EuroKids_Receipt_${receiptData.id}_${receiptData.studentName.replace(/\s+/g, '_')}.pdf`);
    
    hidePreviewModal();
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
        alert('Please add at least one fee item');
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




function handleReceiptSubmission(e) {
    e.preventDefault();

    const receiptData = collectReceiptData();
    if (!receiptData) return;

    // Save receipt locally
    appState.receipts.push(receiptData);
    appState.currentReceiptNumber++;
    saveData();

    // Update UI
    updateDashboard();
    populateReceiptsHistory();

    // Fire-and-forget sync to Google Sheets
    // (does not block the UI; check console for "Sheets sync ok")
    syncReceiptToSheets(receiptData).catch(err => console.warn("Sync error:", err));

    // User feedback and reset form
    alert('Receipt generated successfully! 🎉');
    document.getElementById('receiptForm').reset();
    document.getElementById('feeTableBody').innerHTML = '';
    addFeeRow();
    generateReceiptNumber();

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('receiptDate').value = today;

    // Auto-generate PDF
    generatePDF();
}

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