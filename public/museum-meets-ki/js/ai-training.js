/**
 * ai-training.js – AI Training Mini-Game
 * User classifies images as Dog/Cat to simulate ML training
 */

(function () {
    'use strict';

    // SVG placeholder images for dogs and cats
    const images = [
        { svg: dogSVG(1), label: 'dog', hint: 'Spitze Ohren, lange Schnauze' },
        { svg: catSVG(1), label: 'cat', hint: 'Mandelförmige Augen, Schnurrhaare' },
        { svg: dogSVG(2), label: 'dog', hint: 'Wedelnder Schwanz, treuer Blick' },
        { svg: catSVG(2), label: 'cat', hint: 'Eingerollter Schwanz, runde Ohren' },
        { svg: dogSVG(3), label: 'dog', hint: 'Hängende Zunge, große Pfoten' },
        { svg: catSVG(3), label: 'cat', hint: 'Geschmeidige Silhouette' },
        { svg: dogSVG(4), label: 'dog', hint: 'Kräftiger Körperbau' },
        { svg: catSVG(4), label: 'cat', hint: 'Aufgestellter Schwanz' },
        { svg: dogSVG(5), label: 'dog', hint: 'Breite Brust, muskulös' },
        { svg: catSVG(5), label: 'cat', hint: 'Elegante Haltung' },
        { svg: dogSVG(6), label: 'dog', hint: 'Große Nase, Schlappohren' },
        { svg: catSVG(6), label: 'cat', hint: 'Schlanker Körper' }
    ];

    function dogSVG(variant) {
        const colors = ['#c89b6b', '#8B6914', '#d4a574', '#a0785a', '#e8c99b', '#b8860b'];
        const c = colors[(variant - 1) % colors.length];
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#0e2233" rx="20"/>
            <!-- Body -->
            <ellipse cx="100" cy="130" rx="50" ry="35" fill="${c}"/>
            <!-- Head -->
            <circle cx="100" cy="80" r="30" fill="${c}"/>
            <!-- Ears -->
            <ellipse cx="75" cy="58" rx="12" ry="18" fill="${c}" transform="rotate(-15 75 58)"/>
            <ellipse cx="125" cy="58" rx="12" ry="18" fill="${c}" transform="rotate(15 125 58)"/>
            <!-- Eyes -->
            <circle cx="90" cy="75" r="5" fill="#1a1a2e"/>
            <circle cx="110" cy="75" r="5" fill="#1a1a2e"/>
            <circle cx="91" cy="74" r="2" fill="white"/>
            <circle cx="111" cy="74" r="2" fill="white"/>
            <!-- Nose -->
            <ellipse cx="100" cy="88" rx="6" ry="4" fill="#2c2c2c"/>
            <!-- Tongue -->
            <ellipse cx="100" cy="96" rx="5" ry="7" fill="#e87d7d"/>
            <!-- Tail -->
            <path d="M 150 125 Q 170 100 165 85" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <!-- Legs -->
            <rect x="70" y="155" width="10" height="20" rx="5" fill="${c}"/>
            <rect x="90" y="155" width="10" height="20" rx="5" fill="${c}"/>
            <rect x="110" y="155" width="10" height="20" rx="5" fill="${c}"/>
            <rect x="120" y="155" width="10" height="20" rx="5" fill="${c}"/>
            <!-- Label -->
            <text x="100" y="195" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-size="10" font-family="monospace">SAMPLE #${variant}</text>
        </svg>`;
    }

    function catSVG(variant) {
        const colors = ['#808080', '#4a4a4a', '#b0b0b0', '#c0c0c0', '#696969', '#a9a9a9'];
        const c = colors[(variant - 1) % colors.length];
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#0e2233" rx="20"/>
            <!-- Body -->
            <ellipse cx="100" cy="135" rx="40" ry="30" fill="${c}"/>
            <!-- Head -->
            <circle cx="100" cy="85" r="28" fill="${c}"/>
            <!-- Pointed ears -->
            <polygon points="75,65 68,38 88,58" fill="${c}"/>
            <polygon points="125,65 132,38 112,58" fill="${c}"/>
            <polygon points="77,63 72,44 86,58" fill="#e8a0a0"/>
            <polygon points="123,63 128,44 114,58" fill="#e8a0a0"/>
            <!-- Eyes (almond shaped) -->
            <ellipse cx="88" cy="82" rx="7" ry="5" fill="#2ecc71"/>
            <ellipse cx="112" cy="82" rx="7" ry="5" fill="#2ecc71"/>
            <ellipse cx="88" cy="82" rx="2" ry="5" fill="#1a1a2e"/>
            <ellipse cx="112" cy="82" rx="2" ry="5" fill="#1a1a2e"/>
            <!-- Nose -->
            <polygon points="100,90 96,94 104,94" fill="#e87d7d"/>
            <!-- Whiskers -->
            <line x1="60" y1="90" x2="85" y2="92" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
            <line x1="60" y1="95" x2="85" y2="95" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
            <line x1="115" y1="92" x2="140" y2="90" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
            <line x1="115" y1="95" x2="140" y2="95" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
            <!-- Tail -->
            <path d="M 140 130 Q 165 110 170 130 Q 175 150 160 145" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/>
            <!-- Legs -->
            <rect x="75" y="158" width="8" height="18" rx="4" fill="${c}"/>
            <rect x="90" y="158" width="8" height="18" rx="4" fill="${c}"/>
            <rect x="108" y="158" width="8" height="18" rx="4" fill="${c}"/>
            <rect x="118" y="158" width="8" height="18" rx="4" fill="${c}"/>
            <!-- Label -->
            <text x="100" y="195" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-size="10" font-family="monospace">SAMPLE #${variant}</text>
        </svg>`;
    }

    let currentIndex = 0;
    let correctCount = 0;
    let totalAnswered = 0;
    let shuffledImages = [];
    let isComplete = false;

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function init() {
        shuffledImages = shuffle(images);
        currentIndex = 0;
        correctCount = 0;
        totalAnswered = 0;
        isComplete = false;

        showImage();
        updateProgress();

        document.getElementById('btn-dog').addEventListener('click', function () { answer('dog'); });
        document.getElementById('btn-cat').addEventListener('click', function () { answer('cat'); });
    }

    function showImage() {
        if (currentIndex >= shuffledImages.length) {
            showComplete();
            return;
        }

        const img = shuffledImages[currentIndex];
        const container = document.getElementById('image-display');
        container.innerHTML = img.svg;
        container.classList.remove('fade-in');
        void container.offsetWidth;
        container.classList.add('fade-in');

        document.getElementById('sample-counter').textContent =
            `Datensatz ${currentIndex + 1} / ${shuffledImages.length}`;
    }

    function answer(choice) {
        if (isComplete) return;

        const img = shuffledImages[currentIndex];
        const correct = choice === img.label;
        totalAnswered++;

        if (correct) {
            correctCount++;
            showFeedback(true, img.label === 'dog' ? 'Hund' : 'Katze');
        } else {
            showFeedback(false, img.label === 'dog' ? 'Hund' : 'Katze');
        }

        updateProgress();
        currentIndex++;

        setTimeout(function () {
            hideFeedback();
            showImage();
        }, 1200);
    }

    function showFeedback(correct, label) {
        const fb = document.getElementById('feedback');
        fb.textContent = correct ? `Richtig! Das ist ein ${label}.` : `Falsch! Das war ein ${label}.`;
        fb.className = 'feedback ' + (correct ? 'correct' : 'wrong');
        fb.style.display = 'block';
    }

    function hideFeedback() {
        document.getElementById('feedback').style.display = 'none';
    }

    function updateProgress() {
        const accuracy = totalAnswered === 0 ? 0 : Math.round((correctCount / totalAnswered) * 100);
        const bar = document.getElementById('progress-fill');
        const text = document.getElementById('accuracy-text');
        const epochText = document.getElementById('epoch-text');

        bar.style.width = accuracy + '%';
        text.textContent = `Trainingsgenauigkeit: ${accuracy}%`;

        // Simulate epochs
        const epoch = Math.min(Math.floor(totalAnswered / 3) + 1, 4);
        epochText.textContent = `Epoche ${epoch}`;

        // Color based on accuracy
        if (accuracy >= 80) {
            bar.style.background = 'linear-gradient(90deg, #00e5ff, #00ff88)';
        } else if (accuracy >= 50) {
            bar.style.background = 'linear-gradient(90deg, #00e5ff, #d4af37)';
        } else {
            bar.style.background = 'linear-gradient(90deg, #00e5ff, #ff6b6b)';
        }
    }

    function showComplete() {
        isComplete = true;
        const accuracy = Math.round((correctCount / totalAnswered) * 100);

        document.getElementById('game-area').style.display = 'none';
        const result = document.getElementById('result-area');
        result.style.display = 'block';

        document.getElementById('final-accuracy').textContent = accuracy + '%';
        document.getElementById('final-correct').textContent = `${correctCount} von ${totalAnswered} richtig`;

        let message;
        if (accuracy >= 90) {
            message = 'Dein KI-Modell ist hervorragend trainiert! In der Realität braucht ein neuronales Netzwerk Tausende solcher Beispiele.';
        } else if (accuracy >= 70) {
            message = 'Gutes Training! Mit mehr Daten würde die Genauigkeit weiter steigen – genau wie bei echtem Machine Learning.';
        } else {
            message = 'Das Modell braucht noch Training. In der Realität lernen KI-Systeme aus Millionen von Beispielen.';
        }
        document.getElementById('result-message').textContent = message;

        document.getElementById('btn-restart').addEventListener('click', function () {
            document.getElementById('game-area').style.display = 'block';
            result.style.display = 'none';
            init();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
