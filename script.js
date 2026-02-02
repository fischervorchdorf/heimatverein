// Main JavaScript file for Heimatverein App

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Transform hamburger icon
            const spans = hamburger.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');

                // Reset hamburger icon
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');

                // Reset hamburger icon
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
});

// Helper function to check if element is in viewport for animations
function isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Scroll Animation for Volunteer Section (Index Page)
document.addEventListener('DOMContentLoaded', () => {
    const volunteerSection = document.getElementById('volunteer');
    if (volunteerSection) {
        const volunteerWords = volunteerSection.querySelectorAll('.word');
        const volunteerEmoji = volunteerSection.querySelector('.volunteer-emoji');
        let animationTriggered = false;

        function checkVolunteerSection() {
            if (animationTriggered) return;

            if (isElementInViewport(volunteerSection)) {
                // Trigger animation when section is visible (using helper or simple rect check)
                // Using the original logic for consistency:
                const rect = volunteerSection.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;

                // Trigger when top is within 70% of viewport height
                if (rect.top <= windowHeight * 0.7) {
                    animationTriggered = true;

                    // Animate words
                    volunteerWords.forEach(word => {
                        word.classList.add('animate');
                    });

                    // Animate emoji
                    if (volunteerEmoji) volunteerEmoji.classList.add('animate');
                }
            }
        }

        window.addEventListener('scroll', checkVolunteerSection);
        // Initial check
        checkVolunteerSection();
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

