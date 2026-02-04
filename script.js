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

    // Centralized Footer Injection
    const footerPlaceholder = document.getElementById('main-footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <footer class="footer">
                <div class="footer-content">
                    <div>
                        <h4>Heimat- und Kulturverein Vorchdorf</h4>
                        <p>Bewahrer des kulturellen Erbes<br>
                            der Region Vorchdorf seit vielen Jahrzehnten</p>
                    </div>
                    <div>
                        <h4>Kontakt</h4>
                        <p>Bahnhofstraße 9<br>
                            4655 Vorchdorf<br>
                            E-Mail: dr.claudia@westreicher.at</p>
                    </div>
                    <div>
                        <h4>Museum der Region</h4>
                        <p>Laudachweg 17<br>
                            4655 Vorchdorf<br>
                            Tel: 07614/6555-578</p>
                    </div>
                    <div>
                        <h4>Rechtliches</h4>
                        <div class="footer-links">
                            <a href="impressum.html">Impressum</a>
                            <a href="datenschutz.html">Datenschutz</a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 Heimat- und Kulturverein Vorchdorf. Alle Rechte vorbehalten. | <small>v7.5</small></p>
                </div>
            </footer>
        `;
    }
});

