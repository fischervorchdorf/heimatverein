/**
 * network.js – Interactive neural network navigation map
 * Canvas-based visualization for the experience hub
 */

(function () {
    'use strict';

    const modules = [
        { id: 'was-ist-ki', label: 'Was ist KI?', icon: '🧠', desc: 'Grundlagen der künstlichen Intelligenz', href: 'was-ist-ki.html', x: 0.5, y: 0.18 },
        { id: 'ki-in-filmen', label: 'KI in Filmen', icon: '🎬', desc: 'Von HAL 9000 bis Ex Machina', href: 'ki-in-filmen.html', x: 0.22, y: 0.35 },
        { id: 'train-ai', label: 'KI trainieren', icon: '🎯', desc: 'Trainiere deine eigene KI', href: 'train-ai.html', x: 0.78, y: 0.35 },
        { id: 'turing', label: 'Turing Test', icon: '✍️', desc: 'Mensch oder Maschine?', href: 'deepfake.html', x: 0.22, y: 0.58 },
        { id: 'energy', label: 'Energieverbrauch', icon: '⚡', desc: 'Was KI an Strom verbraucht', href: 'energy.html', x: 0.78, y: 0.58 },
        { id: 'world', label: 'KI weltweit', icon: '🌍', desc: 'Regulierung rund um den Globus', href: 'world.html', x: 0.35, y: 0.78 },
        { id: 'zukunft', label: 'Zukunft der KI', icon: '🚀', desc: 'Was kommt als Nächstes?', href: 'zukunft.html', x: 0.65, y: 0.78 }
    ];

    // Connections between modules (indices)
    const edges = [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 3], [2, 4], [3, 5], [4, 5],
        [5, 6], [4, 6], [2, 6], [1, 5]
    ];

    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let animTime = 0;
    let hoveredModule = null;
    let pulses = [];

    function resize() {
        const container = canvas.parentElement;
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Update module positions
        for (const mod of modules) {
            mod.px = mod.x * width;
            mod.py = mod.y * height;
        }
    }

    function initPulses() {
        for (let i = 0; i < 6; i++) {
            const edge = edges[Math.floor(Math.random() * edges.length)];
            pulses.push({
                edge: edge,
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.004
            });
        }
    }

    function drawConnections() {
        for (const [i, j] of edges) {
            const a = modules[i];
            const b = modules[j];

            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
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

            ctx.beginPath();
            ctx.arc(x, y, 3 + glow * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 229, 255, ${0.3 + glow * 0.7})`;
            ctx.fill();

            // Trail
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8 + glow * 6);
            gradient.addColorStop(0, `rgba(0, 229, 255, ${0.2 + glow * 0.3})`);
            gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
            ctx.beginPath();
            ctx.arc(x, y, 8 + glow * 6, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    function drawNodes() {
        const nodeRadius = width < 500 ? 32 : 42;

        for (let i = 0; i < modules.length; i++) {
            const mod = modules[i];
            const isHovered = hoveredModule === i;
            const isActive = mod.href !== null;
            const pulse = Math.sin(animTime * 2 + i) * 0.15 + 0.85;

            // Outer glow
            const glowRadius = nodeRadius + (isHovered ? 20 : 10);
            const gradient = ctx.createRadialGradient(mod.px, mod.py, nodeRadius * 0.5, mod.px, mod.py, glowRadius);
            gradient.addColorStop(0, isActive
                ? `rgba(0, 229, 255, ${0.15 * pulse})`
                : `rgba(100, 100, 120, ${0.1 * pulse})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.beginPath();
            ctx.arc(mod.px, mod.py, glowRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Node circle
            ctx.beginPath();
            ctx.arc(mod.px, mod.py, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = isHovered
                ? 'rgba(0, 229, 255, 0.2)'
                : (isActive ? 'rgba(14, 34, 51, 0.9)' : 'rgba(14, 34, 51, 0.5)');
            ctx.fill();

            ctx.strokeStyle = isActive
                ? `rgba(0, 229, 255, ${0.5 * pulse + (isHovered ? 0.5 : 0)})`
                : 'rgba(100, 100, 120, 0.3)';
            ctx.lineWidth = isHovered ? 2.5 : 1.5;
            ctx.stroke();

            // Icon
            ctx.font = `${width < 500 ? '18px' : '22px'} sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(mod.icon, mod.px, mod.py - 2);

            // Label
            ctx.font = `${isHovered ? '600' : '500'} ${width < 500 ? '10px' : '12px'} Inter, sans-serif`;
            ctx.fillStyle = isActive ? '#ffffff' : 'rgba(255,255,255,0.4)';
            ctx.fillText(mod.label, mod.px, mod.py + nodeRadius + 14);

            // "Coming soon" for inactive
            if (!isActive) {
                ctx.font = `300 ${width < 500 ? '8px' : '9px'} Inter, sans-serif`;
                ctx.fillStyle = 'rgba(255,255,255,0.25)';
                ctx.fillText('Bald verfügbar', mod.px, mod.py + nodeRadius + 28);
            }
        }
    }

    function getModuleAtPoint(x, y) {
        const radius = width < 500 ? 38 : 48;
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
