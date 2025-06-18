// Helper to convert hex to RGB for box-shadow with opacity
function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length == 4) { // #RGB
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length == 7) { // #RRGGBB
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return { r, g, b };
}

document.addEventListener('DOMContentLoaded', () => {
    const primaryColorHex = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary').trim();
    const primaryRgb = hexToRgb(primaryColorHex);
    document.documentElement.style.setProperty('--md-sys-color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    console.log('DOM Content Loaded. Script is running.');
});


document.getElementById('currentYear').textContent = new Date().getFullYear();

function triggerHapticFeedback(pattern = [30]) {
    if (navigator.vibrate) {
        try { navigator.vibrate(pattern); } catch (e) { /* ignore */ }
    }
}

const ctaButton = document.querySelector('.cta-button');
if (ctaButton) ctaButton.addEventListener('click', () => triggerHapticFeedback([40]));

const navLinks = document.querySelectorAll('.nav-links a');
const mobileNavMenu = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');

navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        triggerHapticFeedback([20]);
        navLinks.forEach(link => link.classList.remove('active-link', 'aria-current'));
        this.classList.add('active-link');
        this.setAttribute('aria-current', 'page');

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (mobileNavMenu.classList.contains('active')) {
            mobileNavMenu.classList.remove('active');
            menuToggle.querySelector('.material-icons-round').textContent = 'menu';
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let currentSectionId = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 2.5)) { // Adjusted threshold
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href').substring(1) === currentSectionId) {
            link.classList.add('active-link');
            link.setAttribute('aria-current', 'page');
        }
    });
    if (pageYOffset < window.innerHeight / 2 && !currentSectionId) {
        const heroLink = document.querySelector('.nav-links a[href="#hero"]');
        if (heroLink) {
            navLinks.forEach(l => { l.classList.remove('active-link'); l.removeAttribute('aria-current'); });
            heroLink.classList.add('active-link');
            heroLink.setAttribute('aria-current', 'page');
        }
    }

    // Back to top button visibility
    const backToTopButton = document.getElementById('backToTopBtn');
    if (backToTopButton) {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            backToTopButton.style.display = 'flex'; // Use flex for icon centering
            backToTopButton.style.opacity = '1';
            backToTopButton.style.transform = 'scale(1)';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.transform = 'scale(0.8)';
            // Use setTimeout to hide after transition
            setTimeout(() => {
                if (!(document.body.scrollTop > 200 || document.documentElement.scrollTop > 200)) {
                    backToTopButton.style.display = 'none';
                }
            }, 300); // Match transition duration
        }
    }
});

const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(27, 32, 37, 0.85)';
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
    } else {
        nav.style.background = 'rgba(15, 20, 25, 0.8)';
        nav.style.boxShadow = 'none';
    }
});

menuToggle.addEventListener('click', () => {
    triggerHapticFeedback();
    const isOpened = mobileNavMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpened);
    menuToggle.querySelector('.material-icons-round').textContent = isOpened ? 'close' : 'menu';
});

function showProjects(type, event) {
    const activeTabButton = document.querySelector('.tab-button.active');
    const clickedTabButton = event.currentTarget;
    if (activeTabButton) activeTabButton.classList.remove('active');
    if (clickedTabButton) clickedTabButton.classList.add('active');
    document.getElementById('active-projects').style.display = (type === 'active') ? 'grid' : 'none';
    document.getElementById('inactive-projects').style.display = (type === 'inactive') ? 'grid' : 'none';
}
if (document.querySelector('.tab-button')) {
    document.querySelector('.tab-button[onclick*="\'active\'"]').classList.add('active');
}

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('skill-card') || entry.target.classList.contains('project-card') || entry.target.classList.contains('social-link')) {
                entry.target.style.animationDelay = `${index * 0.075}s`;
            }
            entry.target.classList.add('animate-in');
            // obs.unobserve(entry.target); 
        }
    });
}, observerOptions);
document.querySelectorAll('.skill-card, .project-card, .social-link, .about-text > p, .photo-container, .contact-text, .section-title').forEach(el => {
    el.style.opacity = '0'; observer.observe(el);
});

