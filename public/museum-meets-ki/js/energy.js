/**
 * energy.js – AI Energy Consumption Visualization
 * Interactive slider showing AI's environmental impact
 */

(function () {
    'use strict';

    // Energy data (approximate values for illustration)
    // One ChatGPT query ≈ 0.001-0.01 kWh
    // Average lightbulb (10W LED) for 1 hour ≈ 0.01 kWh
    // Average Austrian household daily ≈ 10 kWh
    const KWH_PER_QUERY = 0.005;
    const KWH_PER_BULB_HOUR = 0.01;
    const KWH_PER_HOUSEHOLD_DAY = 10;
    const KWH_PER_CITY_BLOCK_DAY = 500;

    const slider = document.getElementById('query-slider');
    const queryCount = document.getElementById('query-count');
    const kwhDisplay = document.getElementById('kwh-value');
    const bulbCount = document.getElementById('bulb-count');
    const bulbGrid = document.getElementById('bulb-grid');
    const homeCount = document.getElementById('home-count');
    const homeBar = document.getElementById('home-bar');
    const cityCount = document.getElementById('city-count');
    const cityBar = document.getElementById('city-bar');
    const factText = document.getElementById('fact-text');

    if (!slider) return;

    const facts = [
        'Ein einzelner KI-Prompt verbraucht etwa 10x so viel Energie wie eine Google-Suche.',
        'Das Training von GPT-4 verbrauchte geschätzt so viel Strom wie 120 österreichische Haushalte in einem Jahr.',
        'Rechenzentren verbrauchen weltweit etwa 1-2% des gesamten Stroms.',
        'Bis 2030 könnten KI-Rechenzentren 3-4% des globalen Stromverbrauchs ausmachen.',
        'Ein einziges KI-Trainingsprojekt kann so viel CO₂ erzeugen wie 5 Autos in ihrem gesamten Lebenszyklus.',
        'KI-Chips wie GPUs verbrauchen bis zu 700 Watt – ein Kühlschrank nur 100-200 Watt.'
    ];

    let currentFact = 0;

    function update() {
        const queries = parseInt(slider.value);
        const totalKwh = queries * KWH_PER_QUERY;

        queryCount.textContent = queries.toLocaleString('de-DE');
        kwhDisplay.textContent = totalKwh.toFixed(1);

        // Lightbulbs
        const bulbs = Math.round(totalKwh / KWH_PER_BULB_HOUR);
        bulbCount.textContent = bulbs.toLocaleString('de-DE');
        renderBulbs(Math.min(bulbs, 100));

        // Households
        const homes = (totalKwh / KWH_PER_HOUSEHOLD_DAY).toFixed(1);
        homeCount.textContent = homes;
        const homePercent = Math.min((totalKwh / KWH_PER_HOUSEHOLD_DAY) * 100, 100);
        homeBar.style.width = homePercent + '%';

        // City blocks
        const city = (totalKwh / KWH_PER_CITY_BLOCK_DAY).toFixed(2);
        cityCount.textContent = city;
        const cityPercent = Math.min((totalKwh / KWH_PER_CITY_BLOCK_DAY) * 100, 100);
        cityBar.style.width = cityPercent + '%';

        // Update scale label
        updateScale(queries);
    }

    function renderBulbs(count) {
        bulbGrid.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const bulb = document.createElement('span');
            bulb.className = 'bulb on';
            bulb.textContent = '💡';
            bulb.style.animationDelay = (i * 0.02) + 's';
            bulbGrid.appendChild(bulb);
        }
        // Add dim bulbs to fill
        for (let i = count; i < 20; i++) {
            const bulb = document.createElement('span');
            bulb.className = 'bulb';
            bulb.textContent = '💡';
            bulbGrid.appendChild(bulb);
        }
    }

    function updateScale(queries) {
        const scaleEl = document.getElementById('scale-label');
        if (queries <= 10) {
            scaleEl.textContent = 'Ein paar Fragen an die KI';
        } else if (queries <= 100) {
            scaleEl.textContent = 'Normaler Tagesverbrauch eines KI-Nutzers';
        } else if (queries <= 1000) {
            scaleEl.textContent = 'Power-User-Level';
        } else {
            scaleEl.textContent = 'Kleines Unternehmen';
        }
    }

    // Cycle through facts
    function showFact() {
        factText.style.opacity = '0';
        setTimeout(function () {
            factText.textContent = facts[currentFact];
            factText.style.opacity = '1';
            currentFact = (currentFact + 1) % facts.length;
        }, 300);
    }

    slider.addEventListener('input', update);

    // Initialize
    update();
    showFact();
    setInterval(showFact, 6000);
})();
