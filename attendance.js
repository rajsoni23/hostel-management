// =========================================
// ATTENDANCE MANAGEMENT SYSTEM
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

const attendanceForm = document.getElementById('attendanceForm');
const attendanceTableBody = document.getElementById('attendanceTableBody');
const searchAttendance = document.getElementById('searchAttendance');

const totalAttendanceElement = document.getElementById('totalAttendance');
const presentCountElement = document.getElementById('presentCount');
const absentCountElement = document.getElementById('absentCount');
const leaveCountElement = document.getElementById('leaveCount');

// =========================================
// ADD ATTENDANCE
// =========================================

if (attendanceForm) {

    attendanceForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        // Get Values
        const studentId = document.getElementById('studentId').value.trim();
        const studentName = document.getElementById('studentName').value.trim();
        const attendanceDate = document.getElementById('attendanceDate').value;
        const attendanceStatus = document.getElementById('attendanceStatus').value;

        try {

            // Save Attendance
            await addDoc(collection(db, 'attendance'), {
                studentId,
                studentName,
                attendanceDate,
                attendanceStatus,
                createdAt: new Date()
            });

            showNotification('Attendance Saved Successfully!', '#16a34a');

            attendanceForm.reset();

            loadAttendance();

        } catch (error) {

            console.error('Error Saving Attendance:', error);
            alert(error.message);

        }

    });
}

// =========================================
// LOAD ATTENDANCE RECORDS
// =========================================

async function loadAttendance() {

    try {

        if (!attendanceTableBody) return;

        attendanceTableBody.innerHTML = '';

        // Statistics Counters
        let totalAttendance = 0;
        let presentCount = 0;
        let absentCount = 0;
        let leaveCount = 0;

        // Query Attendance
        const attendanceQuery = query(
            collection(db, 'attendance'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(attendanceQuery);

        querySnapshot.forEach((attendanceDoc) => {

            const attendance = attendanceDoc.data();
            const docId = attendanceDoc.id;

            totalAttendance++;

            // Status Count
            if (attendance.attendanceStatus === 'Present') {
                presentCount++;
            }

            if (attendance.attendanceStatus === 'Absent') {
                absentCount++;
            }

            if (attendance.attendanceStatus === 'Leave') {
                leaveCount++;
            }

            // Create Table Row
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${attendance.studentId}</td>
                <td>${attendance.studentName}</td>
                <td>${attendance.attendanceDate}</td>
                <td>
                    <span class="status ${
                        attendance.attendanceStatus === 'Present'
                        ? 'active'
                        : attendance.attendanceStatus === 'Absent'
                        ? 'inactive'
                        : 'active'
                    }">
                        ${attendance.attendanceStatus}
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

            attendanceTableBody.appendChild(row);

        });

        // Update Statistics
        totalAttendanceElement.innerText = totalAttendance;
        presentCountElement.innerText = presentCount;
        absentCountElement.innerText = absentCount;
        leaveCountElement.innerText = leaveCount;

        attachDeleteEvents();
        attachEditEvents();

        console.log('Attendance Records Loaded Successfully');

    } catch (error) {

        console.error('Error Loading Attendance:', error);

    }

}

// =========================================
// DELETE ATTENDANCE RECORD
// =========================================

function attachDeleteEvents() {

    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {

        button.addEventListener('click', async () => {

            const docId = button.dataset.id;

            const confirmDelete = confirm('Are you sure you want to delete this attendance record?');

            if (!confirmDelete) return;

            try {

                await deleteDoc(doc(db, 'attendance', docId));

                showNotification('Attendance Deleted Successfully!', '#dc2626');

                loadAttendance();

            } catch (error) {

                console.error('Error Deleting Attendance:', error);
                alert(error.message);

            }

        });

    });

}

// =========================================
// EDIT ATTENDANCE RECORD
// =========================================

function attachEditEvents() {

    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {

        button.addEventListener('click', async () => {

            const docId = button.dataset.id;

            const newStatus = prompt('Enter New Status (Present/Absent/Leave)');

            if (!newStatus) {
                alert('Status is required!');
                return;
            }

            try {

                await updateDoc(doc(db, 'attendance', docId), {
                    attendanceStatus: newStatus
                });

                showNotification('Attendance Updated Successfully!', '#16a34a');

                loadAttendance();

            } catch (error) {

                console.error('Error Updating Attendance:', error);
                alert(error.message);

            }

        });

    });

}

// =========================================
// SEARCH ATTENDANCE
// =========================================

if (searchAttendance) {

    searchAttendance.addEventListener('keyup', () => {

        const searchValue = searchAttendance.value.toLowerCase();

        const rows = attendanceTableBody.querySelectorAll('tr');

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
// AUTO REFRESH ATTENDANCE
// =========================================

setInterval(() => {

    loadAttendance();

}, 30000);

// =========================================
// INITIALIZE ATTENDANCE SYSTEM
// =========================================

loadAttendance();

// =========================================
// CONSOLE MESSAGE
// =========================================

console.log('Attendance Management System Loaded Successfully');