// Enhanced interactive floating shapes (JS logic remains largely the same, CSS handles initial shape)
// Enhanced interactive floating shapes (JS logic remains largely the same, CSS handles initial shape)
const floatingShapes = Array.from(document.querySelectorAll('.floating-shape')).map((el, index) => {
    const baseDelays = [0, 2000, 4000, 1000, 3000, 5000, 1500, 3500]; // Varied delays for more randomness
    const animationPeriod = 15000 + Math.random() * 10000; // 15-25s for varied cycle times
    const scrollSpeedsY = [0.2, 0.3, 0.4, 0.25, 0.35, 0.45, 0.15, 0.5]; // More subtle parallax
    const scrollSpeedRotate = 0.02 + Math.random() * 0.03;

    return {
        element: el,
        floatAmplitudeY: 20 + Math.random() * 20, // 20-40px
        floatSpeedY: (2 * Math.PI) / (animationPeriod * (0.9 + Math.random() * 0.2)),
        floatAmplitudeRotate: 45 + Math.random() * 90, // 45-135 degrees
        floatSpeedRotate: (2 * Math.PI) / (animationPeriod * (0.8 + Math.random() * 0.4)),
        phaseOffset: (baseDelays[index % baseDelays.length] / animationPeriod) * 2 * Math.PI,
        scrollFactorY: scrollSpeedsY[index % scrollSpeedsY.length] * (Math.random() > 0.5 ? 1 : -0.5), // some move up on scroll
        scrollFactorRotate: scrollSpeedRotate * (index * 0.3 + 1) * (Math.random() > 0.5 ? 1 : -1),
        mouseInfluence: 10 + Math.random() * 15,
        lerpFactor: 0.03 + Math.random() * 0.04,
        targetMouseOffsetX: 0,
        targetMouseOffsetY: 0,
        currentMouseOffsetX: 0,
        currentMouseOffsetY: 0,
        initialTop: parseFloat(getComputedStyle(el).top) || 0,
        initialLeft: parseFloat(getComputedStyle(el).left) || 0,
        initialRight: parseFloat(getComputedStyle(el).right) || 0,
        initialBottom: parseFloat(getComputedStyle(el).bottom) || 0,
    };
});

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, { passive: true });

function animateFloatingShapes() {
    const currentTime = performance.now();
    const currentScrollY = window.pageYOffset;

    floatingShapes.forEach(shapeObj => {
        const el = shapeObj.element;
        const rect = el.getBoundingClientRect();
        const shapeCenterX = rect.left + rect.width / 2;
        const shapeCenterY = rect.top + rect.height / 2;

        const floatY = -shapeObj.floatAmplitudeY * (0.5 - 0.5 * Math.cos(currentTime * shapeObj.floatSpeedY + shapeObj.phaseOffset));
        const floatRotate = shapeObj.floatAmplitudeRotate * Math.sin(currentTime * shapeObj.floatSpeedRotate + shapeObj.phaseOffset);

        const scrollTranslateY = currentScrollY * shapeObj.scrollFactorY;
        const scrollRotate = currentScrollY * shapeObj.scrollFactorRotate;

        const dx = shapeCenterX - mouseX;
        const dy = shapeCenterY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxInfluenceDistance = Math.min(window.innerWidth, window.innerHeight) / 2.5;

        if (distance < maxInfluenceDistance && distance > 1) {
            const repelFactor = (1 - distance / maxInfluenceDistance) * shapeObj.mouseInfluence;
            shapeObj.targetMouseOffsetX = (dx / distance) * repelFactor;
            shapeObj.targetMouseOffsetY = (dy / distance) * repelFactor;
        } else {
            shapeObj.targetMouseOffsetX = 0;
            shapeObj.targetMouseOffsetY = 0;
        }
        shapeObj.currentMouseOffsetX += (shapeObj.targetMouseOffsetX - shapeObj.currentMouseOffsetX) * shapeObj.lerpFactor;
        shapeObj.currentMouseOffsetY += (shapeObj.targetMouseOffsetY - shapeObj.currentMouseOffsetY) * shapeObj.lerpFactor;

        const totalTranslateX = shapeObj.currentMouseOffsetX;
        // Add scrollTranslateY to floatY for vertical movement
        const totalTranslateY = floatY + scrollTranslateY + shapeObj.currentMouseOffsetY;
        const totalRotate = floatRotate + scrollRotate;

        el.style.transform = `translate(${totalTranslateX}px, ${totalTranslateY}px) rotate(${totalRotate}deg)`;
    });

    requestAnimationFrame(animateFloatingShapes);
}
requestAnimationFrame(animateFloatingShapes);



