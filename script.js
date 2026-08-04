// ==========================================================================
// Smooth anchor scrolling
// ==========================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ==========================================================================
// Navbar scroll state
// ==========================================================================
const navbar = document.querySelector('.navbar');

const updateNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ==========================================================================
// Scroll progress bar
// ==========================================================================
const scrollProgress = document.querySelector('.scroll-progress');

const updateScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// ==========================================================================
// Mobile menu
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!menuToggle || !navLinks) return;

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    };

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') &&
            !menuToggle.contains(e.target) &&
            !navLinks.contains(e.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
});

// ==========================================================================
// Preloader curtain + hero text reveal on load
// ==========================================================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        requestAnimationFrame(() => heroTitle.classList.add('play'));
    }

    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('is-done');
            setTimeout(() => preloader.remove(), 1000);
        }, 500);
    }
});

// ==========================================================================
// Scroll reveal (IntersectionObserver)
// ==========================================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 0.06}s`;
    revealObserver.observe(el);
});

// ==========================================================================
// Custom cursor
// ==========================================================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const hasFineCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (hasFineCursor && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    const animateRing = () => {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, .work-row, .chip').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
}

// ==========================================================================
// Hero cursor spotlight
// ==========================================================================
const heroEl = document.getElementById('top');
const heroSpotlight = document.getElementById('heroSpotlight');

if (hasFineCursor && heroEl && heroSpotlight) {
    heroEl.addEventListener('mousemove', (e) => {
        const rect = heroEl.getBoundingClientRect();
        heroEl.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        heroEl.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
}

// ==========================================================================
// Hero visual parallax on scroll
// ==========================================================================
const heroVisual = document.getElementById('heroVisual');

if (heroVisual) {
    window.addEventListener('scroll', () => {
        const offset = Math.min(window.scrollY * 0.15, 60);
        heroVisual.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
}

// ==========================================================================
// Animated stat counters
// ==========================================================================
const statNumbers = document.querySelectorAll('.stat-number');

if (statNumbers.length) {
    const countUp = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const duration = 1200;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statNumbers.forEach(el => statObserver.observe(el));
}

// ==========================================================================
// 3D tilt on work rows
// ==========================================================================
if (hasFineCursor) {
    document.querySelectorAll('.work-row').forEach(row => {
        row.addEventListener('mousemove', (e) => {
            const rect = row.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            row.style.transform = `perspective(800px) rotateX(${py * -2}deg) rotateY(${px * 2}deg)`;
        });
        row.addEventListener('mouseleave', () => {
            row.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

// ==========================================================================
// Magnetic buttons
// ==========================================================================
if (hasFineCursor) {
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

// ==========================================================================
// Work filters
// ==========================================================================
const filterButtons = document.querySelectorAll('.filter-btn');
const workRows = document.querySelectorAll('.work-row');

function applyWorkFilter(filterValue) {
    workRows.forEach(row => {
        const matches = filterValue === 'all' || row.dataset.filter === filterValue;
        row.classList.toggle('is-hidden', !matches);
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        applyWorkFilter(button.getAttribute('data-filter'));
    });
});

const defaultFilterButton = document.querySelector('.filter-btn.active');
if (defaultFilterButton) {
    applyWorkFilter(defaultFilterButton.getAttribute('data-filter'));
}

// ==========================================================================
// EmailJS contact form
// ==========================================================================
(function () {
    if (window.emailjs) {
        emailjs.init('B2GoeB6Vd2wHCHrA9');
    }
})();

function sendEmail(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const submitBtn = document.querySelector('.submit-btn span');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';

    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_name: 'Vanshika',
    };

    emailjs.send('service_gabi5g9', 'template_ylbd0ui', templateParams)
        .then(() => {
            submitBtn.textContent = 'Message sent';
            document.getElementById('contactForm').reset();
            showNotification('Message sent successfully!', 'success');
            setTimeout(() => { submitBtn.textContent = originalText; }, 3000);
        }, (error) => {
            submitBtn.textContent = originalText;
            showNotification('Failed to send message. Please try again.', 'error');
            console.error('EmailJS error:', error);
        });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        color: '#faf8f3',
        fontWeight: '500',
        fontFamily: "'Inter', sans-serif",
        zIndex: '2000',
        animation: 'slideIn 0.3s ease-out',
        background: type === 'success' ? '#15140f' : '#c9491f'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(120%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyle);
