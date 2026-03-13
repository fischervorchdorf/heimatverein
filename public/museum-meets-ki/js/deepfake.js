/**
 * deepfake.js – Deepfake Detection Mini-Game
 * User identifies real vs AI-generated content
 */

(function () {
    'use strict';

    const rounds = [
        {
            title: 'Portrait-Foto',
            real: createFaceSVG('real', 1),
            fake: createFaceSVG('fake', 1),
            realSide: 'left',
            explanation: 'Achte auf asymmetrische Details: Echte Gesichter haben kleine Unregelmäßigkeiten bei Ohren, Augenbrauen und Hautstruktur. KI-generierte Bilder sind oft zu symmetrisch und perfekt.'
        },
        {
            title: 'Handschrift',
            real: createTextSVG('real'),
            fake: createTextSVG('fake'),
            realSide: 'right',
            explanation: 'KI-generierte Texte haben oft inkonsistente Buchstabenformen und unnatürliche Abstände. Echte Handschrift hat einen persönlichen, wiedererkennbaren Rhythmus.'
        },
        {
            title: 'Landschaftsfoto',
            real: createLandscapeSVG('real'),
            fake: createLandscapeSVG('fake'),
            realSide: 'left',
            explanation: 'KI-Bilder haben häufig Probleme mit feinen Details wie Baumästen, Spiegelungen im Wasser oder Texturübergängen. Achte auf unnatürliche Wiederholungen.'
        },
        {
            title: 'Historisches Dokument',
            real: createDocSVG('real'),
            fake: createDocSVG('fake'),
            realSide: 'right',
            explanation: 'KI kann historische Dokumente imitieren, macht aber oft Fehler bei Typografie, Papierstruktur und zeitgenössischen Details wie Siegeln oder Wasserzeichen.'
        },
        {
            title: 'Stimmenanalyse',
            real: createWaveformSVG('real'),
            fake: createWaveformSVG('fake'),
            realSide: 'left',
            explanation: 'Audio-Deepfakes werden immer besser, haben aber oft unnatürliche Pausen, fehlende Atemgeräusche oder eine zu gleichmäßige Tonlage.'
        }
    ];

    function createFaceSVG(type, variant) {
        if (type === 'real') {
            return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#0e2233" rx="12"/>
                <circle cx="100" cy="90" r="50" fill="#d4a574"/>
                <!-- Slightly asymmetric features (real) -->
                <ellipse cx="82" cy="82" rx="7" ry="8" fill="white"/>
                <ellipse cx="118" cy="83" rx="6.5" ry="7.5" fill="white"/>
                <circle cx="83" cy="83" r="4" fill="#4a3728"/>
                <circle cx="117" cy="84" r="3.8" fill="#4a3728"/>
                <!-- Asymmetric eyebrows -->
                <path d="M 70 72 Q 82 66 94 72" stroke="#5a4030" stroke-width="2.5" fill="none"/>
                <path d="M 106 73 Q 118 68 130 73" stroke="#5a4030" stroke-width="2" fill="none"/>
                <!-- Nose slightly off-center -->
                <path d="M 99 82 L 96 100 Q 100 104 105 100 L 101 82" fill="#c4956a"/>
                <!-- Slight smile, natural -->
                <path d="M 84 108 Q 100 118 116 107" stroke="#8a6050" stroke-width="2" fill="none"/>
                <!-- Ears different sizes -->
                <ellipse cx="48" cy="88" rx="8" ry="14" fill="#c4956a"/>
                <ellipse cx="152" cy="90" rx="7" ry="12" fill="#c4956a"/>
                <!-- Hair with natural variation -->
                <path d="M 50 70 Q 55 30 100 25 Q 145 30 150 70" fill="#3a2518" stroke="none"/>
                <path d="M 52 68 Q 58 45 80 38" stroke="#4a3020" stroke-width="1" fill="none"/>
                <!-- Skin texture dots -->
                <circle cx="125" cy="95" r="1" fill="#b8856a" opacity="0.5"/>
                <circle cx="78" cy="100" r="0.8" fill="#b8856a" opacity="0.4"/>
                <text x="100" y="185" text-anchor="middle" fill="rgba(0,229,255,0.3)" font-size="11" font-family="Orbitron">FOTO A</text>
            </svg>`;
        } else {
            return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#0e2233" rx="12"/>
                <circle cx="100" cy="90" r="50" fill="#d4a574"/>
                <!-- Perfectly symmetric features (fake) -->
                <ellipse cx="82" cy="82" rx="7" ry="8" fill="white"/>
                <ellipse cx="118" cy="82" rx="7" ry="8" fill="white"/>
                <circle cx="82" cy="82" r="4" fill="#4a3728"/>
                <circle cx="118" cy="82" r="4" fill="#4a3728"/>
                <!-- Perfectly symmetric eyebrows -->
                <path d="M 68 72 Q 82 66 96 72" stroke="#5a4030" stroke-width="2" fill="none"/>
                <path d="M 104 72 Q 118 66 132 72" stroke="#5a4030" stroke-width="2" fill="none"/>
                <!-- Perfectly centered nose -->
                <path d="M 100 82 L 96 100 Q 100 104 104 100 L 100 82" fill="#c4956a"/>
                <!-- Perfect smile -->
                <path d="M 82 108 Q 100 120 118 108" stroke="#8a6050" stroke-width="2" fill="none"/>
                <!-- Identical ears -->
                <ellipse cx="48" cy="88" rx="7" ry="13" fill="#c4956a"/>
                <ellipse cx="152" cy="88" rx="7" ry="13" fill="#c4956a"/>
                <!-- Too perfect hair -->
                <path d="M 50 70 Q 55 30 100 25 Q 145 30 150 70" fill="#3a2518" stroke="none"/>
                <!-- Flawless skin - no texture -->
                <!-- Subtle artifact: weird ear-hair transition -->
                <rect x="147" y="75" width="4" height="3" fill="#3a2518" opacity="0.3"/>
                <text x="100" y="185" text-anchor="middle" fill="rgba(0,229,255,0.3)" font-size="11" font-family="Orbitron">FOTO B</text>
            </svg>`;
        }
    }

    function createTextSVG(type) {
        if (type === 'real') {
            return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#f5f0e8" rx="12"/>
                <line x1="20" y1="40" x2="180" y2="40" stroke="#ddd" stroke-width="0.5"/>
                <line x1="20" y1="65" x2="180" y2="65" stroke="#ddd" stroke-width="0.5"/>
                <line x1="20" y1="90" x2="180" y2="90" stroke="#ddd" stroke-width="0.5"/>
                <line x1="20" y1="115" x2="180" y2="115" stroke="#ddd" stroke-width="0.5"/>
                <!-- Consistent but natural handwriting (real) -->
                <text x="25" y="58" font-family="cursive" font-size="16" fill="#2c3e50" transform="rotate(-1 25 58)">Liebe Grüße aus</text>
                <text x="25" y="83" font-family="cursive" font-size="16" fill="#2c3e50" transform="rotate(0.5 25 83)">Vorchdorf! Das</text>
                <text x="25" y="108" font-family="cursive" font-size="16" fill="#2c3e50" transform="rotate(-0.3 25 108)">Museum ist toll.</text>
                <text x="100" y="185" text-anchor="middle" fill="rgba(0,100,150,0.4)" font-size="11" font-family="Orbitron">TEXT A</text>
            </svg>`;
        } else {
            return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#f5f0e8" rx="12"/>
                <line x1="20" y1="40" x2="180" y2="40" stroke="#ddd" stroke-width="0.5"/>
                <line x1="20" y1="65" x2="180" y2="65" stroke="#ddd" stroke-width="0.5"/>
                <line x1="20" y1="90" x2="180" y2="90" stroke="#ddd" stroke-width="0.5"/>
                <line x1="20" y1="115" x2="180" y2="115" stroke="#ddd" stroke-width="0.5"/>
                <!-- Too-perfect handwriting with inconsistencies (fake) -->
                <text x="25" y="58" font-family="cursive" font-size="16" fill="#2c3e50">Liebe Grüsse aus</text>
                <text x="25" y="83" font-family="cursive" font-size="16" fill="#2c3e50">Vorchdorf! Das</text>
                <text x="25" y="108" font-family="cursive" font-size="15.5" fill="#2c3e50">Museum ist toll.</text>
                <!-- KI artifact: inconsistent baseline -->
                <text x="100" y="185" text-anchor="middle" fill="rgba(0,100,150,0.4)" font-size="11" font-family="Orbitron">TEXT B</text>
            </svg>`;
        }
    }

    function createLandscapeSVG(type) {
        if (type === 'real') {
            return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#87CEEB" rx="12"/>
                <!-- Sky gradient -->
                <defs><linearGradient id="sky-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a90d9"/><stop offset="100%" stop-color="#87CEEB"/></linearGradient></defs>
                <rect width="200" height="120" fill="url(#sky-r)" rx="12"/>
                <!-- Mountains with natural variation -->
                <polygon points="0,120 30,70 55,85 80,50 110,90 140,60 170,80 200,65 200,120" fill="#5a7a5a"/>
                <polygon points="0,120 20,90 50,75 70,95 100,65 130,85 160,70 200,80 200,120" fill="#4a6a4a"/>
                <!-- Ground -->
                <rect y="115" width="200" height="85" fill="#3a5a3a" rx="0"/>
                <!-- Trees with individual character -->
                <rect x="30" y="100" width="4" height="20" fill="#4a3520"/>
                <polygon points="22,105 32,80 42,105" fill="#2d5a2d"/>
                <rect x="80" y="95" width="5" height="25" fill="#4a3520"/>
                <polygon points="70,100 82,70 95,100" fill="#3a6a3a"/>
                <polygon points="72,90 82,65 92,90" fill="#2d5a2d"/>
                <rect x="150" y="102" width="3" height="18" fill="#4a3520"/>
                <polygon points="143,107 151,85 160,107" fill="#2d5a2d"/>
                <!-- Water reflection -->
                <ellipse cx="120" cy="155" rx="35" ry="12" fill="#6ab0d9" opacity="0.6"/>
                <text x="100" y="192" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="11" font-family="Orbitron">BILD A</text>
            </svg>`;
        } else {
            return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#87CEEB" rx="12"/>
                <defs><linearGradient id="sky-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a90d9"/><stop offset="100%" stop-color="#87CEEB"/></linearGradient></defs>
                <rect width="200" height="120" fill="url(#sky-f)" rx="12"/>
                <!-- Mountains too smooth/repetitive (fake) -->
                <polygon points="0,120 40,70 80,120 120,70 160,120 200,70 200,120" fill="#5a7a5a"/>
                <polygon points="0,120 50,80 100,120 150,80 200,120" fill="#4a6a4a"/>
                <!-- Ground -->
                <rect y="115" width="200" height="85" fill="#3a5a3a"/>
                <!-- Trees too uniform (fake giveaway) -->
                <rect x="30" y="100" width="4" height="20" fill="#4a3520"/>
                <polygon points="22,105 32,80 42,105" fill="#2d5a2d"/>
                <rect x="70" y="100" width="4" height="20" fill="#4a3520"/>
                <polygon points="62,105 72,80 82,105" fill="#2d5a2d"/>
                <rect x="110" y="100" width="4" height="20" fill="#4a3520"/>
                <polygon points="102,105 112,80 122,105" fill="#2d5a2d"/>
                <rect x="150" y="100" width="4" height="20" fill="#4a3520"/>
                <polygon points="142,105 152,80 162,105" fill="#2d5a2d"/>
                <!-- Water with weird artifact -->
                <ellipse cx="100" cy="155" rx="45" ry="15" fill="#6ab0d9" opacity="0.6"/>
                <!-- Artifact: floating element -->
                <rect x="95" y="148" width="8" height="3" fill="#5a9a5a" opacity="0.4"/>
                <text x="100" y="192" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="11" font-family="Orbitron">BILD B</text>
            </svg>`;
        }
    }

    function createDocSVG(type) {
        if (type === 'real') {
            return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#f0e6d0" rx="12"/>
                <!-- Aged paper texture -->
                <rect x="10" y="10" width="180" height="180" fill="#e8dcc8" rx="4" stroke="#c0b090" stroke-width="1"/>
                <!-- Seal -->
                <circle cx="150" cy="160" r="18" fill="#8b0000" opacity="0.7"/>
                <circle cx="150" cy="160" r="12" fill="none" stroke="#c0a050" stroke-width="1"/>
                <!-- Old text lines with natural spacing -->
                <rect x="25" y="25" width="100" height="3" fill="#4a3a2a" opacity="0.6" rx="1"/>
                <rect x="25" y="38" width="140" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="48" width="135" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="58" width="138" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="68" width="120" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="82" width="142" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="92" width="130" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="102" width="90" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <!-- Age stains -->
                <circle cx="45" cy="140" r="15" fill="#c0a870" opacity="0.2"/>
                <circle cx="160" cy="40" r="10" fill="#b09060" opacity="0.15"/>
                <text x="100" y="195" text-anchor="middle" fill="rgba(100,80,50,0.4)" font-size="10" font-family="Orbitron">DOK A</text>
            </svg>`;
        } else {
            return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#f0e6d0" rx="12"/>
                <rect x="10" y="10" width="180" height="180" fill="#e8dcc8" rx="4" stroke="#c0b090" stroke-width="1"/>
                <!-- Seal too perfect -->
                <circle cx="150" cy="160" r="18" fill="#8b0000" opacity="0.8"/>
                <circle cx="150" cy="160" r="14" fill="none" stroke="#d4af37" stroke-width="1.5"/>
                <circle cx="150" cy="160" r="8" fill="none" stroke="#d4af37" stroke-width="0.5"/>
                <!-- Text too uniform (fake) -->
                <rect x="25" y="25" width="100" height="3" fill="#4a3a2a" opacity="0.6" rx="1"/>
                <rect x="25" y="38" width="140" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="48" width="140" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="58" width="140" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="68" width="140" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="82" width="140" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="92" width="140" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <rect x="25" y="102" width="140" height="2" fill="#4a3a2a" opacity="0.4" rx="1"/>
                <!-- No natural age marks -->
                <text x="100" y="195" text-anchor="middle" fill="rgba(100,80,50,0.4)" font-size="10" font-family="Orbitron">DOK B</text>
            </svg>`;
        }
    }

    function createWaveformSVG(type) {
        const bars = 40;
        let svg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#0e2233" rx="12"/>
            <text x="100" y="30" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="10" font-family="Inter">Stimmwellenform</text>`;

        for (let i = 0; i < bars; i++) {
            const x = 15 + (i / bars) * 170;
            let h;
            if (type === 'real') {
                // Natural waveform with variation
                h = 10 + Math.abs(Math.sin(i * 0.5) * 50 + Math.sin(i * 1.3) * 20 + (Math.random() - 0.5) * 15);
            } else {
                // Too uniform waveform (fake)
                h = 10 + Math.abs(Math.sin(i * 0.4) * 45 + Math.sin(i * 0.8) * 15);
            }
            const color = type === 'real' ? '#00e5ff' : '#00c8e0';
            svg += `<rect x="${x}" y="${100 - h / 2}" width="3" height="${h}" fill="${color}" opacity="0.7" rx="1"/>`;
        }

        const label = type === 'real' ? 'AUDIO A' : 'AUDIO B';
        svg += `<text x="100" y="190" text-anchor="middle" fill="rgba(0,229,255,0.3)" font-size="11" font-family="Orbitron">${label}</text></svg>`;
        return svg;
    }

    let currentRound = 0;
    let score = 0;
    let answered = false;

    function init() {
        currentRound = 0;
        score = 0;
        showRound();

        document.getElementById('btn-left').addEventListener('click', function () { answer('left'); });
        document.getElementById('btn-right').addEventListener('click', function () { answer('right'); });
    }

    function showRound() {
        if (currentRound >= rounds.length) {
            showResults();
            return;
        }

        answered = false;
        const round = rounds[currentRound];

        document.getElementById('round-title').textContent = round.title;
        document.getElementById('round-counter').textContent = `Runde ${currentRound + 1} / ${rounds.length}`;
        document.getElementById('score-display').textContent = `Score: ${score}`;

        const leftBox = document.getElementById('img-left');
        const rightBox = document.getElementById('img-right');

        if (round.realSide === 'left') {
            leftBox.innerHTML = round.real;
            rightBox.innerHTML = round.fake;
        } else {
            leftBox.innerHTML = round.fake;
            rightBox.innerHTML = round.real;
        }

        // Reset styles
        leftBox.className = 'compare-box';
        rightBox.className = 'compare-box';
        document.getElementById('explanation').style.display = 'none';
        document.getElementById('btn-left').disabled = false;
        document.getElementById('btn-right').disabled = false;
    }

    function answer(side) {
        if (answered) return;
        answered = true;

        const round = rounds[currentRound];
        const correct = side === round.realSide;

        if (correct) score++;

        const leftBox = document.getElementById('img-left');
        const rightBox = document.getElementById('img-right');

        if (round.realSide === 'left') {
            leftBox.classList.add('real');
            rightBox.classList.add('fake');
        } else {
            leftBox.classList.add('fake');
            rightBox.classList.add('real');
        }

        document.getElementById('score-display').textContent = `Score: ${score}`;

        // Show explanation
        const expl = document.getElementById('explanation');
        expl.innerHTML = `<div class="${correct ? 'correct' : 'wrong'}">${correct ? 'Richtig!' : 'Falsch!'}</div><p>${round.explanation}</p>`;
        expl.style.display = 'block';

        document.getElementById('btn-left').disabled = true;
        document.getElementById('btn-right').disabled = true;

        setTimeout(function () {
            currentRound++;
            showRound();
        }, 4000);
    }

    function showResults() {
        document.getElementById('game-container').style.display = 'none';
        const result = document.getElementById('result-container');
        result.style.display = 'block';

        document.getElementById('final-score').textContent = `${score} / ${rounds.length}`;

        let msg;
        if (score === rounds.length) {
            msg = 'Perfekt! Du hast ein ausgezeichnetes Auge für Deepfakes. Aber Vorsicht: Die Technologie wird ständig besser.';
        } else if (score >= rounds.length * 0.6) {
            msg = 'Gut erkannt! Deepfakes zu entlarven wird immer schwieriger, da die KI-Technologie sich rasant weiterentwickelt.';
        } else {
            msg = 'Deepfakes sind schwer zu erkennen – und das ist genau das Problem. Die Technologie wird immer überzeugender.';
        }
        document.getElementById('result-msg').textContent = msg;

        document.getElementById('btn-retry').addEventListener('click', function () {
            document.getElementById('game-container').style.display = 'block';
            result.style.display = 'none';
            currentRound = 0;
            score = 0;
            showRound();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
