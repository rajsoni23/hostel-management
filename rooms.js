// =========================================
// ROOM MANAGEMENT SYSTEM
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

const roomForm = document.getElementById('roomForm');
const roomTableBody = document.getElementById('roomTableBody');
const searchRoom = document.getElementById('searchRoom');

const totalRoomsElement = document.getElementById('totalRooms');
const availableRoomsElement = document.getElementById('availableRooms');
const occupiedRoomsElement = document.getElementById('occupiedRooms');
const maintenanceRoomsElement = document.getElementById('maintenanceRooms');

// =========================================
// ADD ROOM
// =========================================

if (roomForm) {

    roomForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        // Get Values
        const roomNumber = document.getElementById('roomNumber').value.trim();
        const roomCapacity = document.getElementById('roomCapacity').value;
        const roomOccupancy = document.getElementById('roomOccupancy').value;
        const roomStatus = document.getElementById('roomStatus').value;

        try {

            // Add Room to Firestore
            await addDoc(collection(db, 'rooms'), {
                roomNumber,
                capacity: roomCapacity,
                occupancy: roomOccupancy,
                status: roomStatus,
                createdAt: new Date()
            });

            showNotification('Room Added Successfully!', '#16a34a');

            roomForm.reset();

            loadRooms();

        } catch (error) {

            console.error('Error Adding Room:', error);
            alert(error.message);

        }

    });
}

// =========================================
// LOAD ROOMS
// =========================================

async function loadRooms() {

    try {

        if (!roomTableBody) return;

        roomTableBody.innerHTML = '';

        // Room Counters
        let totalRooms = 0;
        let availableRooms = 0;
        let occupiedRooms = 0;
        let maintenanceRooms = 0;

        // Query Rooms
        const roomQuery = query(
            collection(db, 'rooms'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(roomQuery);

        querySnapshot.forEach((roomDoc) => {

            const room = roomDoc.data();
            const docId = roomDoc.id;

            totalRooms++;

            // Status Count
            if (room.status === 'Available') {
                availableRooms++;
            }

            if (room.status === 'Occupied') {
                occupiedRooms++;
            }

            if (room.status === 'Maintenance') {
                maintenanceRooms++;
            }

            // Create Row
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${room.roomNumber}</td>
                <td>${room.capacity}</td>
                <td>${room.occupancy}</td>
                <td>
                    <span class="status ${
                        room.status === 'Available'
                        ? 'active'
                        : room.status === 'Occupied'
                        ? 'inactive'
                        : 'active'
                    }">
                        ${room.status}
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

            roomTableBody.appendChild(row);

        });

        // Update Dashboard Stats
        totalRoomsElement.innerText = totalRooms;
        availableRoomsElement.innerText = availableRooms;
        occupiedRoomsElement.innerText = occupiedRooms;
        maintenanceRoomsElement.innerText = maintenanceRooms;

        attachDeleteEvents();
        attachEditEvents();

        console.log('Rooms Loaded Successfully');

    } catch (error) {

        console.error('Error Loading Rooms:', error);

    }

}

// =========================================
// DELETE ROOM
// =========================================

function attachDeleteEvents() {

    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {

        button.addEventListener('click', async () => {

            const docId = button.dataset.id;

            const confirmDelete = confirm('Are you sure you want to delete this room?');

            if (!confirmDelete) return;

            try {

                await deleteDoc(doc(db, 'rooms', docId));

                showNotification('Room Deleted Successfully!', '#dc2626');

                loadRooms();

            } catch (error) {

                console.error('Error Deleting Room:', error);
                alert(error.message);

            }

        });

    });

}

// =========================================
// EDIT ROOM
// =========================================

function attachEditEvents() {

    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {

        button.addEventListener('click', async () => {

            const docId = button.dataset.id;

            const newCapacity = prompt('Enter Updated Capacity');
            const newOccupancy = prompt('Enter Updated Occupancy');
            const newStatus = prompt('Enter Status (Available/Occupied/Maintenance)');

            if (!newCapacity || !newOccupancy || !newStatus) {
                alert('All fields are required!');
                return;
            }

            try {

                await updateDoc(doc(db, 'rooms', docId), {
                    capacity: newCapacity,
                    occupancy: newOccupancy,
                    status: newStatus
                });

                showNotification('Room Updated Successfully!', '#16a34a');

                loadRooms();

            } catch (error) {

                console.error('Error Updating Room:', error);
                alert(error.message);

            }

        });

    });

}

// =========================================
// SEARCH ROOM
// =========================================

if (searchRoom) {

    searchRoom.addEventListener('keyup', () => {

        const searchValue = searchRoom.value.toLowerCase();

        const rows = roomTableBody.querySelectorAll('tr');

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
// AUTO REFRESH ROOMS
// =========================================

setInterval(() => {

    loadRooms();

}, 30000);

// =========================================
// INITIALIZE ROOM SYSTEM
// =========================================

loadRooms();

// =========================================
// CONSOLE MESSAGE
// =========================================

console.log('Room Management System Loaded Successfully');
