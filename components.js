/**
 * Heimat- und Kulturverein Vorchdorf
 * Component Loader - Laedt Header und Footer dynamisch
 */

// Basis-Pfad ermitteln (fuer Unterordner)
function getBasePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;

    // Wenn wir in einem Unterordner sind
    if (path.includes('/kitzmantel/') || path.includes('/Fernberger/') || path.includes('/Krumhuber/')) {
        return '../';
    }
    return '';
}

// Header laden
async function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    const basePath = getBasePath();

    try {
        const response = await fetch(basePath + 'header.html');
        if (response.ok) {
            let html = await response.text();

            // Pfade anpassen wenn in Unterordner
            if (basePath) {
                html = html.replace(/href="(?!http|#|mailto|tel)([^"]+)"/g, 'href="' + basePath + '$1"');
                html = html.replace(/src="(?!http)([^"]+)"/g, 'src="' + basePath + '$1"');
            }

            headerPlaceholder.innerHTML = html;
            initMobileMenu();
        }
    } catch (error) {
        console.error('Header konnte nicht geladen werden:', error);
    }
}

// Footer laden
async function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    const basePath = getBasePath();

    try {
        const response = await fetch(basePath + 'footer.html');
        if (response.ok) {
            let html = await response.text();

            // Pfade anpassen wenn in Unterordner
            if (basePath) {
                html = html.replace(/href="(?!http|#|mailto|tel)([^"]+)"/g, 'href="' + basePath + '$1"');
            }

            footerPlaceholder.innerHTML = html;
        }
    } catch (error) {
        console.error('Footer konnte nicht geladen werden:', error);
    }
}

// Mobile Menu initialisieren
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Menu schliessen wenn Link geklickt wird
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling fuer Anchor-Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Alles laden wenn DOM bereit ist
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([loadHeader(), loadFooter()]);
    initSmoothScrolling();
});
