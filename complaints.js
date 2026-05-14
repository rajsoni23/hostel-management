// =========================================
// COMPLAINT MANAGEMENT SYSTEM
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

const complaintForm = document.getElementById('complaintForm');
const complaintTableBody = document.getElementById('complaintTableBody');
const searchComplaint = document.getElementById('searchComplaint');

const totalComplaintsElement = document.getElementById('totalComplaints');
const pendingComplaintsElement = document.getElementById('pendingComplaints');
const resolvedComplaintsElement = document.getElementById('resolvedComplaints');
const progressComplaintsElement = document.getElementById('progressComplaints');

// =========================================
// ADD COMPLAINT
// =========================================

if (complaintForm) {

    complaintForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        // Get Values
        const studentId = document.getElementById('studentId').value.trim();
        const studentName = document.getElementById('studentName').value.trim();
        const complaintTitle = document.getElementById('complaintTitle').value.trim();
        const complaintStatus = document.getElementById('complaintStatus').value;
        const complaintDescription = document.getElementById('complaintDescription').value.trim();

        try {

            // Save Complaint
            await addDoc(collection(db, 'complaints'), {
                studentId,
                studentName,
                title: complaintTitle,
                status: complaintStatus,
                description: complaintDescription,
                createdAt: new Date()
            });

            showNotification('Complaint Submitted Successfully!', '#16a34a');

            complaintForm.reset();

            loadComplaints();

        } catch (error) {

            console.error('Error Submitting Complaint:', error);
            alert(error.message);

        }

    });
}

// =========================================
// LOAD COMPLAINTS
// =========================================

async function loadComplaints() {

    try {

        if (!complaintTableBody) return;

        complaintTableBody.innerHTML = '';

        // Statistics Counters
        let totalComplaints = 0;
        let pendingCount = 0;
        let resolvedCount = 0;
        let progressCount = 0;

        // Query Complaints
        const complaintQuery = query(
            collection(db, 'complaints'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(complaintQuery);

        querySnapshot.forEach((complaintDoc) => {

            const complaint = complaintDoc.data();
            const docId = complaintDoc.id;

            totalComplaints++;

            // Status Count
            if (complaint.status === 'Pending') {
                pendingCount++;
            }

            if (complaint.status === 'Resolved') {
                resolvedCount++;
            }

            if (complaint.status === 'In Progress') {
                progressCount++;
            }

            // Create Row
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${complaint.studentId}</td>
                <td>${complaint.studentName}</td>
                <td>${complaint.title}</td>
                <td>
                    <span class="status ${
                        complaint.status === 'Resolved'
                        ? 'active'
                        : complaint.status === 'Pending'
                        ? 'inactive'
                        : 'active'
                    }">
                        ${complaint.status}
                    </span>
                </td>
                <td>${complaint.description}</td>
                <td>
                    <button class="view-btn edit-btn" data-id="${docId}">
                        Edit
                    </button>

                    <button class="view-btn delete-btn" data-id="${docId}">
                        Delete
                    </button>
                </td>
            `;

            complaintTableBody.appendChild(row);

        });

        // Update Statistics
        totalComplaintsElement.innerText = totalComplaints;
        pendingComplaintsElement.innerText = pendingCount;
        resolvedComplaintsElement.innerText = resolvedCount;
        progressComplaintsElement.innerText = progressCount;

        attachDeleteEvents();
        attachEditEvents();

        console.log('Complaints Loaded Successfully');

    } catch (error) {

        console.error('Error Loading Complaints:', error);

    }

}

// =========================================
// DELETE COMPLAINT
// =========================================

function attachDeleteEvents() {

    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {

        button.addEventListener('click', async () => {

            const docId = button.dataset.id;

            const confirmDelete = confirm('Are you sure you want to delete this complaint?');

            if (!confirmDelete) return;

            try {

                await deleteDoc(doc(db, 'complaints', docId));

                showNotification('Complaint Deleted Successfully!', '#dc2626');

                loadComplaints();

            } catch (error) {

                console.error('Error Deleting Complaint:', error);
                alert(error.message);

            }

        });

    });

}

// =========================================
// EDIT COMPLAINT
// =========================================

function attachEditEvents() {

    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {

        button.addEventListener('click', async () => {

            const docId = button.dataset.id;

            const newStatus = prompt('Enter New Status (Pending/Resolved/In Progress)');

            if (!newStatus) {
                alert('Status is required!');
                return;
            }

            try {

                await updateDoc(doc(db, 'complaints', docId), {
                    status: newStatus
                });

                showNotification('Complaint Updated Successfully!', '#16a34a');

                loadComplaints();

            } catch (error) {

                console.error('Error Updating Complaint:', error);
                alert(error.message);

            }

        });

    });

}

// =========================================
// SEARCH COMPLAINTS
// =========================================

if (searchComplaint) {

    searchComplaint.addEventListener('keyup', () => {

        const searchValue = searchComplaint.value.toLowerCase();

        const rows = complaintTableBody.querySelectorAll('tr');

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
// AUTO REFRESH COMPLAINTS
// =========================================

setInterval(() => {

    loadComplaints();

}, 30000);

// =========================================
// INITIALIZE COMPLAINT SYSTEM
// =========================================

loadComplaints();

// =========================================
// CONSOLE MESSAGE
// =========================================

console.log('Complaint Management System Loaded Successfully');
