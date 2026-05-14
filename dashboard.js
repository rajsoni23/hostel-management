// =========================================
// DASHBOARD JAVASCRIPT FILE
// Hostel Management System
// =========================================

import { db } from './firebase-config.js';

import {
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================================
// DOM ELEMENTS
// =========================================

const totalStudentsElement = document.getElementById('totalStudents');
const totalRoomsElement = document.getElementById('totalRooms');
const pendingComplaintsElement = document.getElementById('pendingComplaints');
const pendingFeesElement = document.getElementById('pendingFees');

const userNameDisplay = document.getElementById('userNameDisplay');

// =========================================
// DISPLAY USER NAME
// =========================================

const storedUserName = localStorage.getItem('userName');

if (storedUserName && userNameDisplay) {
    userNameDisplay.innerText = storedUserName;
}

// =========================================
// LOAD DASHBOARD STATISTICS
// =========================================

async function loadDashboardStats() {

    try {

        // =========================================
        // TOTAL STUDENTS
        // =========================================

        const studentsSnapshot = await getDocs(collection(db, 'students'));
        const totalStudents = studentsSnapshot.size;

        if (totalStudentsElement) {
            totalStudentsElement.innerText = totalStudents;
        }

        // =========================================
        // TOTAL ROOMS
        // =========================================

        const roomsSnapshot = await getDocs(collection(db, 'rooms'));
        const totalRooms = roomsSnapshot.size;

        if (totalRoomsElement) {
            totalRoomsElement.innerText = totalRooms;
        }

        // =========================================
        // COMPLAINTS COUNT
        // =========================================

        const complaintsSnapshot = await getDocs(collection(db, 'complaints'));
        const totalComplaints = complaintsSnapshot.size;

        if (pendingComplaintsElement) {
            pendingComplaintsElement.innerText = totalComplaints;
        }

        // =========================================
        // FEES COUNT
        // =========================================

        const feesSnapshot = await getDocs(collection(db, 'fees'));
        const totalFees = feesSnapshot.size;

        if (pendingFeesElement) {
            pendingFeesElement.innerText = totalFees;
        }

        console.log('Dashboard Statistics Loaded Successfully');

    } catch (error) {

        console.error('Error Loading Dashboard Stats:', error);

    }

}

// =========================================
// LOAD RECENT STUDENTS
// =========================================

async function loadRecentStudents() {

    try {

        const studentTableBody = document.querySelector('tbody');

        if (!studentTableBody) return;

        // Clear Existing Rows
        studentTableBody.innerHTML = '';

        // Query Students
        const studentQuery = query(
            collection(db, 'students'),
            orderBy('createdAt', 'desc'),
            limit(5)
        );

        const querySnapshot = await getDocs(studentQuery);

        querySnapshot.forEach((doc) => {

            const student = doc.data();

            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${student.studentId || 'N/A'}</td>
                <td>${student.fullName || 'Unknown'}</td>
                <td>${student.roomNumber || 'Not Assigned'}</td>
                <td>
                    <span class="status active">
                        ${student.status || 'Active'}
                    </span>
                </td>
                <td>
                    <button class="view-btn">View</button>
                </td>
            `;

            studentTableBody.appendChild(row);

        });

        console.log('Recent Students Loaded');

    } catch (error) {

        console.error('Error Loading Students:', error);

    }

}

// =========================================
// LOAD RECENT COMPLAINTS
// =========================================

async function loadRecentComplaints() {

    try {

        const complaintSection = document.querySelector('.complaint-section');

        if (!complaintSection) return;

        // Remove Existing Dynamic Complaints
        const existingBoxes = complaintSection.querySelectorAll('.dynamic-complaint');

        existingBoxes.forEach(box => box.remove());

        // Query Complaints
        const complaintQuery = query(
            collection(db, 'complaints'),
            orderBy('createdAt', 'desc'),
            limit(3)
        );

        const querySnapshot = await getDocs(complaintQuery);

        querySnapshot.forEach((doc) => {

            const complaint = doc.data();

            const complaintBox = document.createElement('div');

            complaintBox.classList.add('complaint-box', 'dynamic-complaint');

            complaintBox.innerHTML = `
                <h4>${complaint.title || 'Complaint'}</h4>
                <p>${complaint.description || 'No Description'}</p>
                <span>${complaint.status || 'Pending'}</span>
            `;

            complaintSection.appendChild(complaintBox);

        });

        console.log('Complaints Loaded Successfully');

    } catch (error) {

        console.error('Error Loading Complaints:', error);

    }

}

// =========================================
// CARD ANIMATION EFFECT
// =========================================

const dashboardCards = document.querySelectorAll('.card');

if (dashboardCards.length > 0) {

    dashboardCards.forEach(card => {

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0px) scale(1)';
        });

    });
}

// =========================================
// SIMPLE LOADING EFFECT
// =========================================

window.addEventListener('load', () => {

    document.body.style.opacity = '1';

    console.log('Dashboard Loaded Successfully');

});

// =========================================
// AUTO REFRESH DASHBOARD
// =========================================

setInterval(() => {

    loadDashboardStats();
    loadRecentStudents();
    loadRecentComplaints();

}, 30000);

// =========================================
// INITIALIZE DASHBOARD
// =========================================

loadDashboardStats();
loadRecentStudents();
loadRecentComplaints();

// =========================================
// SEARCH FUNCTIONALITY (FUTURE USE)
// =========================================

function searchStudents(keyword) {

    console.log('Searching for:', keyword);

    // Future Search Logic Here

}

// =========================================
// NOTIFICATION FUNCTION
// =========================================

function showNotification(message) {

    const notification = document.createElement('div');

    notification.innerText = message;

    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = '#2563eb';
    notification.style.color = '#fff';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';

    document.body.appendChild(notification);

    setTimeout(() => {

        notification.remove();

    }, 3000);

}

// =========================================
// CONSOLE MESSAGE
// =========================================

console.log('Dashboard System Initialized');
