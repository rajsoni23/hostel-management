// =========================================
// FEE MANAGEMENT SYSTEM
// Hostel Management System
// =========================================

import { db } from './firebase-config.js';

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================================
// DOM ELEMENTS
// =========================================

const feeForm = document.getElementById('feeForm');
const feeTableBody = document.getElementById('feeTableBody');
const searchFee = document.getElementById('searchFee');

const totalFeeRecordsElement = document.getElementById('totalFeeRecords');
const paidFeesElement = document.getElementById('paidFees');
const pendingFeesElement = document.getElementById('pendingFees');
const partialFeesElement = document.getElementById('partialFees');

// =========================================
// ADD FEE RECORD
// =========================================

if (feeForm) {

    feeForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        // Get Values
        const studentId = document.getElementById('studentId').value.trim();
        const studentName = document.getElementById('studentName').value.trim();
        const totalFee = document.getElementById('totalFee').value;
        const paidAmount = document.getElementById('paidAmount').value;
        const dueAmount = document.getElementById('dueAmount').value;
        const paymentStatus = document.getElementById('paymentStatus').value;

        try {

            // Save to Firestore
            await addDoc(collection(db, 'fees'), {
                studentId,
                studentName,
                totalFee,
                paidAmount,
                dueAmount,
                paymentStatus,
                createdAt: new Date()
            });

            showNotification('Fee Record Added Successfully!', '#16a34a');

            feeForm.reset();

            loadFees();

        } catch (error) {

            console.error('Error Adding Fee Record:', error);
            alert(error.message);

        }

    });
}

// =========================================
// LOAD FEES
// =========================================

async function loadFees() {

    try {

        if (!feeTableBody) return;

        feeTableBody.innerHTML = '';

        // Statistics Counters
        let totalRecords = 0;
        let paidCount = 0;
        let pendingCount = 0;
        let partialCount = 0;

        // Query Fees
        const feeQuery = query(
            collection(db, 'fees'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(feeQuery);

        querySnapshot.forEach((feeDoc) => {

            const fee = feeDoc.data();
            const docId = feeDoc.id;

            totalRecords++;

            // Status Counts
            if (fee.paymentStatus === 'Paid') {
                paidCount++;
            }

            if (fee.paymentStatus === 'Pending') {
                pendingCount++;
            }

            if (fee.paymentStatus === 'Partial') {
                partialCount++;
            }

            // Create Row
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${fee.studentId}</td>
                <td>${fee.studentName}</td>
                <td>₹${fee.totalFee}</td>
                <td>₹${fee.paidAmount}</td>
                <td>₹${fee.dueAmount}</td>
                <td>
                    <span class="status ${
                        fee.paymentStatus === 'Paid'
                        ? 'active'
                        : fee.paymentStatus === 'Pending'
                        ? 'inactive'
                        : 'active'
                    }">
                        ${fee.paymentStatus}
                    </span>
                </td>
                <td>
                    <button class="view-btn edit-btn" data-id="${docId}">
                        Edit
                    </button>

                    <button class="view-btn delete-btn" data-id="${docId}">
                        Delete
                    </button>
                </td>
            `;

            feeTableBody.appendChild(row);

        });

        // Update Stats
        totalFeeRecordsElement.innerText = totalRecords;
        paidFeesElement.innerText = paidCount;
        pendingFeesElement.innerText = pendingCount;
        partialFeesElement.innerText = partialCount;

        attachDeleteEvents();
        attachEditEvents();

        console.log('Fee Records Loaded Successfully');

    } catch (error) {

        console.error('Error Loading Fees:', error);

    }

}

// =========================================
// DELETE FEE RECORD
// =========================================

function attachDeleteEvents() {

    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {

        button.addEventListener('click', async () => {

            const docId = button.dataset.id;

            const confirmDelete = confirm('Are you sure you want to delete this fee record?');

            if (!confirmDelete) return;

            try {

                await deleteDoc(doc(db, 'fees', docId));

                showNotification('Fee Record Deleted Successfully!', '#dc2626');

                loadFees();

            } catch (error) {

                console.error('Error Deleting Fee Record:', error);
                alert(error.message);

            }

        });

    });

}

// =========================================
// EDIT FEE RECORD
// =========================================

function attachEditEvents() {

    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {

        button.addEventListener('click', async () => {

            const docId = button.dataset.id;

            const newPaid = prompt('Enter Updated Paid Amount');
            const newDue = prompt('Enter Updated Due Amount');
            const newStatus = prompt('Enter Status (Paid/Pending/Partial)');

            if (!newPaid || !newDue || !newStatus) {
                alert('All fields are required!');
                return;
            }

            try {

                await updateDoc(doc(db, 'fees', docId), {
                    paidAmount: newPaid,
                    dueAmount: newDue,
                    paymentStatus: newStatus
                });

                showNotification('Fee Record Updated Successfully!', '#16a34a');

                loadFees();

            } catch (error) {

                console.error('Error Updating Fee Record:', error);
                alert(error.message);

            }

        });

    });

}

// =========================================
// SEARCH FEES
// =========================================

if (searchFee) {

    searchFee.addEventListener('keyup', () => {

        const searchValue = searchFee.value.toLowerCase();

        const rows = feeTableBody.querySelectorAll('tr');

        rows.forEach(row => {

            const rowText = row.innerText.toLowerCase();

            if (rowText.includes(searchValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }

        });

    });
}

// =========================================
// SHOW NOTIFICATION
// =========================================

function showNotification(message, color = '#2563eb') {

    const notification = document.createElement('div');

    notification.innerText = message;

    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = color;
    notification.style.color = '#fff';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.style.fontWeight = '600';

    document.body.appendChild(notification);

    setTimeout(() => {

        notification.remove();

    }, 3000);

}

// =========================================
// AUTO REFRESH FEES
// =========================================

setInterval(() => {

    loadFees();

}, 30000);

// =========================================
// INITIALIZE FEES SYSTEM
// =========================================

loadFees();

// =========================================
// CONSOLE MESSAGE
// =========================================

console.log('Fee Management System Loaded Successfully');
