/**
 * ui.js – Shared UI utilities for Museum meets KI
 * Page transitions, touch handling, common functionality
 */

(function () {
    'use strict';

    // Page transition overlay
    function createTransition() {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition';
        overlay.innerHTML = '<div class="transition-ring"></div>';
        document.body.appendChild(overlay);
        return overlay;
    }

    // Intercept internal links for smooth transitions
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;

        e.preventDefault();
        const overlay = createTransition();
        requestAnimationFrame(function () {
            overlay.classList.add('active');
        });
        setTimeout(function () {
            window.location.href = href;
        }, 400);
    });

    // Fade in on page load
    document.addEventListener('DOMContentLoaded', function () {
        document.body.classList.add('page-loaded');
    });

    // Touch ripple effect for interactive elements
    document.addEventListener('touchstart', function (e) {
        const target = e.target.closest('.module-node, .card, .option-btn, .region');
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'touch-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        target.style.position = 'relative';
        target.style.overflow = 'hidden';
        target.appendChild(ripple);

        setTimeout(function () {
            ripple.remove();
        }, 600);
    }, { passive: true });

})();
