// =========================================
// STUDENT MANAGEMENT SYSTEM
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

const studentForm = document.getElementById('studentForm');
const studentTableBody = document.getElementById('studentTableBody');
const searchInput = document.getElementById('searchStudent');

// =========================================
// ADD STUDENT
// =========================================

if (studentForm) {

    studentForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        // Get Form Values
        const studentId = document.getElementById('studentId').value.trim();
        const studentName = document.getElementById('studentName').value.trim();
        const studentEmail = document.getElementById('studentEmail').value.trim();
        const studentPhone = document.getElementById('studentPhone').value.trim();
        const roomNumber = document.getElementById('roomNumber').value.trim();
        const studentStatus = document.getElementById('studentStatus').value;

        try {

            // Add Student to Firestore
            await addDoc(collection(db, 'students'), {
                studentId,
                fullName: studentName,
                email: studentEmail,
                phone: studentPhone,
                roomNumber,
                status: studentStatus,
                createdAt: new Date()
            });

            alert('Student Added Successfully!');

            // Reset Form
            studentForm.reset();

            // Reload Students
            loadStudents();

        } catch (error) {

            console.error('Error Adding Student:', error);
            alert(error.message);

        }

    });
}

// =========================================
// LOAD STUDENTS
// =========================================

async function loadStudents() {

    try {

        if (!studentTableBody) return;

        // Clear Table
        studentTableBody.innerHTML = '';

        // Query Students
        const studentQuery = query(
            collection(db, 'students'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(studentQuery);

        querySnapshot.forEach((studentDoc) => {

            const student = studentDoc.data();
            const docId = studentDoc.id;

            // Create Row
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${student.studentId}</td>
                <td>${student.fullName}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.roomNumber}</td>
                <td>
                    <span class="status ${student.status === 'Active' ? 'active' : 'inactive'}">
                        ${student.status}
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

            studentTableBody.appendChild(row);

        });

        attachDeleteEvents();
        attachEditEvents();

        console.log('Students Loaded Successfully');

    } catch (error) {

        console.error('Error Loading Students:', error);

    }

}

// =========================================
// DELETE STUDENT
// =========================================

function attachDeleteEvents() {

    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {

        button.addEventListener('click', async () => {

            const docId = button.dataset.id;

            const confirmDelete = confirm('Are you sure you want to delete this student?');

            if (!confirmDelete) return;

            try {

                await deleteDoc(doc(db, 'students', docId));

                alert('Student Deleted Successfully!');

                loadStudents();

            } catch (error) {

                console.error('Error Deleting Student:', error);
                alert(error.message);

            }

        });

    });

}

// =========================================
// EDIT STUDENT
// =========================================

function attachEditEvents() {

    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {

        button.addEventListener('click', async () => {

            const docId = button.dataset.id;

            // Prompt New Values
            const newName = prompt('Enter Updated Student Name');
            const newRoom = prompt('Enter Updated Room Number');
            const newStatus = prompt('Enter Status (Active/Inactive)');

            if (!newName || !newRoom || !newStatus) {
                alert('All fields are required!');
                return;
            }

            try {

                await updateDoc(doc(db, 'students', docId), {
                    fullName: newName,
                    roomNumber: newRoom,
                    status: newStatus
                });

                alert('Student Updated Successfully!');

                loadStudents();

            } catch (error) {

                console.error('Error Updating Student:', error);
                alert(error.message);

            }

        });

    });

}

// =========================================
// SEARCH STUDENTS data
// =========================================

if (searchInput) {

    searchInput.addEventListener('keyup', () => {

        const searchValue = searchInput.value.toLowerCase();

        const rows = studentTableBody.querySelectorAll('tr');

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
// AUTO REFRESH STUDENTS
// =========================================

setInterval(() => {

    loadStudents();

}, 30000);

// =========================================
// INITIALIZE
// =========================================

loadStudents();

// =========================================
// CONSOLE MESSAGE
// =========================================

console.log('Student Management System Loaded Successfully');
