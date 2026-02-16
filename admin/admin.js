// ===== STATE =====
let currentPage = 'dashboard';
let submissionsPage = 1;

// ===== AUTH =====
async function checkAuth() {
    try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        if (data.authenticated) {
            showAdmin();
        }
    } catch (e) {
        // Not authenticated, show login
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.style.display = 'none';

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        if (res.ok) {
            showAdmin();
        } else {
            errorEl.textContent = 'Falsches Passwort';
            errorEl.style.display = 'block';
        }
    } catch (e) {
        errorEl.textContent = 'Verbindungsfehler';
        errorEl.style.display = 'block';
    }
}

async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-layout').style.display = 'none';
    document.getElementById('login-password').value = '';
}

function showAdmin() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-layout').style.display = 'block';
    loadDashboard();
}

// ===== NAVIGATION =====
function showPage(page) {
    currentPage = page;
    document.querySelectorAll('.admin-page').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + page).style.display = 'block';
    document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
    document.querySelector(`.sidebar-item[data-page="${page}"]`).classList.add('active');

    if (page === 'dashboard') loadDashboard();
    else if (page === 'submissions') loadSubmissions();
    else if (page === 'exhibitions') loadExhibitions();
    else if (page === 'events') loadEvents();
}

// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        const [statsRes, subsRes, exRes, evtRes] = await Promise.all([
            fetch('/api/submissions/stats'),
            fetch('/api/submissions?limit=5'),
            fetch('/api/exhibitions'),
            fetch('/api/events')
        ]);
        const stats = await statsRes.json();
        const subs = await subsRes.json();
        const exhibitions = await exRes.json();
        const events = await evtRes.json();

        // Update unread badge
        const badge = document.getElementById('unread-badge');
        if (stats.total_unread > 0) {
            badge.textContent = stats.total_unread;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }

        const activeEx = exhibitions.filter(e => e.status === 'aktuell' || e.status === 'naechste').length;
        const today = new Date().toISOString().split('T')[0];
        const upcomingEvts = events.filter(e => e.date >= today).length;

        document.getElementById('dashboard-stats').innerHTML = `
            <div class="stat-card red">
                <div class="stat-number">${stats.total_unread}</div>
                <div class="stat-label">Ungelesene Eingänge</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.by_type.reduce((s, t) => s + t.total, 0)}</div>
                <div class="stat-label">Eingänge gesamt</div>
            </div>
            <div class="stat-card green">
                <div class="stat-number">${activeEx}</div>
                <div class="stat-label">Aktive Ausstellungen</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${upcomingEvts}</div>
                <div class="stat-label">Kommende Events</div>
            </div>
        `;

        // Recent submissions
        if (subs.submissions && subs.submissions.length > 0) {
            document.getElementById('dashboard-recent').innerHTML = `
                <table class="data-table">
                    <thead><tr><th>Typ</th><th>Name</th><th>E-Mail</th><th>Datum</th></tr></thead>
                    <tbody>
                        ${subs.submissions.map(s => `
                            <tr class="${s.is_read ? '' : 'unread'}">
                                <td><span class="type-badge ${s.form_type}">${typeLabel(s.form_type)}</span></td>
                                <td>${esc(s.name || '-')}</td>
                                <td>${esc(s.email || '-')}</td>
                                <td>${formatDate(s.created_at)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            document.getElementById('dashboard-recent').innerHTML = '<p style="color: var(--light-gray);">Noch keine Eingänge vorhanden.</p>';
        }
    } catch (e) {
        console.error('Dashboard load error:', e);
    }
}

