/**
 * deepfake.js – "Mensch oder Maschine?" Turing Test Mini-Game
 * User reads texts and guesses: written by a human or by AI?
 */

(function () {
    'use strict';

    const rounds = [
        {
            genre: 'Gedicht',
            title: 'Gedicht über das Almtal',
            text: 'Der Nebel hängt noch tief im Tal,\ndie Alm rauscht leise, kühl und schmal.\nEin Reiher steht am Ufersaum,\ner wartet still – fast wie im Traum.\n\nDie Berge tragen Wolkenhaar,\nder Herbst macht alles sonderbar.\nUnd wer hier geht, der spürt es bald:\nDie Zeit vergeht im Almtal halt.',
            attribution: 'Quelle unbekannt, 2024',
            author: 'machine',
            explanation: 'Dieser Text wurde von einer KI verfasst. Typisch: Die Reime sind sauber und regelmäßig, die Bilder hübsch aber austauschbar. Es fehlt eine überraschende, persönliche Wendung – alles klingt wie aus einem Poesiealbum. KI-Gedichte sind oft „zu rund" und zu gefällig.'
        },
        {
            genre: 'Tagebuch',
            title: 'Tagebucheintrag eines Kindes',
            text: 'Heute war der langweiligste Tag überhaupt. In der Schule hat die Frau Lehrerin wieder ewig über Sachkunde geredet und ich hab unter dem Tisch ein Männchen gezeichnet das ausschaut wie der Haslinger. Nach der Schule bin ich zum Bach runter und hab Steine geworfen bis mir der Arm wehgetan hat. Mama hat geschimpft weil meine Hose nass war. Das Abendessen war Grießkoch, ich hasse Grießkoch.',
            attribution: 'Kindertagebuch, ca. 1987',
            author: 'human',
            explanation: 'Dieses Tagebuch wurde von einem Menschen geschrieben. Die chaotische Struktur, die ehrlichen Emotionen („ich hasse Grießkoch"), der konkrete Name „Haslinger" und die typisch kindliche Erzählweise sind schwer für eine KI nachzuahmen. Menschen schreiben assoziativer und ungefilterter.'
        },
        {
            genre: 'Sachtext',
            title: 'Beschreibung eines Museumsobjekts',
            text: 'Die vorliegende Zündholzschachtel aus den 1930er-Jahren ist ein bemerkenswertes Zeugnis der österreichischen Alltagskultur. Die Schachtel weist eine charakteristische Gestaltung auf, die sowohl funktionale als auch ästhetische Aspekte vereint. Besonders hervorzuheben ist die Verwendung regionaler Motive, die auf eine lokale Produktion hindeuten. Das Objekt befindet sich in einem erstaunlich guten Erhaltungszustand und bietet wertvolle Einblicke in die Konsumgeschichte der Zwischenkriegszeit.',
            attribution: 'Objektbeschreibung, 2025',
            author: 'machine',
            explanation: 'Dieser Sachtext wurde von einer KI generiert. Auffällig: Viele vage Formulierungen wie „bemerkenswertes Zeugnis", „charakteristische Gestaltung" und „wertvolle Einblicke" – das klingt kompetent, sagt aber wenig Konkretes. Eine echte Museumsbeschreibung würde den Hersteller, genaue Maße oder spezifische Motive benennen.'
        },
        {
            genre: 'Brief',
            title: 'Brief an die Gemeinde',
            text: 'Sehr geehrter Herr Bürgermeister,\n\nich schreibe Ihnen wegen der Straße zum Sportplatz. Seit dem Unwetter im Juni sind da drei Schlaglöcher so groß dass mein Schwager mit seinem Traktor fast hängen geblieben ist. Die Kinder vom Fußballverein fahren da jeden Dienstag und Freitag mit dem Rad hin. Wenns regnet steht das Wasser bis zur Mitte.\n\nKönnten Sie bitte schauen dass das bald repariert wird? Danke im Voraus.\n\nMit freundlichen Grüßen,\nFranz H.',
            attribution: 'Gemeindepost Vorchdorf, 2019',
            author: 'human',
            explanation: 'Dieser Brief wurde von einem Menschen geschrieben. Die konkreten Details (Schwager mit Traktor, Fußballverein am Dienstag und Freitag, Unwetter im Juni) und die direkte, leicht ungedulige Sprache sind typisch menschlich. Eine KI hätte wahrscheinlich formaler und allgemeiner formuliert.'
        },
        {
            genre: 'Rezept',
            title: 'Omas Apfelstrudel',
            text: 'Für einen gelungenen Apfelstrudel nach traditioneller Art benötigt man zunächst einen geschmeidigen Strudelteig. Dieser wird aus feinem Mehl, lauwarmem Wasser, einem Schuss Öl und einer Prise Salz hergestellt. Der Teig sollte so lange geknetet werden, bis er seidig glatt ist und sich hauchdünn ausziehen lässt. Die Füllung besteht aus säuerlichen Äpfeln, Rosinen, Zimt, Zucker und gerösteten Semmelbröseln. Nach dem Einrollen wird der Strudel mit zerlassener Butter bestrichen und im vorgeheizten Ofen goldbraun gebacken.',
            attribution: 'Rezeptsammlung, o.J.',
            author: 'machine',
            explanation: 'Dieses Rezept wurde von einer KI verfasst. Es klingt korrekt und kompetent, ist aber auffallend unpersönlich. Echte Familienrezepte haben Eigenheiten: „nimm die Äpfel vom Nachbarn", „nicht zu viel Zimt, der Papa mag das nicht", ungenaue Mengenangaben wie „ein bisserl". Hier fehlt jede persönliche Handschrift.'
        }
    ];

    let currentRound = 0;
    let score = 0;
    let answered = false;
    let roundResults = [];

    function init() {
        currentRound = 0;
        score = 0;
        answered = false;
        roundResults = [];
        buildProgressDots();
        showRound();

        document.getElementById('btn-human').addEventListener('click', function () { answer('human'); });
        document.getElementById('btn-machine').addEventListener('click', function () { answer('machine'); });
    }

    function buildProgressDots() {
        const container = document.getElementById('progress-dots');
        container.innerHTML = '';
        for (let i = 0; i < rounds.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot' + (i === 0 ? ' active' : '');
            dot.id = 'dot-' + i;
            container.appendChild(dot);
        }
    }

    function updateProgressDots() {
        for (let i = 0; i < rounds.length; i++) {
            const dot = document.getElementById('dot-' + i);
            dot.className = 'progress-dot';
            if (i < roundResults.length) {
                dot.classList.add(roundResults[i] ? 'correct-dot' : 'wrong-dot');
            } else if (i === currentRound) {
                dot.classList.add('active');
            }
        }
    }

    function showRound() {
        if (currentRound >= rounds.length) {
            showResults();
            return;
        }

        answered = false;
        const round = rounds[currentRound];

        document.getElementById('round-title').textContent = round.title;
        document.getElementById('round-counter').textContent = 'Runde ' + (currentRound + 1) + ' / ' + rounds.length;
        document.getElementById('score-display').textContent = 'Score: ' + score;
        document.getElementById('genre-tag').textContent = round.genre;
        document.getElementById('text-attribution').textContent = round.attribution;

        // Typewriter-style text reveal
        var contentEl = document.getElementById('text-content');
        var fullText = round.text;
        contentEl.innerHTML = '<span class="typing-cursor"></span>';

        var charIndex = 0;
        var textSpan = document.createElement('span');
        contentEl.insertBefore(textSpan, contentEl.firstChild);

        var typeInterval = setInterval(function () {
            if (charIndex < fullText.length) {
                var ch = fullText[charIndex];
                if (ch === '\n') {
                    textSpan.innerHTML += '<br>';
                } else {
                    textSpan.textContent += ch;
                }
                charIndex++;
            } else {
                clearInterval(typeInterval);
                var cursor = contentEl.querySelector('.typing-cursor');
                if (cursor) cursor.remove();
            }
        }, 18);

        // Reset UI
        document.getElementById('explanation').style.display = 'none';
        document.getElementById('btn-human').disabled = false;
        document.getElementById('btn-machine').disabled = false;
        updateProgressDots();
    }

    function answer(choice) {
        if (answered) return;
        answered = true;

        var round = rounds[currentRound];
        var correct = choice === round.author;

        if (correct) score++;
        roundResults.push(correct);

        document.getElementById('score-display').textContent = 'Score: ' + score;
        updateProgressDots();

        // Show explanation
        var expl = document.getElementById('explanation');
        var authorLabel = round.author === 'human' ? 'einem <strong>Menschen</strong> &#9998;' : 'einer <strong>Maschine (KI)</strong> &#9881;';

        expl.innerHTML =
            '<div class="result-label ' + (correct ? 'correct' : 'wrong') + '">' + (correct ? 'Richtig!' : 'Falsch!') + '</div>' +
            '<p class="answer-reveal">Dieser Text wurde von ' + authorLabel + ' verfasst.</p>' +
            '<p>' + round.explanation + '</p>';
        expl.style.display = 'block';

        document.getElementById('btn-human').disabled = true;
        document.getElementById('btn-machine').disabled = true;

        setTimeout(function () {
            currentRound++;
            showRound();
        }, 6000);
    }

    function showResults() {
        document.getElementById('game-container').style.display = 'none';
        var result = document.getElementById('result-container');
        result.style.display = 'block';

        document.getElementById('final-score').textContent = score + ' / ' + rounds.length;

        var icon = document.getElementById('result-icon');
        var msg;
        if (score === rounds.length) {
            icon.innerHTML = '&#129351;';
            msg = 'Perfekt! Du hast den Turing Test bestanden. Dein Sprachgefühl ist ausgezeichnet – du erkennst die feinen Unterschiede zwischen Mensch und Maschine.';
        } else if (score >= rounds.length * 0.6) {
            icon.innerHTML = '&#129300;';
            msg = 'Gut gemacht! Du hast ein gutes Gespür dafür, wann eine KI am Werk war. Aber einige Texte waren täuschend echt – und genau das macht die Technologie so faszinierend.';
        } else {
            icon.innerHTML = '&#129302;';
            msg = 'Nicht schlecht – aber die KI hat dich öfter getäuscht als gedacht. Das zeigt, wie weit die Technologie bereits ist. Sprachmodelle werden immer besser darin, menschlich zu klingen.';
        }
        document.getElementById('result-msg').textContent = msg;

        document.getElementById('btn-retry').addEventListener('click', function () {
            document.getElementById('game-container').style.display = 'block';
            result.style.display = 'none';
            currentRound = 0;
            score = 0;
            roundResults = [];
            buildProgressDots();
            showRound();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
