document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // LOADER
    // =====================================
    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) loader.classList.add('is-hidden');
            document.body.classList.add('is-loaded');
        }, 600);
    });

    if (document.readyState === 'complete') {
        setTimeout(() => {
            if (loader) loader.classList.add('is-hidden');
            document.body.classList.add('is-loaded');
        }, 300);
    }


    // =====================================
    // TRICOLOR LOGO ANIMATION
    // =====================================
    if (typeof gsap !== 'undefined') {
        const logoText = document.getElementById('logoText');
        if (logoText) {
            console.log('✓ Logo tricolor animation initialized');
            
            gsap.to(logoText, {
                backgroundPosition: '400% 50%',
                duration: 20,
                ease: 'none',
                repeat: -1
            });
        } else {
            console.warn('⚠ Logo element #logoText not found');
        }
    }


    // =====================================
    // CUSTOM CURSOR
    // =====================================
    // const cursor = document.querySelector('.cursor');
    // const cursorDot = document.querySelector('.cursor__dot');
    // const cursorCircle = document.querySelector('.cursor__circle');

    // if (window.innerWidth > 1024 && cursor && cursorDot && cursorCircle) {
    //     let mx = 0, my = 0;
    //     let dx = 0, dy = 0;
    //     let cx = 0, cy = 0;

    //     document.addEventListener('mousemove', (e) => {
    //         mx = e.clientX;
    //         my = e.clientY;
    //     }, { passive: true });

    //     function tick() {
    //         dx += (mx - dx) * 0.3;
    //         dy += (my - dy) * 0.3;
    //         cursorDot.style.left = dx + 'px';
    //         cursorDot.style.top = dy + 'px';

    //         cx += (mx - cx) * 0.12;
    //         cy += (my - cy) * 0.12;
    //         cursorCircle.style.left = cx + 'px';
    //         cursorCircle.style.top = cy + 'px';

    //         requestAnimationFrame(tick);
    //     }
    //     tick();

    //     document.querySelectorAll('a, button, .story-card, .archive-item, .magazine-cover').forEach(el => {
    //         el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
    //         el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
    //     });

    //     document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    //     document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
    // }


    // =====================================
    // FULLSCREEN MENU
    // =====================================
    const menuBtn = document.getElementById('menuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = document.querySelectorAll('[data-menu-link]');
    let menuOpen = false;

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuOpen = !menuOpen;
            menuBtn.setAttribute('aria-expanded', menuOpen);
            menuOpen ? openMenu() : closeMenu();
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    closeMenu();
                    setTimeout(() => {
                        const target = document.querySelector(href);
                        if (target) smoothScrollTo(target);
                    }, 700);
                }
            });
        });

        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay && menuOpen) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOpen) closeMenu();
        });
    }

    function openMenu() {
        menuBtn.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.classList.add('menu-open');
        menuOpen = true;
    }

    function closeMenu() {
        menuBtn.classList.remove('active');
        menuOpen = false;

        if (typeof gsap !== 'undefined') {
            gsap.to('.menu-nav__text', {
                y: -40,
                opacity: 0,
                duration: 0.3,
                stagger: 0.03,
                ease: 'power2.in',
                onComplete: () => {
                    menuOverlay.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    gsap.set('.menu-nav__text', { y: '110%', opacity: 1 });
                }
            });
        } else {
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }


    // =====================================
    // SMOOTH SCROLL
    // =====================================
    function smoothScrollTo(target) {
        const nav = document.querySelector('.nav');
        const offset = nav ? nav.offsetHeight : 80;
        window.scrollTo({
            top: target.offsetTop - offset,
            behavior: 'smooth'
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) smoothScrollTo(target);
            }
        });
    });


    // =====================================
    // NAVIGATION AUTO-HIDE
    // =====================================
    let lastScroll = 0;
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;

        if (y <= 80) {
            nav.classList.remove('nav--hidden');
            lastScroll = y;
            return;
        }

        if (y > lastScroll && y > 160) {
            nav.classList.add('nav--hidden');
        } else if (y < lastScroll) {
            nav.classList.remove('nav--hidden');
        }
        lastScroll = y;
    }, { passive: true });


    // =====================================
    // GSAP SCROLL ANIMATIONS
    // =====================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.config({
            limitCallbacks: true,
            syncInterval: 16
        });

        const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!noMotion) {

            // CRITICAL FIX: Force featured header to always be visible
            gsap.set('.featured__header .section-label', {
                opacity: 1,
                y: 0,
                clearProps: 'all'
            });

            // --- Hero entrance ---
const heroTl = gsap.timeline({ delay: 0.8 });

heroTl
    .to('.hero__logo', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
    })
    .from('.hero__title', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
    }, '-=0.4')
    .from('.hero__subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
    }, '-=0.5')
    .from('.hero__meta', {
        y: 15,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4')
    .from('.hero__cta', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.3')
    .to('.hero__banner-placeholder', {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, 0.3);



            // --- Image reveals on scroll ---
            gsap.utils.toArray('[data-reveal-image]').forEach(el => {
                if (el.closest('.hero')) return;

                gsap.fromTo(el,
                    { clipPath: 'inset(20% 0 0 0)' },
                    {
                        clipPath: 'inset(0% 0 0 0)',
                        duration: 0.9,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            once: true
                        }
                    }
                );
            });


            // --- Section text reveals ---
            gsap.utils.toArray('[data-reveal]').forEach(el => {
                const isHero = el.closest('.hero');
                const isFeaturedHeader = el.classList.contains('section-label') && el.closest('.featured__header');
                
                if (isHero || isFeaturedHeader) {
                    console.log('✓ Skipping GSAP animation for:', el.textContent.trim());
                    return;
                }

                gsap.from(el, {
                    y: 20,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        once: true
                    }
                });
            });




            // --- Magazine cover ---
            gsap.from('.magazine-cover', {
                y: 28,
                scale: 0.98,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.featured',
                    start: 'top 72%',
                    once: true
                }
            });

            gsap.from('.featured__text > *', {
                y: 20,
                opacity: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.featured__text',
                    start: 'top 80%',
                    once: true
                }
            });


            // --- Story cards ---
            gsap.from('.story-card', {
                y: 28,
                opacity: 0,
                duration: 0.7,
                stagger: 0.06,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.stories__grid',
                    start: 'top 80%',
                    once: true
                }
            });


            // --- Archive items ---
            gsap.from('.archive-item', {
                y: 24,
                opacity: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.archive__grid',
                    start: 'top 80%',
                    once: true
                }
            });


            // --- Stats counter ---
            document.querySelectorAll('.stat-item__number').forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                if (isNaN(target)) return;

                gsap.fromTo(stat,
                    { textContent: 0 },
                    {
                        textContent: target,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { textContent: 1 },
                        scrollTrigger: {
                            trigger: stat,
                            start: 'top 85%',
                            once: true
                        },
                        onUpdate() {
                            stat.textContent = Math.ceil(parseFloat(stat.textContent));
                        }
                    }
                );
            });


            // --- Footer ---
            gsap.from('.footer__main > *', {
                y: 18,
                opacity: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.footer',
                    start: 'top 88%',
                    once: true
                }
            });
            console.log('✓ ScrollTrigger animations:', ScrollTrigger.getAll().length, 'active');
        }
    }


    // =====================================
    // RESIZE HANDLER
    // =====================================
    let ww = window.innerWidth;
    window.addEventListener('resize', () => {
        const nw = window.innerWidth;
        if ((ww <= 1024 && nw > 1024) || (ww > 1024 && nw <= 1024)) {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }
        ww = nw;
    });


    // =====================================
    // ACCESSIBILITY
    // =====================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
    });
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });


    // =====================================
    // CONSOLE
    // =====================================
    console.log(
        '%c✦ Indian Thozhilali — Production Ready',
        'font-size: 16px; font-weight: 600; color: #1A1814; padding: 6px 0;'
    );

});
