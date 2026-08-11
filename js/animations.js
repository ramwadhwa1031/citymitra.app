// ══════════════════════════════════════════
// CITY MITRA — Animations & Interactions
// ══════════════════════════════════════════

(function () {
    'use strict';

    // ── Scroll Reveal ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    // ── Stat Counter Animation ──
    function animateCounters() {
        document.querySelectorAll('[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                const current = Math.floor(eased * target);

                el.textContent = current.toLocaleString() + suffix;

                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    // ── Navbar Scroll Effect ──
    function handleNavScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ── Active Nav Link ──
    function setActiveNavLink() {
        const path = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && (path.endsWith(href) || (href === 'index.html' && (path === '/' || path.endsWith('/'))))) {
                link.classList.add('active');
            }
        });
    }

    // ── Mobile Nav ──
    window.toggleMobileNav = function () {
        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.toggle('mobile-open');
    };

    // ── Initialize ──
    document.addEventListener('DOMContentLoaded', () => {
        // Observe all reveal elements
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // Stat counters
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) statsObserver.observe(statsSection);

        handleNavScroll();
        setActiveNavLink();
    });

})();
