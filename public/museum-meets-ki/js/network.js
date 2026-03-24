/**
 * network.js – Interactive neural network navigation map
 * Canvas-based visualization for the experience hub
 *
 * Top section (cyan): KI theory modules
 * Bottom section (gold): Museum practice modules
 */

(function () {
    'use strict';

    // Museum practice modules are marked with group: 'museum'
    const modules = [
        // KI Theory (cyan) – top area
        { id: 'was-ist-ki', label: 'Was ist KI?', icon: '\u{1F9E0}', desc: 'Grundlagen der künstlichen Intelligenz', href: 'was-ist-ki.html', x: 0.5, y: 0.10, group: 'ki' },
        { id: 'ki-in-filmen', label: 'KI in Filmen', icon: '\u{1F3AC}', desc: 'Von HAL 9000 bis Ex Machina', href: 'ki-in-filmen.html', x: 0.18, y: 0.24, group: 'ki' },
        { id: 'train-ai', label: 'KI trainieren', icon: '\u{1F3AF}', desc: 'Trainiere deine eigene KI', href: 'train-ai.html', x: 0.82, y: 0.24, group: 'ki' },
        { id: 'turing', label: 'Turing Test', icon: '\u270D\uFE0F', desc: 'Mensch oder Maschine?', href: 'deepfake.html', x: 0.13, y: 0.42, group: 'ki' },
        { id: 'energy', label: 'Energieverbrauch', icon: '\u26A1', desc: 'Was KI an Strom verbraucht', href: 'energy.html', x: 0.87, y: 0.42, group: 'ki' },
        { id: 'world', label: 'KI weltweit', icon: '\u{1F30D}', desc: 'Regulierung rund um den Globus', href: 'world.html', x: 0.32, y: 0.55, group: 'ki' },
        { id: 'zukunft', label: 'Zukunft der KI', icon: '\u{1F680}', desc: 'Was kommt als Nächstes?', href: 'zukunft.html', x: 0.68, y: 0.55, group: 'ki' },

        // Museum Practice (gold) – bottom row
        { id: 'archiv', label: 'MuseumLens', icon: '\u{1F4C4}', desc: 'KI-Analysen unserer Exponate', href: 'archiv.html', x: 0.12, y: 0.82, group: 'museum' },
        { id: 'propaganda', label: 'Propaganda', icon: '\u{1F4F0}', desc: 'KI & Journalismus-Stile', href: '../propaganda.html', x: 0.32, y: 0.82, group: 'museum' },
        { id: 'zuendholz', label: 'Zündholz', icon: '\u{1F525}', desc: 'Propaganda früher & heute', href: '../zuendholz.html', x: 0.50, y: 0.82, group: 'museum' },
        { id: 'erwacht', label: 'Foto erwacht', icon: '\u{1F3AC}', desc: 'KI erweckt alte Fotos', href: 'erwacht.html', x: 0.68, y: 0.82, group: 'museum' },
        { id: 'wasbinych', label: 'Was bin ich?', icon: '\u{1F50D}', desc: 'QR-Code Ratespiele', href: '../museummeetski/index.html', x: 0.88, y: 0.82, group: 'museum' }
    ];

    // Connections between modules (indices)
    // KI internal connections
    const edges = [
        [0, 1], [0, 2],
        [1, 3], [2, 4],
        [1, 5], [2, 6],
        [3, 5], [4, 6],
        [5, 6],
        // Cross connections KI -> Museum
        [5, 7], [5, 8], [5, 9],
        [6, 10], [6, 11],
        // Museum internal connections
        [7, 8], [8, 9], [9, 10], [10, 11]
    ];

    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let animTime = 0;
    let hoveredModule = null;
    let pulses = [];

    // Color schemes
    const colors = {
        ki: {
            glow: [0, 229, 255],
            stroke: [0, 229, 255],
            hoverBg: 'rgba(0, 229, 255, 0.2)',
            bg: 'rgba(14, 34, 51, 0.9)',
            label: '#ffffff',
            edge: 'rgba(0, 229, 255, 0.15)',
            pulse: [0, 229, 255]
        },
        museum: {
            glow: [212, 175, 55],
            stroke: [212, 175, 55],
            hoverBg: 'rgba(212, 175, 55, 0.2)',
            bg: 'rgba(51, 40, 14, 0.9)',
            label: '#ffffff',
            edge: 'rgba(212, 175, 55, 0.15)',
            pulse: [212, 175, 55]
        }
    };

    function resize() {
        const container = canvas.parentElement;
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        for (const mod of modules) {
            mod.px = mod.x * width;
            mod.py = mod.y * height;
        }
    }

    function initPulses() {
        for (let i = 0; i < 8; i++) {
            const edge = edges[Math.floor(Math.random() * edges.length)];
            pulses.push({
                edge: edge,
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.004
            });
        }
    }

    function getEdgeColor(i, j) {
        const a = modules[i];
        const b = modules[j];
        if (a.group === 'museum' && b.group === 'museum') return colors.museum.edge;
        if (a.group === 'ki' && b.group === 'ki') return colors.ki.edge;
        // Cross-connection: blend
        return 'rgba(106, 202, 155, 0.12)';
    }

    function drawConnections() {
        for (const [i, j] of edges) {
            const a = modules[i];
            const b = modules[j];

            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.strokeStyle = getEdgeColor(i, j);
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Divider line between sections
        const dividerY = height * 0.67;
        ctx.beginPath();
        ctx.setLineDash([4, 8]);
        ctx.moveTo(width * 0.05, dividerY);
        ctx.lineTo(width * 0.95, dividerY);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Section labels
        ctx.font = '600 9px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
        ctx.fillText('KI VERSTEHEN', width * 0.05, height * 0.04);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.fillText('MUSEUM ERLEBEN', width * 0.05, dividerY + 14);
    }

    function drawPulses() {
        for (const pulse of pulses) {
            pulse.progress += pulse.speed;
            if (pulse.progress >= 1) {
                pulse.progress = 0;
                pulse.edge = edges[Math.floor(Math.random() * edges.length)];
            }

            const a = modules[pulse.edge[0]];
            const b = modules[pulse.edge[1]];
            const x = a.px + (b.px - a.px) * pulse.progress;
            const y = a.py + (b.py - a.py) * pulse.progress;

            const glow = Math.sin(pulse.progress * Math.PI);

            // Determine color from edge
            const edgeGroup = (a.group === 'museum' || b.group === 'museum') ? 'museum' : 'ki';
            const c = colors[edgeGroup].pulse;

            ctx.beginPath();
            ctx.arc(x, y, 3 + glow * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.3 + glow * 0.7})`;
            ctx.fill();

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8 + glow * 6);
            gradient.addColorStop(0, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.2 + glow * 0.3})`);
            gradient.addColorStop(1, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0)`);
            ctx.beginPath();
            ctx.arc(x, y, 8 + glow * 6, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    function drawNodes() {
        const nodeRadius = width < 500 ? 28 : 38;

        for (let i = 0; i < modules.length; i++) {
            const mod = modules[i];
            const isHovered = hoveredModule === i;
            const isActive = mod.href !== null;
            const pulse = Math.sin(animTime * 2 + i) * 0.15 + 0.85;
            const c = colors[mod.group];
            const rgb = c.glow;

            // Outer glow
            const glowRadius = nodeRadius + (isHovered ? 20 : 10);
            const gradient = ctx.createRadialGradient(mod.px, mod.py, nodeRadius * 0.5, mod.px, mod.py, glowRadius);
            gradient.addColorStop(0, isActive
                ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.15 * pulse})`
                : `rgba(100, 100, 120, ${0.1 * pulse})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.beginPath();
            ctx.arc(mod.px, mod.py, glowRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Node circle
            ctx.beginPath();
            ctx.arc(mod.px, mod.py, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = isHovered ? c.hoverBg : (isActive ? c.bg : 'rgba(14, 34, 51, 0.5)');
            ctx.fill();

            ctx.strokeStyle = isActive
                ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${0.5 * pulse + (isHovered ? 0.5 : 0)})`
                : 'rgba(100, 100, 120, 0.3)';
            ctx.lineWidth = isHovered ? 2.5 : 1.5;
            ctx.stroke();

            // Icon
            ctx.font = `${width < 500 ? '16px' : '20px'} sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(mod.icon, mod.px, mod.py - 2);

            // Label
            ctx.font = `${isHovered ? '600' : '500'} ${width < 500 ? '9px' : '11px'} Inter, sans-serif`;
            ctx.fillStyle = isActive ? c.label : 'rgba(255,255,255,0.4)';
            ctx.fillText(mod.label, mod.px, mod.py + nodeRadius + 12);

            // "Coming soon" for inactive
            if (!isActive) {
                ctx.font = `300 ${width < 500 ? '8px' : '9px'} Inter, sans-serif`;
                ctx.fillStyle = 'rgba(255,255,255,0.25)';
                ctx.fillText('Bald verfügbar', mod.px, mod.py + nodeRadius + 26);
            }
        }
    }

    function getModuleAtPoint(x, y) {
        const radius = width < 500 ? 34 : 44;
        for (let i = 0; i < modules.length; i++) {
            const mod = modules[i];
            const dx = x - mod.px;
            const dy = y - mod.py;
            if (dx * dx + dy * dy < radius * radius) {
                return i;
            }
        }
        return null;
    }

    function handleInteraction(clientX, clientY, isClick) {
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const idx = getModuleAtPoint(x, y);
        hoveredModule = idx;
        canvas.style.cursor = (idx !== null && modules[idx].href) ? 'pointer' : 'default';

        if (isClick && idx !== null && modules[idx].href) {
            window.location.href = modules[idx].href;
        }
    }

    canvas.addEventListener('mousemove', function (e) {
        handleInteraction(e.clientX, e.clientY, false);
    });

    canvas.addEventListener('click', function (e) {
        handleInteraction(e.clientX, e.clientY, true);
    });

    canvas.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
            handleInteraction(e.touches[0].clientX, e.touches[0].clientY, true);
        }
    }, { passive: true });

    canvas.addEventListener('mouseleave', function () {
        hoveredModule = null;
        canvas.style.cursor = 'default';
    });

    function draw() {
        requestAnimationFrame(draw);
        animTime += 0.016;

        ctx.clearRect(0, 0, width, height);
        drawConnections();
        drawPulses();
        drawNodes();
    }

    resize();
    initPulses();
    draw();
    window.addEventListener('resize', function () {
        resize();
    });
})();
