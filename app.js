const payrollForm = document.getElementById('payrollForm');
const payrollTbody = document.getElementById('payrollTbody');
const msgDiv = document.getElementById('msg');

const sumEmployees = document.getElementById('sumEmployees');
const sumGross = document.getElementById('sumGross');
const sumDed = document.getElementById('sumDed');
const sumNet = document.getElementById('sumNet');

const empNameInput = document.getElementById('empName');
const hoursInput = document.getElementById('hours');
const rateInput = document.getElementById('rate');
const taxInput = document.getElementById('tax');
const otherDedInput = document.getElementById('otherDed');

const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

let payrollData = [];
let editId = null; 


function updateSummary() {
    const totalEmployees = payrollData.length;
    const totalGross = payrollData.reduce((sum, item) => sum + item.gross, 0);
    const totalDed = payrollData.reduce((sum, item) => sum + (item.taxAmount + item.otherDed), 0);
    const totalNet = payrollData.reduce((sum, item) => sum + item.net, 0);

    sumEmployees.innerText = totalEmployees;
    sumGross.innerText = `₱${totalGross.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    sumDed.innerText = `₱${totalDed.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    sumNet.innerText = `₱${totalNet.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

function renderTable() {
    payrollTbody.innerHTML = '';
    
    payrollData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.hours}</td>
            <td>${item.rate}</td>
            <td>₱${item.gross.toFixed(2)}</td>
            <td>₱${item.taxAmount.toFixed(2)}</td>
            <td>₱${item.otherDed.toFixed(2)}</td>
            <td style="color: var(--ok); font-weight: bold;">₱${item.net.toFixed(2)}</td>
            <td>
                <button onclick="editRow(${item.id})" style="padding: 4px 8px; font-size: 0.8rem; margin-right: 5px;">Edit</button>
                <button onclick="deleteRow(${item.id})" class="secondary" style="padding: 4px 8px; font-size: 0.8rem; color: var(--danger);">Del</button>
            </td>
        `;
        payrollTbody.appendChild(row);
    });
    updateSummary();
}

payrollForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = empNameInput.value;
    const hours = parseFloat(hoursInput.value);
    const rate = parseFloat(rateInput.value);
    const taxPercent = parseFloat(taxInput.value);
    const otherDed = parseFloat(otherDedInput.value);

    const gross = hours * rate;
    const taxAmount = gross * (taxPercent / 100);
    const net = gross - taxAmount - otherDed;

    if (editId !== null) {
        const index = payrollData.findIndex(item => item.id === editId);
        payrollData[index] = { id: editId, name, hours, rate, gross, taxAmount, otherDed, net };
        msgDiv.innerText = "Record updated successfully!";
        submitBtn.innerText = "Add Payroll";
        editId = null;
    } else {
        const newRecord = {
            id: Date.now(),
            name, hours, rate, gross, taxAmount, otherDed, net
        };
        payrollData.push(newRecord);
        msgDiv.innerText = "Record added!";
    }

    payrollForm.reset();
    renderTable();
    setTimeout(() => msgDiv.innerText = "", 3000);
});

window.deleteRow = (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
        payrollData = payrollData.filter(item => item.id !== id);
        renderTable();
        msgDiv.innerText = "Record deleted.";
    }
};

window.editRow = (id) => {
    const record = payrollData.find(item => item.id === id);
    if (record) {
        empNameInput.value = record.name;
        hoursInput.value = record.hours;
        rateInput.value = record.rate;
        otherDedInput.value = record.otherDed;
        
        editId = id;
        submitBtn.innerText = "Save Changes";
        empNameInput.focus();
        msgDiv.innerText = "Editing record...";
    }
};

clearAllBtn.addEventListener('click', () => {
    if (confirm("Clear all payroll data?")) {
        payrollData = [];
        renderTable();
        msgDiv.innerText = "All records cleared.";
    }
});

resetBtn.addEventListener('click', () => {
    editId = null;
    submitBtn.innerText = "Add Payroll";
    msgDiv.innerText = "";

});
