document.addEventListener('DOMContentLoaded', () => {

    const DOM = {
        header: document.querySelector('.header'),
        navLinks: document.querySelectorAll('.nav-links a'),
        mobileNavMenu: document.querySelector('.nav-links'),
        menuToggle: document.querySelector('.menu-toggle'),
        sections: document.querySelectorAll('section[id]'),
        ctaButton: document.querySelector('.cta-button'),
        greetingIcon: document.querySelector('.cta-greeting-icon'),
        backToTopButton: document.getElementById('backToTopBtn'),
        currentYear: document.getElementById('currentYear'),
        preloader: document.getElementById('preloader'),
        projectTabs: document.querySelectorAll('.tab-button'),
        activeProjectsGrid: document.getElementById('active-projects'),
        inactiveProjectsGrid: document.getElementById('inactive-projects'),
        languageDropdown: document.querySelector('.language-dropdown'),
        languageToggle: document.querySelector('.language-dropdown .dropdown-toggle'),
        languageMenu: document.querySelector('.language-dropdown .dropdown-menu'),
        animatedElements: document.querySelectorAll('.skill-card, .project-card, .social-link, .about-text > p, .photo-container, .contact-text, .section-title'),
        floatingShapes: Array.from(document.querySelectorAll('.floating-shape'))
    };

    const state = {
        konamiCode: [],
        konamiSequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
        mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        isMobileNavOpen: false
    };

    const triggerHapticFeedback = (pattern = [30]) => {
        if (navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) { /* ignore */ }
        }
    };

    const hexToRgb = (hex) => {
        let r = 0, g = 0, b = 0;
        hex = hex.trim();
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return { r, g, b };
    };

    const init = () => {
        setupEventListeners();
        setupIntersectionObserver();
        setupFloatingShapes();
        updateGreetingIcon();
        setInterval(updateGreetingIcon, 60000 * 5);
        setPrimaryColorRGB();
        if (DOM.currentYear) DOM.currentYear.textContent = new Date().getFullYear();
        handlePageLoad();
    };

    const setPrimaryColorRGB = () => {
        const primaryColorHex = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary');
        if (primaryColorHex) {
            const primaryRgb = hexToRgb(primaryColorHex);
            document.documentElement.style.setProperty('--md-sys-color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
        }
    };

    const setupEventListeners = () => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        DOM.navLinks.forEach(anchor => anchor.addEventListener('click', handleNavLinkClick));
        if (DOM.menuToggle) DOM.menuToggle.addEventListener('click', toggleMobileNav);

        if (DOM.languageToggle) {
            DOM.languageToggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent document click listener from closing it immediately
                toggleLanguageDropdown();
            });
        }
        document.addEventListener('click', closeLanguageDropdownOnClickOutside);

        DOM.projectTabs.forEach(tab => tab.addEventListener('click', handleProjectTabClick));
        document.addEventListener('keydown', handleKonamiCode);
        document.addEventListener('click', createParticleOnClick);

        if (DOM.backToTopButton) {
            DOM.backToTopButton.addEventListener('click', () => {
                triggerHapticFeedback();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        if (DOM.ctaButton) DOM.ctaButton.addEventListener('click', () => triggerHapticFeedback([40]));

        window.addEventListener('mousemove', (e) => {
            state.mouse.x = e.clientX;
            state.mouse.y = e.clientY;
        }, { passive: true });
    };

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Header background effect
        DOM.header.classList.toggle('scrolled', scrollY > 50);

        // Back to top button visibility
        if (DOM.backToTopButton) {
            const isVisible = scrollY > 200;
            DOM.backToTopButton.style.display = isVisible ? 'flex' : 'none';
            DOM.backToTopButton.style.opacity = isVisible ? '1' : '0';
            DOM.backToTopButton.style.transform = isVisible ? 'scale(1)' : 'scale(0.8)';
        }

        // Active navigation link highlighting
        let currentSectionId = '';
        DOM.sections.forEach(section => {
            if (scrollY >= section.offsetTop - 80) { // Adjust for header height
                currentSectionId = section.getAttribute('id');
            }
        });

        DOM.navLinks.forEach(link => {
            link.classList.remove('active-link');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === currentSectionId) {
                link.classList.add('active-link');
            }
        });
    };

    const handleNavLinkClick = (e) => {
        e.preventDefault();
        triggerHapticFeedback([20]);
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (state.isMobileNavOpen) toggleMobileNav();
    };

    const toggleMobileNav = () => {
        triggerHapticFeedback();
        state.isMobileNavOpen = !state.isMobileNavOpen;
        DOM.mobileNavMenu.classList.toggle('active', state.isMobileNavOpen);
        DOM.menuToggle.setAttribute('aria-expanded', state.isMobileNavOpen);
        DOM.menuToggle.querySelector('.material-symbols-rounded').textContent = state.isMobileNavOpen ? 'close' : 'menu';
    };

    const toggleLanguageDropdown = () => {
        triggerHapticFeedback();
        const isExpanded = DOM.languageToggle.getAttribute('aria-expanded') === 'true';
        DOM.languageToggle.setAttribute('aria-expanded', !isExpanded);
        DOM.languageMenu.classList.toggle('show', !isExpanded);
    };

    const closeLanguageDropdownOnClickOutside = (event) => {
        if (DOM.languageMenu.classList.contains('show') && !DOM.languageDropdown.contains(event.target)) {
            toggleLanguageDropdown();
        }
    };

    const handleProjectTabClick = (event) => {
        triggerHapticFeedback();
        const clickedTab = event.currentTarget;
        const type = clickedTab.getAttribute('data-localize') === 'active-projects-tab' ? 'active' : 'inactive';

        DOM.projectTabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');

        DOM.activeProjectsGrid.style.display = (type === 'active') ? 'grid' : 'none';
        DOM.inactiveProjectsGrid.style.display = (type === 'inactive') ? 'grid' : 'none';
    };

    const handleKonamiCode = (e) => {
        state.konamiCode.push(e.key.toLowerCase());
        state.konamiCode = state.konamiCode.slice(-state.konamiSequence.length);

        if (JSON.stringify(state.konamiCode) === JSON.stringify(state.konamiSequence)) {
            triggerHapticFeedback([100, 50, 100, 50, 100]);
            document.body.style.animation = 'rainbow 2s infinite linear';
            const msg = document.createElement('div');
            msg.textContent = '🎉 Cihuy! Nemu Easter Egg Cuy 🏛️';
            msg.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); padding:20px 40px; background:var(--md-sys-color-surface-container-highest); color:var(--md-sys-color-primary); border-radius:var(--m3-shape-corner-medium); box-shadow:0 10px 30px rgba(0,0,0,0.3); font-size:1.5rem; z-index:10000; text-align:center;';
            document.body.appendChild(msg);
            setTimeout(() => {
                document.body.style.animation = '';
                msg.remove();
            }, 3500);
            state.konamiCode = [];
        }
    };

    const setupIntersectionObserver = () => {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        DOM.animatedElements.forEach(el => observer.observe(el));
    };

    const setupFloatingShapes = () => {
        const shapes = DOM.floatingShapes.map((el, index) => {
            const baseDelays = [0, 2000, 4000, 1000, 3000, 5000, 1500, 3500];
            const animationPeriod = 15000 + Math.random() * 10000;
            return {
                element: el,
                floatAmplitudeY: 20 + Math.random() * 20,
                floatSpeedY: (2 * Math.PI) / (animationPeriod * (0.9 + Math.random() * 0.2)),
                floatAmplitudeRotate: 45 + Math.random() * 90,
                floatSpeedRotate: (2 * Math.PI) / (animationPeriod * (0.8 + Math.random() * 0.4)),
                phaseOffset: (baseDelays[index % baseDelays.length] / animationPeriod) * 2 * Math.PI,
                scrollFactorY: (0.2 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -0.5),
                scrollFactorRotate: (0.02 + Math.random() * 0.03) * (Math.random() > 0.5 ? 1 : -1),
                mouseInfluence: 10 + Math.random() * 15,
                lerpFactor: 0.03 + Math.random() * 0.04,
                targetMouseOffsetX: 0,
                targetMouseOffsetY: 0,
                currentMouseOffsetX: 0,
                currentMouseOffsetY: 0,
            };
        });

        const animate = () => {
            const currentTime = performance.now();
            const currentScrollY = window.pageYOffset;

            shapes.forEach(shape => {
                const rect = shape.element.getBoundingClientRect();
                const shapeCenterX = rect.left + rect.width / 2;
                const shapeCenterY = rect.top + rect.height / 2;

                const floatY = -shape.floatAmplitudeY * Math.cos(currentTime * shape.floatSpeedY + shape.phaseOffset);
                const floatRotate = shape.floatAmplitudeRotate * Math.sin(currentTime * shape.floatSpeedRotate + shape.phaseOffset);
                const scrollTranslateY = currentScrollY * shape.scrollFactorY;
                const scrollRotate = currentScrollY * shape.scrollFactorRotate;

                const dx = shapeCenterX - state.mouse.x;
                const dy = shapeCenterY - state.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxInfluenceDistance = Math.min(window.innerWidth, window.innerHeight) / 2.5;

                if (distance < maxInfluenceDistance) {
                    const repelFactor = (1 - distance / maxInfluenceDistance) * shape.mouseInfluence;
                    shape.targetMouseOffsetX = (dx / distance) * repelFactor;
                    shape.targetMouseOffsetY = (dy / distance) * repelFactor;
                } else {
                    shape.targetMouseOffsetX = 0;
                    shape.targetMouseOffsetY = 0;
                }

                shape.currentMouseOffsetX += (shape.targetMouseOffsetX - shape.currentMouseOffsetX) * shape.lerpFactor;
                shape.currentMouseOffsetY += (shape.targetMouseOffsetY - shape.currentMouseOffsetY) * shape.lerpFactor;

                const totalTranslateX = shape.currentMouseOffsetX;
                const totalTranslateY = floatY + scrollTranslateY + shape.currentMouseOffsetY;
                const totalRotate = floatRotate + scrollRotate;

                shape.element.style.transform = `translate(${totalTranslateX}px, ${totalTranslateY}px) rotate(${totalRotate}deg)`;
            });
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    };

    const createParticleOnClick = (e) => {
        if (e.target.closest('a, button')) return; // Don't create on interactive elements

        const p = document.createElement('div');
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary').trim();
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-secondary').trim();

        p.style.cssText = `position:fixed; left:${e.clientX}px; top:${e.clientY}px; width:${Math.random()*6+4}px; height:${p.style.width}; background:${Math.random()>0.5?primaryColor:secondaryColor}; border-radius:50%; pointer-events:none; z-index:9999; opacity:0.9; animation:particle-burst 0.7s cubic-bezier(0.175,0.885,0.320,1.275) forwards;`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 700);
    };

    const updateGreetingIcon = () => {
        if (!DOM.greetingIcon) return;
        const hour = new Date().getHours();
        let icon = 'nightlight_round';
        if (hour >= 5 && hour < 12) icon = 'wb_sunny';
        else if (hour >= 12 && hour < 17) icon = 'light_mode';
        else if (hour >= 17 && hour < 20) icon = 'brightness_4';
        DOM.greetingIcon.textContent = icon;
    };

    const handlePageLoad = () => {
        window.addEventListener('load', () => {
            if (DOM.preloader) {
                DOM.preloader.classList.add('fade-out');
                DOM.preloader.addEventListener('transitionend', () => DOM.preloader.remove());
            }
            document.body.style.transition = 'opacity 0.8s var(--m3-easing-standard) 0.3s';
            document.body.style.opacity = '1';
        });
    };

    init();
});