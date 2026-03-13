/**
 * brain.js – 3D Neural Network Brain Visualization
 * Uses Three.js to render a rotating brain-like neural network
 */

(function () {
    'use strict';

    const isMobile = window.innerWidth < 768;
    const NODE_COUNT = isMobile ? 150 : 300;
    const CONNECTION_DISTANCE = 2.2;
    const PULSE_COUNT = isMobile ? 8 : 20;
    const ROTATION_SPEED = 0.0004;

    let scene, camera, renderer;
    let nodesMesh, linesMesh;
    let pulses = [];
    let connections = [];
    let animationId;
    let mouseX = 0, mouseY = 0;

    function init() {
        const canvas = document.getElementById('brain-canvas');
        if (!canvas) return;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = isMobile ? 10 : 7;

        renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        createNodes();
        createConnections();
        createPulses();

        window.addEventListener('resize', onResize);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchmove', onTouchMove, { passive: true });

        animate();
    }

    function brainShape(i, total) {
        // Create brain-like ellipsoid shape with organic displacement
        const phi = Math.acos(1 - 2 * (i + 0.5) / total);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        // Ellipsoid base shape (wider than tall, slightly flattened)
        let x = 3.0 * Math.sin(phi) * Math.cos(theta);
        let y = 2.2 * Math.cos(phi);
        let z = 2.5 * Math.sin(phi) * Math.sin(theta);

        // Add organic displacement
        const noise = Math.sin(x * 2) * Math.cos(y * 3) * Math.sin(z * 1.5);
        x += noise * 0.4;
        y += noise * 0.3;
        z += noise * 0.35;

        // Add random jitter for organic feel
        x += (Math.random() - 0.5) * 0.5;
        y += (Math.random() - 0.5) * 0.4;
        z += (Math.random() - 0.5) * 0.45;

        return { x, y, z };
    }

    function createNodes() {
        const positions = new Float32Array(NODE_COUNT * 3);
        const sizes = new Float32Array(NODE_COUNT);
        const colors = new Float32Array(NODE_COUNT * 3);

        for (let i = 0; i < NODE_COUNT; i++) {
            const pos = brainShape(i, NODE_COUNT);
            positions[i * 3] = pos.x;
            positions[i * 3 + 1] = pos.y;
            positions[i * 3 + 2] = pos.z;

            sizes[i] = isMobile ? (2 + Math.random() * 2) : (3 + Math.random() * 4);

            // Cyan to blue color variation
            const hue = 0.5 + Math.random() * 0.1;
            const color = new THREE.Color().setHSL(hue, 0.9, 0.6 + Math.random() * 0.2);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vAlpha;
                uniform float time;
                void main() {
                    vColor = color;
                    float pulse = sin(time * 2.0 + position.x * 3.0) * 0.3 + 0.7;
                    vAlpha = pulse;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (60.0 / -mvPosition.z) * pulse;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;
                void main() {
                    float d = length(gl_PointCoord - vec2(0.5));
                    if (d > 0.5) discard;
                    float glow = 1.0 - smoothstep(0.0, 0.5, d);
                    gl_FragColor = vec4(vColor, glow * vAlpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        nodesMesh = new THREE.Points(geometry, material);
        scene.add(nodesMesh);
    }

    function createConnections() {
        const positions = nodesMesh.geometry.attributes.position.array;
        const linePositions = [];
        const lineColors = [];

        for (let i = 0; i < NODE_COUNT; i++) {
            const x1 = positions[i * 3];
            const y1 = positions[i * 3 + 1];
            const z1 = positions[i * 3 + 2];

            for (let j = i + 1; j < NODE_COUNT; j++) {
                const x2 = positions[j * 3];
                const y2 = positions[j * 3 + 1];
                const z2 = positions[j * 3 + 2];

                const dx = x2 - x1;
                const dy = y2 - y1;
                const dz = z2 - z1;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < CONNECTION_DISTANCE) {
                    linePositions.push(x1, y1, z1, x2, y2, z2);
                    const alpha = 1 - dist / CONNECTION_DISTANCE;
                    lineColors.push(0, 0.7 * alpha, 1 * alpha, 0, 0.7 * alpha, 1 * alpha);
                    connections.push({ from: i, to: j, dist });
                }
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        linesMesh = new THREE.LineSegments(geometry, material);
        scene.add(linesMesh);
    }

    function createPulses() {
        if (connections.length === 0) return;

        const pulseGeom = new THREE.SphereGeometry(0.04, 6, 6);
        const pulseMat = new THREE.MeshBasicMaterial({
            color: 0x00e5ff,
            transparent: true,
            opacity: 0.9
        });

        for (let i = 0; i < PULSE_COUNT; i++) {
            const mesh = new THREE.Mesh(pulseGeom, pulseMat.clone());
            const conn = connections[Math.floor(Math.random() * connections.length)];
            pulses.push({
                mesh,
                connection: conn,
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.005,
                forward: Math.random() > 0.5
            });
            scene.add(mesh);
        }
    }

    function updatePulses() {
        const nodePos = nodesMesh.geometry.attributes.position.array;

        for (const pulse of pulses) {
            pulse.progress += pulse.speed;
            if (pulse.progress >= 1) {
                pulse.progress = 0;
                pulse.connection = connections[Math.floor(Math.random() * connections.length)];
                pulse.forward = Math.random() > 0.5;
            }

            const from = pulse.forward ? pulse.connection.from : pulse.connection.to;
            const to = pulse.forward ? pulse.connection.to : pulse.connection.from;
            const t = pulse.progress;

            pulse.mesh.position.set(
                nodePos[from * 3] + (nodePos[to * 3] - nodePos[from * 3]) * t,
                nodePos[from * 3 + 1] + (nodePos[to * 3 + 1] - nodePos[from * 3 + 1]) * t,
                nodePos[from * 3 + 2] + (nodePos[to * 3 + 2] - nodePos[from * 3 + 2]) * t
            );

            // Glow brightest at midpoint
            const brightness = Math.sin(t * Math.PI);
            pulse.mesh.material.opacity = 0.4 + brightness * 0.6;
            pulse.mesh.scale.setScalar(0.8 + brightness * 0.5);
        }
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    function onTouchMove(e) {
        if (e.touches.length > 0) {
            mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
        }
    }

    let time = 0;

    function animate() {
        animationId = requestAnimationFrame(animate);
        time += 0.016;

        // Slow rotation
        if (nodesMesh) {
            nodesMesh.rotation.y += ROTATION_SPEED;
            linesMesh.rotation.y = nodesMesh.rotation.y;

            // Subtle mouse/touch influence
            const targetRotX = mouseY * 0.15;
            const targetRotZ = mouseX * 0.05;
            nodesMesh.rotation.x += (targetRotX - nodesMesh.rotation.x) * 0.02;
            nodesMesh.rotation.z += (targetRotZ - nodesMesh.rotation.z) * 0.02;
            linesMesh.rotation.x = nodesMesh.rotation.x;
            linesMesh.rotation.z = nodesMesh.rotation.z;

            // Update node shader time
            nodesMesh.material.uniforms.time.value = time;
        }

        // Subtle camera bob
        camera.position.y = Math.sin(time * 0.5) * 0.15;
        camera.position.x = Math.cos(time * 0.3) * 0.1;
        camera.lookAt(0, 0, 0);

        updatePulses();
        renderer.render(scene, camera);
    }

    // Handle visibility change to pause animation
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
