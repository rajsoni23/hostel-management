// =========================================
// HOSTEL MANAGEMENT SYSTEM - MAIN APP JS
// =========================================

console.log("Hostel Management System Loaded Successfully");

// =========================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// =========================================

const navLinks = document.querySelectorAll('.navbar a');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {

        const targetId = this.getAttribute('href');

        if (targetId.startsWith('#')) {
            e.preventDefault();

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// =========================================
// HEADER SHADOW ON SCROLL
// =========================================

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {

    if (window.scrollY > 50) {
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
    }

});

// =========================================
// CONTACT FORM SUBMISSION
// =========================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {

    contactForm.addEventListener('submit', function (e) {

        e.preventDefault();

        const inputs = contactForm.querySelectorAll('input, textarea');

        let isEmpty = false;

        inputs.forEach(input => {

            if (input.value.trim() === '') {
                isEmpty = true;
                input.style.border = '1px solid red';
            } else {
                input.style.border = '1px solid #cbd5e1';
            }

        });

        if (isEmpty) {
            alert('Please fill all required fields!');
            return;
        }

        alert('Message Sent Successfully!');

        contactForm.reset();

    });
}

// =========================================
// FEATURE CARD HOVER EFFECT
// =========================================

const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {

    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-12px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0px) scale(1)';
    });

});

// =========================================
// SCROLL REVEAL ANIMATION
// =========================================

const revealElements = document.querySelectorAll(
    '.feature-card, .hero-content, .hero-image, .about-content, .contact-form'
);

function revealOnScroll() {

    const windowHeight = window.innerHeight;

    revealElements.forEach(element => {

        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0px)';
            element.style.transition = 'all 0.8s ease';
        }

    });
}

// Initial Hidden State
revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(40px)';
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// =========================================
// BACK TO TOP BUTTON
// =========================================

const backToTop = document.createElement('button');
backToTop.innerHTML = '↑';
backToTop.classList.add('back-to-top');

document.body.appendChild(backToTop);

backToTop.style.position = 'fixed';
backToTop.style.bottom = '30px';
backToTop.style.right = '30px';
backToTop.style.width = '50px';
backToTop.style.height = '50px';
backToTop.style.border = 'none';
backToTop.style.borderRadius = '50%';
backToTop.style.background = '#2563eb';
backToTop.style.color = '#fff';
backToTop.style.fontSize = '22px';
backToTop.style.cursor = 'pointer';
backToTop.style.display = 'none';
backToTop.style.zIndex = '1000';
backToTop.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';

window.addEventListener('scroll', () => {

    if (window.scrollY > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }

});

backToTop.addEventListener('click', () => {

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

});

// =========================================
// LOADING ANIMATION
// =========================================

window.addEventListener('load', () => {

    document.body.style.opacity = '1';

});

// =========================================
// CURRENT YEAR IN FOOTER
// =========================================

const footer = document.querySelector('.footer p');

if (footer) {

    const currentYear = new Date().getFullYear();

    footer.innerHTML = `© ${currentYear} Hostel Management System | Developed by Raj Soni`;
}

// =========================================
// SIMPLE MOBILE NAVIGATION EFFECT
// =========================================

const navbar = document.querySelector('.navbar');

window.addEventListener('resize', () => {

    if (window.innerWidth < 768) {
        navbar.style.justifyContent = 'center';
    } else {
        navbar.style.justifyContent = 'flex-end';
    }

});

// =========================================
// CONSOLE WELCOME MESSAGE
// =========================================

console.log(
    '%cWelcome to Hostel Management System',
    'color: white; background: #2563eb; padding: 10px; font-size: 16px; border-radius: 5px;'
);
