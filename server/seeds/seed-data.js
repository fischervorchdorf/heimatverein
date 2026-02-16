const exhibitions = [
    {
        title: '800 Jahre Recht & Verfassung der Siebenbürger Sachsen',
        description: 'Ein einzigartiges mittelalterliches Dokument - das "Andreanum" von 1224 - gewährte den deutschen Siedlern in Siebenbürgen weitreichende Rechte und prägte ihr Leben über Jahrhunderte. Entdecken Sie, wie dieses Erbe bis heute nachwirkt!',
        date_start: '2025-11-12',
        date_end: null,
        date_display: 'Ab 12. November 2025',
        image_url: 'Bilder/Veranstaltung/Andreas_Getrude_Ungarn.jpg',
        image_alt: 'Andreas II. von Ungarn und Gertrud von Andechs-Meranien',
        location: 'Museum der Region Vorchdorf',
        curator: null,
        detail_items: JSON.stringify([
            { icon: '📍', text: 'Museum der Region Vorchdorf' },
            { icon: '🎉', text: 'Eröffnung: 12. Nov 2025, 19:00 Uhr' }
        ]),
        gallery_links: JSON.stringify([]),
        modal_content: `<img src="Bilder/Veranstaltung/Andreas_Getrude_Ungarn.jpg" alt="Andreas II. von Ungarn und seine Ehefrau Gertrud von Andechs-Meranien" class="modal-image">
<p style="text-align: center; font-style: italic; color: var(--light-gray); margin-top: -1rem; margin-bottom: 2rem;">Andreas II. von Ungarn und seine Ehefrau Gertrud von Andechs-Meranien (Landgrafenpsalter, 1211–1213)</p>

<h3>Das Andreanum: Der Goldene Freibrief der Siebenbürger Sachsen</h3>
<p>König Andreas II. von Ungarn verlieh 1224 eine bedeutende Urkunde für deutsche Siedler in Siebenbürgen. Das Dokument wird als "das für die Siebenbürger Sachsen wichtigste Privileg" charakterisiert, da es "das am besten ausgearbeitete und weitestgehende Siedlerrecht" darstellte.</p>

<h3>Historischer Hintergrund der Besiedlung</h3>
<p>Die Zuwanderung deutscher Siedler erfolgte im Kontext europäischer Landerschließung. Wirtschaftlich entwickelte Gebiete erlebten Bevölkerungswachstum, das jüngere Söhne zum Auswandern bewog. Bedrückte Bauern in Grundherrschaften suchten gleichfalls neue Möglichkeiten. Die Ansiedlung geschah "auf Wunsch und zum Nutzen beider Seiten, auf friedlichem Wege."</p>

<h3>Die Kernprivilegien des Andreanums</h3>
<ul>
    <li><strong>Politische Eigenständigkeit und Selbstverwaltung</strong> mit gewählten Richtern</li>
    <li><strong>Unabhängige Gerichtsbarkeit</strong> nach Gewohnheitsrecht</li>
    <li><strong>Unveräußerlichkeit von Grundbesitz</strong> mit Widerstandsrecht</li>
    <li><strong>Pfarrerwahl und Kirchenautonomie</strong></li>
    <li><strong>Zollfreiheit, Marktrechte und Bergbaukonzessionen</strong></li>
    <li><strong>Wald- und Gewässernutzungsrechte</strong></li>
    <li><strong>Siegel-Führungsrecht</strong> (sonst nur dem Hochadel vorbehalten)</li>
</ul>

<h3>Langzeitwirkung und historische Bedeutung</h3>
<p>Besonders wirksam wurden "persönliche Freiheit, Gruppenautonomie und die Vorgabe, eine politische Gemeinschaft zu bilden." Das Privileg bildete die Grundlage für die 1486 etablierte "Sächsische Nationsuniversität" als höchste politische Institution, die bis 1876 Bestand hatte.</p>
<p>Das Andreanum prägte das Leben und die Kultur der Siebenbürger Sachsen über mehr als sechs Jahrhunderte hinweg und ist ein einzigartiges Zeugnis mittelalterlicher Rechtspraxis und erfolgreicher Integration.</p>

<h3>Wanderausstellung im Museum der Region Vorchdorf</h3>
<p><strong>Eröffnung:</strong> 12. November 2025, 19:00 Uhr<br>
<strong>Ort:</strong> Museum der Region Vorchdorf, Laudachweg 17, 4655 Vorchdorf</p>
<p>Eine Wanderausstellung des <strong>Deutschen Kulturforums östliches Europa</strong> in Zusammenarbeit mit dem <strong>Department für interethnische Beziehungen der Regierung Rumäniens</strong>.</p>
<p style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-light); border-left: 4px solid var(--accent-gold); border-radius: 5px;">
<strong>Besucherinformation:</strong><br>
Diese besondere Ausstellung bietet einen tiefen Einblick in die Geschichte der Siebenbürger Sachsen und die Bedeutung des Andreanums für die europäische Rechtsgeschichte. Führungen können nach Vereinbarung gebucht werden.</p>`,
        sort_order: 1
    },
    {
        title: '250 Jahre Bukowina',
        description: 'Die bewegte Geschichte der Buchenlanddeutschen, die ab 1775 unter den Habsburgern in der Bukowina angesiedelt wurden. Die Ausstellung beleuchtet das friedliche multiethnische Zusammenleben, die Umsiedlung während des 2. Weltkriegs und den Neuanfang in Laakirchen, Ohlsdorf und Vorchdorf.',
        date_start: '2025-04-24',
        date_end: '2025-06-30',
        date_display: '24. April - 30. Juni 2025',
        image_url: 'Bilder/Veranstaltung/bukowina250.png',
        image_alt: '250 Jahre Bukowina',
        location: null,
        curator: 'Herbert Riess',
        detail_items: JSON.stringify([
            { icon: '🎨', text: 'Europäisches Forum für Heimatkunde' },
            { icon: '🏛️', text: 'Integration & Neubeginn im Salzkammergut' }
        ]),
        gallery_links: JSON.stringify([
            { url: 'http://www.vorchdorfer.at/Galerie25/20250424/index.html', label: 'Fotogalerie' }
        ]),
        modal_content: null,
        sort_order: 2
    },
    {
        title: '80 Jahre Siebenbürger Sachsen in Vorchdorf',
        description: 'Am 16. November 1944 erreichten die Siebenbürger Sachsen aus Tschippendorf auf der Flucht vor den Kriegsgeschehnissen Vorchdorf und fanden hier eine neue Heimat. Die Ausstellung erzählt von bewegenden Schicksalen, dem Verlust der alten Heimat und dem Aufbau eines neuen Lebens.',
        date_start: '2024-11-10',
        date_end: '2025-04-10',
        date_display: '10. November 2024 - 10. April 2025',
        image_url: 'Bilder/Veranstaltung/sachsen.png',
        image_alt: '80 Jahre Siebenbürger Sachsen in Vorchdorf',
        location: 'Museum der Region Vorchdorf',
        curator: null,
        detail_items: JSON.stringify([
            { icon: '📍', text: 'Museum der Region Vorchdorf' },
            { icon: '📅', text: '5 Monate Laufzeit' }
        ]),
        gallery_links: JSON.stringify([
            { url: 'https://www.museum-vorchdorf.at/2024/10/08/sonderausstellung-80-jahre-siebenb%C3%BCrger-sachsen-in-vorchdorf/', label: 'Mehr Informationen' }
        ]),
        modal_content: null,
        sort_order: 3
    },
    {
        title: 'Miniaturkunstwerke ganz groß',
        description: 'Ein einzigartiger Einblick in die faszinierende Welt der Miniaturen. Diese besondere Sonderausstellung zeigte kunstvolle Kleinodien und ihre Geschichten.',
        date_start: '2024-06-26',
        date_end: '2024-10-26',
        date_display: '26. Juni - 26. Oktober 2024',
        image_url: 'Bilder/Veranstaltung/Huemer.png',
        image_alt: 'Miniaturkunstwerke ganz groß',
        location: null,
        curator: null,
        detail_items: JSON.stringify([
            { icon: '🔍', text: 'Kunsthandwerk im Detail' },
            { icon: '⏱️', text: '4 Monate Laufzeit' }
        ]),
        gallery_links: JSON.stringify([
            { url: 'http://www.vorchdorfer.at/Galerie24/20240626/index.html', label: 'Fotogalerie' }
        ]),
        modal_content: null,
        sort_order: 4
    },
    {
        title: '120 Jahre Lokalbahn Lambach-Vorchdorf-Eggenberg',
        description: 'Eine Hommage an 120 Jahre Eisenbahngeschichte in unserer Region. Die Ausstellung dokumentierte die Entwicklung der Lokalbahn und ihre Bedeutung für die Region Vorchdorf.',
        date_start: '2023-01-01',
        date_end: '2023-12-31',
        date_display: '2023',
        image_url: 'Bilder/Veranstaltung/lokalbahn.png',
        image_alt: '120 Jahre Lokalbahn Lambach-Vorchdorf-Eggenberg',
        location: null,
        curator: null,
        detail_items: JSON.stringify([
            { icon: '🚂', text: 'Verkehrsgeschichte' },
            { icon: '📜', text: 'Historische Dokumente & Fotos' }
        ]),
        gallery_links: JSON.stringify([
            { url: 'http://www.vorchdorfer.at/Galerie23/20230511/index.html', label: 'Eröffnung' },
            { url: 'http://www.vorchdorfer.at/Galerie23/20231031/index.html', label: 'Geschichte der Vorchdorfer Bahn' }
        ]),
        modal_content: null,
        sort_order: 5
    },
    {
        title: 'Vorchdorf Glöckler',
        description: 'Eine faszinierende Ausstellung über die einzigartige Glöcklertradition in Vorchdorf. Die kunstvollen Kappen und das traditionelle Brauchtum stehen im Mittelpunkt dieser beeindruckenden Präsentation des regionalen Kulturerbes.',
        date_start: '2022-01-01',
        date_end: '2022-12-31',
        date_display: '2022',
        image_url: 'Bilder/Veranstaltung/gloeckler.png',
        image_alt: 'Vorchdorf Glöckler Tradition',
        location: null,
        curator: null,
        detail_items: JSON.stringify([
            { icon: '🔔', text: 'Glöcklerbrauch' },
            { icon: '🎨', text: 'Kunsthandwerk & Tradition' }
        ]),
        gallery_links: JSON.stringify([
            { url: 'http://www.vorchdorfer.at/Galerie22/20220916/index.html', label: 'Fotogalerie' }
        ]),
        modal_content: null,
        sort_order: 6
    },
    {
        title: 'Mit Ski und Bergschuh - Hersteller Kastinger',
        description: 'Die Geschichte des renommierten Schuhproduzenten Kastinger, der mit hochwertigen Ski- und Bergschuhen internationale Erfolge feierte. Eine Ausstellung über österreichische Industriegeschichte und Handwerkskunst.',
        date_start: '2020-01-01',
        date_end: '2021-12-31',
        date_display: '2020/2021',
        image_url: 'Bilder/Veranstaltung/kastinger.webp',
        image_alt: 'Mit Ski und Bergschuh - Hersteller Kastinger',
        location: null,
        curator: null,
        detail_items: JSON.stringify([
            { icon: '🥾', text: 'Österreichische Industrie' },
            { icon: '⛷️', text: 'Sport & Tradition' }
        ]),
        gallery_links: JSON.stringify([
            { url: 'https://www.vorchdorfonline.at/artikel/winterausstellung-originalschuh-der-mount-everest-besteigung', label: 'Mehr Informationen' }
        ]),
        modal_content: null,
        sort_order: 7
    },
    {
        title: '75 Jahre Bukowina in Vorchdorf und Laakirchen',
        description: 'Eine bewegende Ausstellung zum 75-jährigen Jubiläum der Ankunft der Bukowinadeutschen in Vorchdorf und Laakirchen. Die Ausstellung erzählt von Flucht, Vertreibung und dem Neuanfang in der neuen Heimat.',
        date_start: '2020-01-01',
        date_end: '2020-12-31',
        date_display: '2020',
        image_url: 'Bilder/Veranstaltung/Bukowina.png',
        image_alt: '75 Jahre Bukowina in Vorchdorf und Laakirchen',
        location: null,
        curator: null,
        detail_items: JSON.stringify([
            { icon: '🏠', text: 'Heimat & Integration' },
            { icon: '📜', text: 'Geschichte & Erinnerung' }
        ]),
        gallery_links: JSON.stringify([
            { url: 'http://www.vorchdorfer.at/Galerie20/20200305/index.html', label: 'Fotogalerie' }
        ]),
        modal_content: null,
        sort_order: 8
    },
    {
        title: '100 Jahre Fasching in Vorchdorf',
        description: 'Eine bunte Ausstellung über die traditionsreiche Faschingstradition in Vorchdorf. Von historischen Kostümen über Faschingsumzüge bis zu den Bräuchen der Narrenzeit - die Ausstellung zeigte die lebendige Faschingskultur unserer Gemeinde.',
        date_start: '2019-01-01',
        date_end: '2019-12-31',
        date_display: '2019',
        image_url: 'Bilder/Veranstaltung/Fasching2019.png',
        image_alt: 'Fasching in Vorchdorf 2019',
        location: null,
        curator: null,
        detail_items: JSON.stringify([
            { icon: '🎭', text: 'Faschingstradition' },
            { icon: '🎉', text: 'Brauchtum & Kultur' }
        ]),
        gallery_links: JSON.stringify([
            { url: 'http://www.vorchdorfer.at/Galerie19/20191111b/index.html', label: 'Fotogalerie' }
        ]),
        modal_content: null,
        sort_order: 9
    },
    {
        title: 'Museumseröffnung in der Kitzmantelfabrik',
        description: 'Die Wiedereröffnung des Museums am neuen Standort Kitzmantelfabrik war ein historisches Ereignis für Vorchdorf. Mit einer dreitägigen Eröffnungsveranstaltung am 10., 11. und 17. November 2018 öffneten sich die Türen für das neue Museum und den Fabrikssaal zum ersten Mal.',
        date_start: '2018-11-10',
        date_end: '2018-11-17',
        date_display: 'November 2018',
        image_url: 'Bilder/Museum/Eroeffnung2018.png',
        image_alt: 'Museumseröffnung 2018 in der Kitzmantelfabrik',
        location: null,
        curator: null,
        detail_items: JSON.stringify([
            { icon: '🏛️', text: 'Neueröffnung Museum' },
            { icon: '🎊', text: '3-tägige Eröffnungsfeier' }
        ]),
        gallery_links: JSON.stringify([
            { url: 'http://www.vorchdorfer.at/Galerie%2018/181109/index.html', label: 'Fotogalerie Eröffnung' },
            { url: 'http://www.vorchdorfer.at/Galerie%2018/181110/index.html', label: 'Tag der offenen Tür 10.11.18' },
            { url: 'http://www.vorchdorfer.at/Galerie%2018/181111/index.html', label: 'Gedenkmatinee 11.11.18' },
            { url: 'http://www.vorchdorfer.at/Galerie%2018/181117/index.html', label: 'Galaabend 17.11.18' }
        ]),
        modal_content: null,
        sort_order: 10
    }
];

