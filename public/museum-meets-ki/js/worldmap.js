/**
 * worldmap.js – Interactive AI Regulation World Map
 * SVG-based map with EU, USA, China regions
 */

(function () {
    'use strict';

    const regions = {
        eu: {
            name: 'Europäische Union',
            flag: '🇪🇺',
            approach: 'Regulierung & Bürgerrechte',
            color: '#00e5ff',
            laws: [
                { title: 'AI Act (2024)', desc: 'Weltweit erstes umfassendes KI-Gesetz. Klassifiziert KI-Systeme nach Risikostufen und verbietet bestimmte Anwendungen wie Social Scoring.' },
                { title: 'DSGVO', desc: 'Die Datenschutz-Grundverordnung schützt persönliche Daten und beeinflusst, wie KI trainiert werden darf.' },
                { title: 'Transparenzpflicht', desc: 'KI-generierte Inhalte müssen als solche gekennzeichnet werden. Nutzer haben ein Recht zu erfahren, wenn sie mit KI interagieren.' }
            ],
            summary: 'Die EU setzt auf strenge Regulierung mit Fokus auf Menschenrechte und Transparenz. Der AI Act gilt als Vorbild für globale KI-Gesetzgebung.'
        },
        usa: {
            name: 'Vereinigte Staaten',
            flag: '🇺🇸',
            approach: 'Innovation & Markt',
            color: '#d4af37',
            laws: [
                { title: 'Executive Order on AI (2023)', desc: 'Setzt Standards für KI-Sicherheit, aber ohne bindende Gesetzgebung für Unternehmen.' },
                { title: 'Sektorale Regulierung', desc: 'Einzelne Branchen regulieren KI separat: Gesundheit (FDA), Finanzen (SEC), Transport (NHTSA).' },
                { title: 'Bundesstaaten-Gesetze', desc: 'Staaten wie Kalifornien und Colorado erlassen eigene KI-Gesetze, z.B. zu Deepfakes und Diskriminierung.' }
            ],
            summary: 'Die USA setzen auf Innovation und Wettbewerbsfähigkeit. Regulierung erfolgt eher sektoral und marktgetrieben, nicht durch ein umfassendes Gesetz.'
        },
        china: {
            name: 'Volksrepublik China',
            flag: '🇨🇳',
            approach: 'Staatliche Kontrolle & Ambition',
            color: '#ff6b6b',
            laws: [
                { title: 'Generative KI-Verordnung (2023)', desc: 'Regelt KI-generierte Inhalte: Sie müssen mit sozialistischen Werten vereinbar sein und dürfen keine Falschinformationen verbreiten.' },
                { title: 'Deep Synthesis Regeln', desc: 'Strenge Regeln für Deepfakes und synthetische Medien. Alle KI-generierten Inhalte müssen gekennzeichnet werden.' },
                { title: 'Algorithmen-Empfehlungsregeln', desc: 'Regulierung von Empfehlungsalgorithmen, die das Nutzerverhalten beeinflussen. Nutzer müssen Algorithmen deaktivieren können.' }
            ],
            summary: 'China kombiniert ambitionierte KI-Entwicklung mit starker staatlicher Kontrolle. Regulierung dient sowohl dem Verbraucherschutz als auch der politischen Steuerung.'
        }
    };

    let activeRegion = null;

    function init() {
        // Set up region click handlers
        document.querySelectorAll('.map-region').forEach(function (el) {
            el.addEventListener('click', function () {
                const regionId = this.dataset.region;
                showRegion(regionId);
            });
        });

        // Close panel
        document.getElementById('close-panel').addEventListener('click', function () {
            hidePanel();
        });

        // Handle region buttons (for mobile)
        document.querySelectorAll('.region-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                showRegion(this.dataset.region);
            });
        });
    }

    function showRegion(regionId) {
        const region = regions[regionId];
        if (!region) return;

        activeRegion = regionId;

        // Update map highlights
        document.querySelectorAll('.map-region').forEach(function (el) {
            el.classList.toggle('active', el.dataset.region === regionId);
        });

        document.querySelectorAll('.region-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.region === regionId);
        });

        // Populate info panel
        document.getElementById('panel-flag').textContent = region.flag;
        document.getElementById('panel-name').textContent = region.name;
        document.getElementById('panel-approach').textContent = region.approach;
        document.getElementById('panel-approach').style.color = region.color;

        const lawsList = document.getElementById('panel-laws');
        lawsList.innerHTML = '';
        region.laws.forEach(function (law) {
            const li = document.createElement('div');
            li.className = 'law-item';
            li.innerHTML = `<h4>${law.title}</h4><p>${law.desc}</p>`;
            lawsList.appendChild(li);
        });

        document.getElementById('panel-summary').textContent = region.summary;

        // Show panel
        const panel = document.getElementById('info-panel');
        panel.classList.add('visible');
    }

    function hidePanel() {
        activeRegion = null;
        document.getElementById('info-panel').classList.remove('visible');
        document.querySelectorAll('.map-region').forEach(function (el) {
            el.classList.remove('active');
        });
        document.querySelectorAll('.region-btn').forEach(function (btn) {
            btn.classList.remove('active');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