function updateGreetingIcon() {
    const hour = new Date().getHours();
    const iconEl = document.querySelector('.cta-greeting-icon');
    if (!iconEl) return;
    if (hour >= 5 && hour < 12) iconEl.textContent = 'wb_sunny';
    else if (hour >= 12 && hour < 17) iconEl.textContent = 'light_mode';
    else if (hour >= 17 && hour < 20) iconEl.textContent = 'brightness_4';
    else iconEl.textContent = 'nightlight_round';
}
updateGreetingIcon(); setInterval(updateGreetingIcon, 60000 * 5);

document.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    createParticle(e.clientX, e.clientY);
});
function createParticle(x, y) {
    const p = document.createElement('div');
    p.style.cssText = `position:fixed; left:${x}px; top:${y}px; width:${Math.random() * 6 + 4}px; height:${p.style.width}; background:${Math.random() > 0.5 ? getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary').trim() : getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-secondary').trim()}; border-radius:50%; pointer-events:none; z-index:9999; opacity:0.9; animation:particle-burst 0.7s cubic-bezier(0.175,0.885,0.320,1.275) forwards;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
}

let konamiCode = []; const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code); konamiCode = konamiCode.slice(-konamiSequence.length);
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        triggerHapticFeedback([100, 50, 100, 50, 100]); document.body.style.animation = 'rainbow 2s infinite linear';
        const msg = document.createElement('div');
        msg.textContent = '🎉 Cihuy! Nemu Easter Egg Cuy 🏛️';
        msg.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); padding:20px 40px; background:var(--md-sys-color-surface-container-highest); color:var(--md-sys-color-primary); border-radius:var(--m3-shape-corner-medium); box-shadow:0 10px 30px rgba(0,0,0,0.3); font-size:1.5rem; z-index:10000; text-align:center;';
        document.body.appendChild(msg);
        setTimeout(() => { document.body.style.animation = ''; if (msg.parentNode) msg.remove(); }, 3500);
        konamiCode = [];
    }
});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        preloader.addEventListener('transitionend', () => { if (preloader.parentNode) preloader.remove(); });
    }
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.8s var(--m3-easing-standard) 0.3s';
        document.body.style.opacity = '1';
    });
});

// Back to Top functionality
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Language Dropdown functionality
function toggleLanguageDropdown() {
    const languageDropdown = document.querySelector('.language-dropdown');
    const dropdownToggle = languageDropdown.querySelector('.dropdown-toggle');
    const dropdownMenu = languageDropdown.querySelector('.dropdown-menu');

    const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
    dropdownToggle.setAttribute('aria-expanded', !isExpanded);
    dropdownMenu.classList.toggle('show', !isExpanded);
    console.log('toggleLanguageDropdown called. isExpanded:', isExpanded, 'dropdownMenu has show class:', dropdownMenu.classList.contains('show'));
}

document.addEventListener('DOMContentLoaded', () => {
    const primaryColorHex = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary').trim();
    const primaryRgb = hexToRgb(primaryColorHex);
    document.documentElement.style.setProperty('--md-sys-color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    console.log('DOM Content Loaded. Script is running.');

    const languageDropdown = document.querySelector('.language-dropdown');
    console.log('languageDropdown:', languageDropdown);
    const dropdownToggle = languageDropdown ? languageDropdown.querySelector('.dropdown-toggle') : null;
    console.log('dropdownToggle:', dropdownToggle);
    const dropdownMenu = languageDropdown ? languageDropdown.querySelector('.dropdown-menu') : null;
    console.log('dropdownMenu:', dropdownMenu);

    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', () => {
            toggleLanguageDropdown();
            triggerHapticFeedback();
        });
    } else {
        console.error('Dropdown toggle button not found!');
    }

    // Close dropdown if clicked outside
    document.addEventListener('click', (event) => {
        if (!languageDropdown.contains(event.target) && dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
            dropdownToggle.setAttribute('aria-expanded', 'false');
        }
    });
});