// ===== SUBMISSIONS =====
async function loadSubmissions() {
    const type = document.getElementById('filter-type').value;
    const unread = document.getElementById('filter-unread').value;
    const search = document.getElementById('filter-search').value;

    const params = new URLSearchParams({ page: submissionsPage, limit: 25 });
    if (type) params.set('type', type);
    if (unread) params.set('unread', unread);
    if (search) params.set('search', search);

    try {
        const res = await fetch('/api/submissions?' + params);
        const data = await res.json();

        if (!data.submissions || data.submissions.length === 0) {
            document.getElementById('submissions-table-container').innerHTML = '<p style="color: var(--light-gray); text-align:center; padding:2rem;">Keine Eingänge gefunden.</p>';
            document.getElementById('submissions-pagination').innerHTML = '';
            return;
        }

        let html = `<table class="data-table">
            <thead><tr><th>Typ</th><th>Name</th><th>E-Mail</th><th>Datum</th><th>Aktionen</th></tr></thead>
            <tbody>`;

        for (const s of data.submissions) {
            html += `
                <tr class="${s.is_read ? '' : 'unread'}" onclick="toggleDetail(${s.id})" style="cursor:pointer;">
                    <td><span class="type-badge ${s.form_type}">${typeLabel(s.form_type)}</span></td>
                    <td>${esc(s.name || '-')}</td>
                    <td>${esc(s.email || '-')}</td>
                    <td>${formatDate(s.created_at)}</td>
                    <td>
                        <div class="btn-group">
                            ${!s.is_read ? `<button class="btn btn-small btn-secondary" onclick="markRead(${s.id}, event)">Gelesen</button>` : ''}
                            <button class="btn btn-small btn-secondary" onclick="archiveSubmission(${s.id}, event)">Archiv</button>
                        </div>
                    </td>
                </tr>
                <tr class="detail-row" id="detail-${s.id}">
                    <td colspan="5">
                        <div class="detail-content">
                            ${Object.entries(s.data).map(([k, v]) => `
                                <div class="field"><span class="field-label">${esc(k)}:</span> ${esc(String(v))}</div>
                            `).join('')}
                            ${s.file_path ? `<div class="field"><span class="field-label">Datei:</span> <a href="/${s.file_path}" target="_blank">Ansehen</a></div>` : ''}
                        </div>
                    </td>
                </tr>`;
        }

        html += '</tbody></table>';
        document.getElementById('submissions-table-container').innerHTML = html;

        // Pagination
        const pag = document.getElementById('submissions-pagination');
        pag.innerHTML = `
            <button ${data.page <= 1 ? 'disabled' : ''} onclick="submissionsPage=${data.page - 1}; loadSubmissions();">&#8592;</button>
            <span>Seite ${data.page} von ${data.pages}</span>
            <button ${data.page >= data.pages ? 'disabled' : ''} onclick="submissionsPage=${data.page + 1}; loadSubmissions();">&#8594;</button>
        `;
    } catch (e) {
        console.error('Submissions load error:', e);
    }
}

function toggleDetail(id) {
    const row = document.getElementById('detail-' + id);
    if (row) row.classList.toggle('open');
}

async function markRead(id, e) {
    e.stopPropagation();
    await fetch('/api/submissions/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: true })
    });
    loadSubmissions();
    loadDashboard(); // update badge
}

async function archiveSubmission(id, e) {
    e.stopPropagation();
    if (!confirm('Eingang archivieren?')) return;
    await fetch('/api/submissions/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: true })
    });
    loadSubmissions();
}

function exportCSV() {
    const type = document.getElementById('filter-type').value;
    const params = type ? `?type=${type}` : '';
    window.open('/api/submissions/export' + params, '_blank');
}