const events = [
    {
        title: 'Frühjahrsputz im Museum Vorchdorf',
        date: '2026-05-10',
        time: '09:00 Uhr',
        description: 'Gemeinsamer Einsatz zur Verschönerung unseres Museums und der Umgebung.',
        location: 'Museum Vorchdorf'
    },
    {
        title: 'Gemeinsame Fahrt zur Burg Wels',
        date: '2026-04-20',
        time: '14:00 Uhr',
        description: 'Geführter Rundgang durch historische Orte unserer Nachbarstadt. Treffpunkt: Kirche Vorchdorf',
        location: 'Kirche Vorchdorf'
    },
    {
        title: 'Vorabinfo für unsere neue Sonderausstellung "Museum meets KI"',
        date: '2026-03-26',
        time: '19:00 Uhr',
        description: 'Wir versuchen mit dieser Ausstellung allen Interessierten zu zeigen, was KI ist und kann und vor allem was KI "noch nicht" kann. Zusätzlich haben wir eigene KI-Apps geschrieben, die alle möglichen Artefakte durchchecken und nach unseren "Prompts" eine umfassende Information ausspucken. Lassen Sie sich überraschen und probieren Sie es selbst aus - sie werden staunen!',
        location: 'Museum der Region Vorchdorf'
    },
    {
        title: 'Heimatvereinstreffen zur Fertigstellung des Bücherregals',
        date: '2025-11-17',
        time: '19:00 Uhr',
        description: 'Gemeinsames Treffen zur Fertigstellung des Bücherregals.',
        location: 'Museum Vorchdorf'
    },
    {
        title: 'Generalversammlung 2025',
        date: '2025-11-14',
        time: '19:00 Uhr',
        description: 'Ordentliche Generalversammlung des Heimat- und Kulturvereins. Wir freuen uns auf zahlreiches Erscheinen!',
        location: 'Gasthaus Schloss Hochhaus'
    }
];

module.exports = { exhibitions, events };
