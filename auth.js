// =========================================
// AUTHENTICATION FILE
// Hostel Management System
// =========================================

import { auth, db } from './firebase-config.js';

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================================
// REGISTER USER
// =========================================

const registerForm = document.getElementById('registerForm');

if (registerForm) {

    registerForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        // Get Input Values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const role = document.getElementById('role').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            alert('Password should be at least 6 characters long!');
            return;
        }

        try {

            // Create User in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            // Save User Data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                fullName: fullName,
                email: email,
                phone: phone,
                role: role,
                createdAt: new Date()
            });

            alert('Registration Successful!');

            // Redirect to Dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {

            console.error(error);
            alert(error.message);

        }

    });
}

// =========================================
// LOGIN USER
// =========================================

const loginForm = document.getElementById('loginForm');

if (loginForm) {

    loginForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        // Get Input Values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {

            // Firebase Login
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            // Fetch User Data
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {

                const userData = userDoc.data();

                // Save User Info Locally
                localStorage.setItem('userRole', userData.role);
                localStorage.setItem('userName', userData.fullName);
                localStorage.setItem('userEmail', userData.email);

                alert('Login Successful!');

                // Redirect to Dashboard
                window.location.href = 'dashboard.html';

            } else {

                alert('User data not found!');

            }

        } catch (error) {

            console.error(error);
            alert(error.message);

        }

    });
}

// =========================================
// LOGOUT USER
// =========================================

const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {

    logoutBtn.addEventListener('click', async () => {

        try {

            await signOut(auth);

            // Clear Local Storage
            localStorage.clear();

            alert('Logged Out Successfully!');

            // Redirect to Login Page
            window.location.href = 'login.html';

        } catch (error) {

            console.error(error);
            alert(error.message);

        }

    });
}

// =========================================
// CHECK AUTH STATE
// =========================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log('User Logged In:', user.email);

    } else {

        console.log('No User Logged In');

    }

});

// =========================================
// PROTECT DASHBOARD PAGE
// =========================================

const currentPage = window.location.pathname;

if (currentPage.includes('dashboard.html')) {

    onAuthStateChanged(auth, (user) => {

        if (!user) {

            alert('Please login first!');
            window.location.href = 'login.html';

        }

    });
}

// =========================================
// DISPLAY USER INFO
// =========================================

const userNameDisplay = document.getElementById('userNameDisplay');

if (userNameDisplay) {

    const savedName = localStorage.getItem('userName');

    if (savedName) {
        userNameDisplay.innerText = savedName;
    }
}

// =========================================
// CONSOLE MESSAGE
// =========================================

console.log('Authentication System Loaded Successfully');
