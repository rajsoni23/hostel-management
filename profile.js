// =========================================
// PROFILE MANAGEMENT SYSTEM
// Hostel Management System
// =========================================

import { auth, db } from './firebase-config.js';

import {
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================================
// DOM ELEMENTS
// =========================================

const profileForm = document.getElementById('profileForm');
const passwordForm = document.getElementById('passwordForm');

const profileName = document.getElementById('profileName');
const profileRole = document.getElementById('profileRole');

const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const roleInput = document.getElementById('role');

// =========================================
// LOAD USER PROFILE
// =========================================

async function loadUserProfile() {

    try {

        const user = auth.currentUser;

        if (!user) {
            console.log('No User Logged In');
            return;
        }

        // Fetch User Data
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const userData = userSnap.data();

            // Display Profile Info
            profileName.innerText = userData.fullName || 'User';
            profileRole.innerText = userData.role || 'Student';

            // Fill Form Fields
            fullNameInput.value = userData.fullName || '';
            emailInput.value = userData.email || '';
            phoneInput.value = userData.phone || '';
            roleInput.value = userData.role || '';

            // Save to Local Storage
            localStorage.setItem('userName', userData.fullName);

            console.log('Profile Loaded Successfully');

        }

    } catch (error) {

        console.error('Error Loading Profile:', error);

    }

}

// =========================================
// UPDATE PROFILE
// =========================================

if (profileForm) {

    profileForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        try {

            const user = auth.currentUser;

            if (!user) {
                alert('User not logged in!');
                return;
            }

            // Get Updated Values
            const updatedName = fullNameInput.value.trim();
            const updatedPhone = phoneInput.value.trim();

            // Update Firestore
            await updateDoc(doc(db, 'users', user.uid), {
                fullName: updatedName,
                phone: updatedPhone
            });

            // Update Local Storage
            localStorage.setItem('userName', updatedName);

            showNotification('Profile Updated Successfully!', '#16a34a');

            loadUserProfile();

        } catch (error) {

            console.error('Error Updating Profile:', error);
            alert(error.message);

        }

    });
}

// =========================================
// CHANGE PASSWORD
// =========================================

if (passwordForm) {

    passwordForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        try {

            const user = auth.currentUser;

            if (!user) {
                alert('User not logged in!');
                return;
            }

            // Get Password Values
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validation
            if (newPassword !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            if (newPassword.length < 6) {
                alert('Password must be at least 6 characters!');
                return;
            }

            // Re-authenticate User
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            await reauthenticateWithCredential(user, credential);

            // Update Password
            await updatePassword(user, newPassword);

            showNotification('Password Changed Successfully!', '#16a34a');

            // Reset Form
            passwordForm.reset();

        } catch (error) {

            console.error('Error Changing Password:', error);
            alert(error.message);

        }

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
// INITIALIZE PROFILE SYSTEM
// =========================================

window.addEventListener('load', () => {

    loadUserProfile();

});

// =========================================
// CONSOLE MESSAGE
// =========================================

console.log('Profile Management System Loaded Successfully');
