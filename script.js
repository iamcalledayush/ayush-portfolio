/* ============================================
   CASE #2025-AI — THE AYUSH SHARMA FILES
   Crime Scene Portfolio — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- LOADING SCREEN ---
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    const loadingBar = document.getElementById('loading-bar');
    const clearanceText = document.getElementById('clearance-text');
    const mainContent = document.getElementById('main-content');

    let progress = 0;

    function typeText(element, text, speed = 50) {
        return new Promise(resolve => {
            element.textContent = '';
            let i = 0;
            const interval = setInterval(() => {
                element.textContent += text[i];
                i++;
                if (i >= text.length) { clearInterval(interval); resolve(); }
            }, speed);
        });
    }

    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function animateProgress() {
        const interval = setInterval(() => {
            progress += Math.random() * 8 + 3;
            if (progress >= 100) {
                progress = 100;
                loadingBar.style.width = '100%';
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                    mainContent.classList.remove('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        initAll();
                    }, 450);
                }, 280);
            } else {
                loadingBar.style.width = progress + '%';
            }
        }, 45);
    }

    async function runLoadingSequence() {
        await typeText(loadingText, 'ACCESSING INTELLIGENCE DATABASE...', 16);
        await delay(320);
        await typeText(loadingText, 'SUBJECT MATCH FOUND — AYUSH SHARMA', 15);
        await delay(280);
        clearanceText.textContent = 'DOSSIER ACCESS GRANTED';
        clearanceText.style.color = '#cc0000';
        await delay(450);
        await typeText(loadingText, 'COMPILING DOSSIER...', 16);
        animateProgress();
    }

    runLoadingSequence();

    // --- SCROLL DIRECTION TRACKING + NAV HIDE/SHOW ---
    let lastScrollY = 0;
    let scrollingDown = true;
    const navBar = document.getElementById('nav-bar');
    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        scrollingDown = currentY > lastScrollY;
        if (scrollingDown && currentY > 80) {
            navBar.classList.add('nav-hidden');
        } else {
            navBar.classList.remove('nav-hidden');
        }
        lastScrollY = currentY;
    });

    // --- INIT ALL ---
    // Stamps are now triggered directly from the typing animation — no separate observer
    function initStamps() {}

    // --- INFINITE TAPE TEXT ---
    function initInfiniteTapes() {
        document.querySelectorAll('.caution-tape-text').forEach(el => {
            const text = el.innerHTML;
            el.innerHTML = text + text;
        });
    }
    initInfiniteTapes();

    // --- NAV BAR ---
    function initNavBar() {
        const navLinks = document.querySelectorAll('#nav-bar a');
        const sections = document.querySelectorAll('.section');

        // Smooth scroll
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // Highlight active section on scroll
        const navObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(l => l.classList.remove('active'));
                    const active = document.querySelector(`#nav-bar a[href="#${id}"]`);
                    if (active) active.classList.add('active');
                }
            });
        }, { threshold: 0.2, rootMargin: '-44px 0px -50% 0px' });
        sections.forEach(s => navObs.observe(s));
    }

    function initAll() {
        initNavBar();
        initScrollAnimations();
        initStamps();
        addTypingToHeaders();
        initExpCardToggles();
        initImpactCardToggles();
        initWeaponHoverEffects();
        initParallaxElements();
        initFlickerEffect();
        initDossierRedactions();
        initMobileFeatures();
    }

    // --- SCROLL REVEAL ---
    function initScrollAnimations() {
        // Observe entire sections — when a section enters, type heading then reveal content together
        const sections = document.querySelectorAll('.section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                const revealEls = section.querySelectorAll('.reveal, .exp-card, .dossier-entry, .weapon-category, .operation-file, .wanted-poster, .corkboard, .board-hint');

                if (entry.isIntersecting) {
                    // Show all content in this section with stagger
                    revealEls.forEach((el, i) => {
                        setTimeout(() => {
                            el.classList.add('visible');
                            el.querySelectorAll('.reveal-child').forEach((child, j) => {
                                setTimeout(() => child.classList.add('visible'), j * 150);
                            });
                        }, i * 100);
                    });
                } else {
                    revealEls.forEach(el => {
                        el.classList.remove('visible');
                        el.querySelectorAll('.reveal-child').forEach(child => child.classList.remove('visible'));
                    });
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30% 0px' });
        sections.forEach(s => observer.observe(s));
    }

    // --- TYPING HEADERS ---
    function addTypingToHeaders() {
        const headers = document.querySelectorAll('.stamp-header');
        headers.forEach(h => {
            h.dataset.fullText = h.textContent;
            h.textContent = '';
            h.style.borderColor = 'transparent';
            h._typingInterval = null;
            h._done = false;
        });
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                const text = el.dataset.fullText;
                if (entry.isIntersecting) {
                    if (el._typingInterval) return; // already running
                    el._done = false;
                    el.textContent = '';
                    el.style.borderColor = 'transparent';
                    let i = 0;
                    el._typingInterval = setInterval(() => {
                        if (i < text.length) {
                            el.textContent = text.substring(0, i + 1);
                            i++;
                        } else {
                            clearInterval(el._typingInterval);
                            el._typingInterval = null;
                            el._done = true;
                            el.style.borderColor = '#f5c518';
                            // Trigger stamp after typing completes
                            const sectionHeader = el.closest('.section-header');
                            if (sectionHeader) {
                                const stamp = sectionHeader.querySelector('.classified-stamp, .top-secret-stamp');
                                if (stamp) {
                                    stamp.classList.remove('stamp-animate');
                                    void stamp.offsetWidth;
                                    stamp.classList.add('stamp-animate');
                                }
                            }
                        }
                    }, 35);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30% 0px' });
        headers.forEach(h => obs.observe(h));

        // Separate observer for reset — only triggers when element is almost fully off screen
        const resetObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                if (!entry.isIntersecting) {
                    if (el._typingInterval) {
                        clearInterval(el._typingInterval);
                        el._typingInterval = null;
                    }
                    el._done = false;
                    el.textContent = '';
                    el.style.borderColor = 'transparent';
                    const sectionHeader = el.closest('.section-header');
                    if (sectionHeader) {
                        const stamp = sectionHeader.querySelector('.classified-stamp, .top-secret-stamp');
                        if (stamp) stamp.classList.remove('stamp-animate');
                    }
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
        headers.forEach(h => resetObs.observe(h));
    }

    // --- EXP CARD EXPAND/COLLAPSE ---
    function initExpCardToggles() {
        document.querySelectorAll('.exp-card').forEach(card => {
            const rot = card.dataset.rotate || '0';
            card.style.transform = `rotate(${rot}deg)`;

            let savedScrollY = 0;

            card.querySelector('.exp-front').addEventListener('click', () => {
                savedScrollY = window.scrollY;
                // Close any other open card first
                document.querySelectorAll('.exp-card.open').forEach(c => {
                    if (c !== card) {
                        c.classList.remove('open');
                        const cRot = c.dataset.rotate || '0';
                        c.style.transform = `rotate(${cRot}deg)`;
                    }
                });
                card.classList.add('open');
                setTimeout(() => {
                    const rect = card.getBoundingClientRect();
                    const offset = window.scrollY + rect.top - 80;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }, 50);
            });

            const closeBtn = card.querySelector('.close-card');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    card.classList.remove('open');
                    card.style.transform = `rotate(${rot}deg)`;
                    window.scrollTo({ top: savedScrollY, behavior: 'smooth' });
                });
            }
        });
    }

    // --- IMPACT CARD EXPAND ---
    function initImpactCardToggles() {
        document.querySelectorAll('.impact-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.toggle('open');
            });
        });
    }

    // --- WEAPON/SKILL HOVER EFFECTS ---
    function initWeaponHoverEffects() {
        document.querySelectorAll('.evidence-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'scale(1.1) rotate(' + (Math.random() * 4 - 2) + 'deg)';
                tag.style.transition = 'all 0.15s ease';
                tag.style.boxShadow = '0 0 12px rgba(245, 197, 24, 0.3)';
                tag.style.zIndex = '10';
            });
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = '';
                tag.style.boxShadow = '';
                tag.style.zIndex = '';
            });

            // Click to "scan" — flash green briefly
            tag.addEventListener('click', () => {
                const orig = tag.style.background;
                tag.style.background = 'rgba(57,255,20,0.2)';
                tag.style.borderColor = '#39ff14';
                tag.style.color = '#39ff14';
                setTimeout(() => {
                    tag.style.background = orig;
                    tag.style.borderColor = '';
                    tag.style.color = '';
                }, 400);
            });
        });
    }

    // --- PARALLAX ELEMENTS ---
    function initParallaxElements() {
        window.addEventListener('scroll', () => {
            // Classified watermarks drift
            document.querySelectorAll('.classified-watermark').forEach(wm => {
                const rect = wm.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const drift = (window.innerHeight / 2 - rect.top) * 0.03;
                    wm.style.transform = `rotate(-35deg) translate(${drift}px, ${drift * 0.5}px)`;
                }
            });
        });
    }

    // --- SCREEN FLICKER EFFECT (disabled — was causing visible flickering) ---
    function initFlickerEffect() {}

    // --- (redaction removed) ---
    function initDossierRedactions() {}

    // --- MOBILE IMPROVEMENTS ---
    function initMobileFeatures() {
        const isMobile = window.matchMedia('(max-width: 810px)');
        if (!isMobile.matches) return;

        // 1. Sticky mini-header
        initMiniHeader();

        // 2. Corkboard carousels
        initCorkboardCarousels();

        // 7. Scroll-to-top button
        initScrollToTop();
    }

    // 1. Mini-header that appears after scrolling past profile
    function initMiniHeader() {
        const miniHeader = document.createElement('div');
        miniHeader.className = 'mobile-mini-header';
        miniHeader.innerHTML = `
            <img src="mugshot.jpg" alt="Ayush Sharma" class="mini-mugshot">
            <div>
                <div class="mini-name">Ayush Sharma</div>
                <div class="mini-role">AI Engineer</div>
            </div>
        `;
        const nav = document.getElementById('nav-bar');
        nav.parentNode.insertBefore(miniHeader, nav.nextSibling);

        const profileSection = document.getElementById('suspect-profile');
        if (!profileSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    miniHeader.classList.remove('visible');
                } else {
                    // Only show when scrolled below the profile
                    if (window.scrollY > profileSection.offsetTop + profileSection.offsetHeight / 2) {
                        miniHeader.classList.add('visible');
                    } else {
                        miniHeader.classList.remove('visible');
                    }
                }
            });
        }, { threshold: 0, rootMargin: '-44px 0px 0px 0px' });

        observer.observe(profileSection);
    }

    // 2 & 3. Carousel setup for corkboards
    function initCorkboardCarousels() {
        // Main corkboards (experience + projects)
        document.querySelectorAll('.corkboard').forEach(corkboard => {
            setupCarousel(corkboard, '.exp-card', 'carousel-wrapper', 'carousel-dots');
        });

        // Skills (weapons grid)
        const weaponsGrid = document.querySelector('.weapons-grid');
        if (weaponsGrid) {
            setupCarousel(weaponsGrid, '.weapon-category', 'carousel-wrapper', 'carousel-dots');
        }

        // Education (dossier entries)
        const dossierEntries = document.querySelector('.dossier-entries');
        if (dossierEntries) {
            setupCarousel(dossierEntries, '.dossier-entry', 'carousel-wrapper', 'carousel-dots');
        }

        // Inner corkboards (impact cards inside expanded experience)
        // These need to be set up when cards open, so we use a MutationObserver
        const expCards = document.querySelectorAll('.exp-card');
        expCards.forEach(card => {
            const innerCorkboard = card.querySelector('.inner-corkboard');
            if (!innerCorkboard) return;

            // Set up inner carousel when card is opened
            const mutObs = new MutationObserver(() => {
                if (card.classList.contains('open')) {
                    // Small delay to let the expanded content render
                    setTimeout(() => {
                        if (!innerCorkboard.classList.contains('mobile-carousel-inner')) {
                            setupInnerCarousel(innerCorkboard);
                        }
                    }, 100);
                }
            });
            mutObs.observe(card, { attributes: true, attributeFilter: ['class'] });
        });
    }

    function setupCarousel(corkboard, cardSelector, wrapperClass, dotsClass) {
        const cards = Array.from(corkboard.querySelectorAll(':scope > ' + cardSelector));
        if (cards.length <= 1) return;

        corkboard.classList.add('mobile-carousel');

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = wrapperClass;

        // Move cards into wrapper
        cards.forEach(card => {
            wrapper.appendChild(card);
        });

        // Create dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = dotsClass;
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to card ' + (i + 1));
            dot.addEventListener('click', () => {
                const cardWidth = wrapper.children[0].offsetWidth + 12; // gap
                wrapper.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        });

        corkboard.appendChild(wrapper);
        corkboard.appendChild(dotsContainer);

        // Update dots on scroll
        wrapper.addEventListener('scroll', () => {
            const scrollLeft = wrapper.scrollLeft;
            const cardWidth = wrapper.children[0].offsetWidth + 12;
            const activeIndex = Math.round(scrollLeft / cardWidth);
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        });
    }

    function setupInnerCarousel(innerCorkboard) {
        const cards = Array.from(innerCorkboard.querySelectorAll(':scope > .impact-card'));
        if (cards.length <= 1) return;

        innerCorkboard.classList.add('mobile-carousel-inner');

        const wrapper = document.createElement('div');
        wrapper.className = 'inner-carousel-wrapper';

        cards.forEach(card => {
            wrapper.appendChild(card);
        });

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'inner-carousel-dots';
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to impact ' + (i + 1));
            dot.addEventListener('click', () => {
                const cardWidth = wrapper.children[0].offsetWidth + 10;
                wrapper.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        });

        innerCorkboard.appendChild(wrapper);
        innerCorkboard.appendChild(dotsContainer);

        wrapper.addEventListener('scroll', () => {
            const scrollLeft = wrapper.scrollLeft;
            const cardWidth = wrapper.children[0].offsetWidth + 10;
            const activeIndex = Math.round(scrollLeft / cardWidth);
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        });
    }

    // 7. Scroll-to-top floating button
    function initScrollToTop() {
        const btn = document.createElement('button');
        btn.className = 'scroll-top-btn';
        btn.innerHTML = '&#8593;';
        btn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