// ===== EXHIBITIONS =====
async function loadExhibitions() {
    try {
        const res = await fetch('/api/exhibitions');
        const exhibitions = await res.json();
        const grid = document.getElementById('exhibitions-grid');

        if (exhibitions.length === 0) {
            grid.innerHTML = '<p style="color: var(--light-gray);">Noch keine Ausstellungen vorhanden.</p>';
            return;
        }

        grid.innerHTML = exhibitions.map(ex => `
            <div class="exhibition-admin-card">
                ${ex.image_url ? `<img src="/${ex.image_url}" alt="${esc(ex.image_alt || ex.title)}">` : '<div style="height:180px; background: var(--bg-light); display:flex; align-items:center; justify-content:center; color:var(--light-gray);">Kein Bild</div>'}
                <div class="card-body">
                    <span class="status-badge ${ex.status}">${statusLabel(ex.status)}</span>
                    <h3 style="margin-top:0.5rem;">${esc(ex.title)}</h3>
                    <div class="card-date">${esc(ex.date_display)}</div>
                    <div class="btn-group">
                        <button class="btn btn-small btn-secondary" onclick="editExhibition(${ex.id})">Bearbeiten</button>
                        <button class="btn btn-small btn-danger" onclick="deleteExhibition(${ex.id})">Löschen</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Exhibitions load error:', e);
    }
}

function openExhibitionModal(data) {
    document.getElementById('exhibition-modal-title').textContent = data ? 'Ausstellung bearbeiten' : 'Neue Ausstellung';
    document.getElementById('ex-id').value = data ? data.id : '';
    document.getElementById('ex-title').value = data ? data.title : '';
    document.getElementById('ex-description').value = data ? data.description : '';
    document.getElementById('ex-date-display').value = data ? data.date_display : '';
    document.getElementById('ex-date-start').value = data && data.date_start ? data.date_start.split('T')[0] : '';
    document.getElementById('ex-date-end').value = data && data.date_end ? data.date_end.split('T')[0] : '';
    document.getElementById('ex-location').value = data ? (data.location || 'Museum der Region Vorchdorf') : 'Museum der Region Vorchdorf';
    document.getElementById('ex-curator').value = data ? (data.curator || '') : '';
    document.getElementById('ex-sort-order').value = data ? (data.sort_order || 0) : 0;
    document.getElementById('ex-modal-content').value = data ? (data.modal_content || '') : '';

    // Image preview
    const preview = document.getElementById('ex-image-preview');
    if (data && data.image_url) {
        preview.innerHTML = `<img src="/${data.image_url}" style="max-height:100px; border-radius:4px;">`;
    } else {
        preview.innerHTML = '';
    }

    // Detail items
    const detailContainer = document.getElementById('ex-detail-items');
    detailContainer.innerHTML = '';
    const details = data && data.detail_items ? data.detail_items : [];
    details.forEach(d => addDetailItem(d.icon, d.text));

    // Gallery links
    const galleryContainer = document.getElementById('ex-gallery-links');
    galleryContainer.innerHTML = '';
    const links = data && data.gallery_links ? data.gallery_links : [];
    links.forEach(l => addGalleryLink(l.url, l.label));

    document.getElementById('exhibition-modal').classList.add('open');
}

function closeExhibitionModal() {
    document.getElementById('exhibition-modal').classList.remove('open');
}

function addDetailItem(icon, text) {
    const container = document.getElementById('ex-detail-items');
    const div = document.createElement('div');
    div.className = 'dynamic-list-item';
    div.innerHTML = `
        <input type="text" placeholder="Icon" value="${esc(icon || '')}" class="detail-icon-input">
        <input type="text" placeholder="Text" value="${esc(text || '')}" class="detail-text-input" style="flex:3;">
        <button type="button" class="btn-remove-item" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(div);
}

function addGalleryLink(url, label) {
    const container = document.getElementById('ex-gallery-links');
    const div = document.createElement('div');
    div.className = 'dynamic-list-item';
    div.innerHTML = `
        <input type="text" placeholder="URL" value="${esc(url || '')}" class="gallery-url-input" style="flex:2;">
        <input type="text" placeholder="Label" value="${esc(label || '')}" class="gallery-label-input" style="flex:1;">
        <button type="button" class="btn-remove-item" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(div);
}

async function saveExhibition(e) {
    e.preventDefault();
    const id = document.getElementById('ex-id').value;

    const detailItems = Array.from(document.querySelectorAll('#ex-detail-items .dynamic-list-item')).map(el => ({
        icon: el.querySelector('.detail-icon-input').value,
        text: el.querySelector('.detail-text-input').value
    })).filter(d => d.text);

    const galleryLinks = Array.from(document.querySelectorAll('#ex-gallery-links .dynamic-list-item')).map(el => ({
        url: el.querySelector('.gallery-url-input').value,
        label: el.querySelector('.gallery-label-input').value
    })).filter(l => l.url);

    const body = {
        title: document.getElementById('ex-title').value,
        description: document.getElementById('ex-description').value,
        date_display: document.getElementById('ex-date-display').value,
        date_start: document.getElementById('ex-date-start').value || null,
        date_end: document.getElementById('ex-date-end').value || null,
        location: document.getElementById('ex-location').value,
        curator: document.getElementById('ex-curator').value || null,
        sort_order: parseInt(document.getElementById('ex-sort-order').value) || 0,
        modal_content: document.getElementById('ex-modal-content').value || null,
        detail_items: detailItems,
        gallery_links: galleryLinks
    };

    try {
        const url = id ? '/api/exhibitions/' + id : '/api/exhibitions';
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error('Fehler beim Speichern');

        const result = await res.json();
        const exhibitionId = id || result.id;

        // Upload image if selected
        const imageFile = document.getElementById('ex-image').files[0];
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            await fetch(`/api/exhibitions/${exhibitionId}/image`, {
                method: 'POST',
                body: formData
            });
        }

        closeExhibitionModal();
        loadExhibitions();
    } catch (err) {
        alert('Fehler: ' + err.message);
    }
}

async function editExhibition(id) {
    try {
        const res = await fetch('/api/exhibitions/' + id);
        const data = await res.json();
        openExhibitionModal(data);
    } catch (e) {
        alert('Fehler beim Laden der Ausstellung');
    }
}

async function deleteExhibition(id) {
    if (!confirm('Ausstellung wirklich löschen?')) return;
    await fetch('/api/exhibitions/' + id, { method: 'DELETE' });
    loadExhibitions();
}

// ===== EVENTS =====
async function loadEvents() {
    try {
        const res = await fetch('/api/events');
        const events = await res.json();
        const container = document.getElementById('events-list');

        if (events.length === 0) {
            container.innerHTML = '<p style="color: var(--light-gray);">Noch keine Veranstaltungen vorhanden.</p>';
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        container.innerHTML = events.map(evt => `
            <div class="event-admin-item ${evt.date < today ? 'past' : ''}">
                <div class="event-info">
                    <strong>${esc(evt.title)}</strong>
                    <small>${evt.date} | ${esc(evt.time)} | ${esc(evt.location || '')}</small>
                </div>
                <div class="btn-group">
                    <button class="btn btn-small btn-secondary" onclick="editEvent(${evt.id})">Bearbeiten</button>
                    <button class="btn btn-small btn-danger" onclick="deleteEvent(${evt.id})">Löschen</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Events load error:', e);
    }
}

function openEventModal(data) {
    document.getElementById('event-modal-title').textContent = data ? 'Veranstaltung bearbeiten' : 'Neue Veranstaltung';
    document.getElementById('evt-id').value = data ? data.id : '';
    document.getElementById('evt-title').value = data ? data.title : '';
    document.getElementById('evt-date').value = data && data.date ? data.date.split('T')[0] : '';
    document.getElementById('evt-time').value = data ? data.time : '';
    document.getElementById('evt-location').value = data ? (data.location || '') : '';
    document.getElementById('evt-description').value = data ? data.description : '';
    document.getElementById('event-modal').classList.add('open');
}

function closeEventModal() {
    document.getElementById('event-modal').classList.remove('open');
}

async function saveEvent(e) {
    e.preventDefault();
    const id = document.getElementById('evt-id').value;

    const body = {
        title: document.getElementById('evt-title').value,
        date: document.getElementById('evt-date').value,
        time: document.getElementById('evt-time').value,
        location: document.getElementById('evt-location').value || null,
        description: document.getElementById('evt-description').value
    };

    try {
        const url = id ? '/api/events/' + id : '/api/events';
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error('Fehler beim Speichern');

        closeEventModal();
        loadEvents();
    } catch (err) {
        alert('Fehler: ' + err.message);
    }
}

async function editEvent(id) {
    try {
        const res = await fetch('/api/events');
        const events = await res.json();
        const evt = events.find(e => e.id === id);
        if (evt) openEventModal(evt);
    } catch (e) {
        alert('Fehler beim Laden');
    }
}

async function deleteEvent(id) {
    if (!confirm('Veranstaltung wirklich löschen?')) return;
    await fetch('/api/events/' + id, { method: 'DELETE' });
    loadEvents();
}

// ===== HELPERS =====
function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('de-AT', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function typeLabel(type) {
    const labels = {
        kontakt: 'Kontakt',
        mitgliedschaft: 'Mitglied',
        zeitzeugen: 'Zeitzeugen',
        ausflug: 'Ausflug',
        ideenworkshop: 'Idee',
        newsletter: 'Newsletter'
    };
    return labels[type] || type;
}

function statusLabel(status) {
    const labels = { naechste: 'Nächste', aktuell: 'Aktuell', abgelaufen: 'Abgelaufen' };
    return labels[status] || status;
}

let debounceTimer;
function debounce(fn, delay) {
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fn, delay);
    };
}

// Close modals on outside click
document.querySelectorAll('.admin-modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('open');
        }
    });
});

// Close modals on Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.admin-modal.open').forEach(m => m.classList.remove('open'));
    }
});

// Init
checkAuth();
