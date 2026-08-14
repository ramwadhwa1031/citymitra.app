// ══════════════════════════════════════════
// CITY MITRA — City Picker + Shared Logic
// ══════════════════════════════════════════

(function () {
    'use strict';

    const CITIES = [
        { id: 'kkr', name: 'Kurukshetra', state: 'Haryana', emoji: '🕉️', color: '#EA580C', desc: 'Holy land of the Mahabharata — heritage, pilgrimage, Gita AI.' },
        { id: 'ftb', name: 'Fatehabad', state: 'Haryana', emoji: '🏛️', color: '#E65100', desc: 'Pink City of Haryana — ancient heritage, agriculture & civic services.' },
        { id: 'karnal', name: 'Karnal', state: 'Haryana', emoji: '🌾', color: '#2E7D32', desc: 'Thriving district hub — agriculture, NDRI, education & civic services.' },
        { id: 'ambala', name: 'Ambala', state: 'Haryana', emoji: '🏛️', color: '#1565C0', desc: 'Gateway of the north — cantonment, commerce & connectivity.' },
        { id: 'pkl', name: 'Panchkula', state: 'Haryana', emoji: '🏔️', color: '#00695C', desc: 'Shivalik foothills — Morni Hills, nature parks & modern planning.' },
        { id: 'srs', name: 'Sirsa', state: 'Haryana', emoji: '🌿', color: '#6A1B9A', desc: 'Rich culture — folk heritage, agriculture & religious sites.' },
        { id: 'palwal', name: 'Palwal', state: 'Haryana', emoji: '🛕', color: '#E65100', desc: 'Ancient roots — Panchavati Temple, Dauji Temple & Draupadi Ghat.' },
        { id: 'fbd', name: 'Faridabad', state: 'Haryana', emoji: '🏭', color: '#C62828', desc: 'Industrial powerhouse — largest city in Haryana, NCR hub.' },
        { id: 'ddn', name: 'Dehradun', state: 'Uttarakhand', emoji: '🏔️', color: '#1B5E20', desc: 'Capital of Uttarakhand — gateway to Mussoorie & hill stations.' },
        { id: 'asr', name: 'Amritsar', state: 'Punjab', emoji: '🛕', color: '#E65100', desc: 'Golden Temple city — spiritual capital & border heritage.' },
        { id: 'vnr', name: 'Varanasi', state: 'Uttar Pradesh', emoji: '🕉️', color: '#BF360C', desc: 'Oldest living city — ghats, temples & spiritual heartland.' },
        { id: 'jpr', name: 'Jaipur', state: 'Rajasthan', emoji: '🏰', color: '#AD1457', desc: 'Pink City — forts, palaces, culture & Rajasthani heritage.' },
        { id: 'lko', name: 'Lucknow', state: 'Uttar Pradesh', emoji: '🕌', color: '#4527A0', desc: 'City of Nawabs — Mughal architecture, cuisine & governance.' },
        { id: 'chd', name: 'Chandigarh', state: 'Chandigarh', emoji: '🌹', color: '#00838F', desc: 'The Beautiful City — Le Corbusier\'s planned masterpiece.' }
    ];

    let selectedCity = JSON.parse(localStorage.getItem('cm_selected_city')) || CITIES[0];

    // ── Initialize ──
    function init() {
        updateSelectedCityUI();
        renderCityDropdown(CITIES);
        renderCitiesGrid();
        renderTicker();
    }

    // ── City Dropdown ──
    function updateSelectedCityUI() {
        const nameEl = document.getElementById('selectedCityName');
        if (nameEl) nameEl.textContent = selectedCity.name;
    }

    window.toggleCityDropdown = function () {
        const dd = document.getElementById('cityDropdown');
        dd.classList.toggle('open');
        if (dd.classList.contains('open')) {
            const input = document.getElementById('citySearchInput');
            if (input) { input.value = ''; input.focus(); }
            renderCityDropdown(CITIES);
        }
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dd = document.getElementById('cityDropdown');
        const btn = document.getElementById('cityPickerBtn');
        if (dd && btn && !dd.contains(e.target) && !btn.contains(e.target)) {
            dd.classList.remove('open');
        }
    });

    function renderCityDropdown(cities) {
        const list = document.getElementById('cityList');
        if (!list) return;
        list.innerHTML = cities.map(c => `
            <div class="city-item ${c.id === selectedCity.id ? 'active' : ''}" onclick="pickCity('${c.id}')">
                <span class="city-item-emoji">${c.emoji}</span>
                <span class="city-item-name">${c.name}</span>
                <span class="city-item-state">${c.state}</span>
            </div>
        `).join('');

        // Show request link if no results
        const requestLink = document.getElementById('cityRequestLink');
        if (requestLink) {
            requestLink.style.display = cities.length === 0 ? 'flex' : 'flex';
        }
    }

    window.filterCities = function (query) {
        const q = query.toLowerCase();
        const filtered = CITIES.filter(c =>
            c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
        );
        renderCityDropdown(filtered);
    };

    window.pickCity = function (cityId) {
        selectedCity = CITIES.find(c => c.id === cityId) || CITIES[0];
        localStorage.setItem('cm_selected_city', JSON.stringify(selectedCity));
        updateSelectedCityUI();
        document.getElementById('cityDropdown').classList.remove('open');
    };

    // ── Interactive City Request Modal (Google Sheets Sync) ──
    function ensureCityRequestModal() {
        if (document.getElementById('cmCityRequestModal')) return;

        const modalHtml = `
            <div class="cm-modal-overlay" id="cmCityRequestModal" onclick="if(event.target === this) closeCityRequestModal()">
                <div class="cm-modal-box">
                    <div class="cm-modal-header">
                        <div>
                            <div class="cm-modal-title">🏙️ Request a New City</div>
                            <div class="cm-modal-desc">Tell us which district or city you want City Mitra to support next.</div>
                        </div>
                        <button class="cm-modal-close" onclick="closeCityRequestModal()" title="Close">✕</button>
                    </div>
                    <form id="cmCityRequestForm" onsubmit="handleCityRequestSubmit(event)">
                        <div class="cm-form-group">
                            <label class="cm-form-label">City / District Name *</label>
                            <input type="text" id="cmReqCityName" class="cm-form-input" required placeholder="e.g. Rohtak, Gurgaon, Shimla">
                        </div>
                        <div class="cm-form-group">
                            <label class="cm-form-label">State / Union Territory *</label>
                            <input type="text" id="cmReqState" class="cm-form-input" required placeholder="e.g. Haryana, Punjab, Himachal Pradesh">
                        </div>
                        <div class="cm-form-row">
                            <div class="cm-form-group">
                                <label class="cm-form-label">Your Name</label>
                                <input type="text" id="cmReqName" class="cm-form-input" placeholder="Citizen name">
                            </div>
                            <div class="cm-form-group">
                                <label class="cm-form-label">Email / Phone</label>
                                <input type="text" id="cmReqContact" class="cm-form-input" placeholder="To notify you when live">
                            </div>
                        </div>
                        <div class="cm-form-group">
                            <label class="cm-form-label">Notes / Why this city?</label>
                            <textarea id="cmReqNotes" class="cm-form-textarea" rows="2" placeholder="Key landmarks, services, or why you need this..."></textarea>
                        </div>
                        <button type="submit" class="cm-btn-submit" id="cmReqSubmitBtn">
                            <span>🚀 Submit City Request</span>
                        </button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    window.showCityRequest = function () {
        ensureCityRequestModal();
        const dd = document.getElementById('cityDropdown');
        if (dd) dd.classList.remove('open');
        const modal = document.getElementById('cmCityRequestModal');
        if (modal) {
            modal.classList.add('active');
            const input = document.getElementById('cmReqCityName');
            if (input) setTimeout(() => input.focus(), 150);
        }
    };

    window.closeCityRequestModal = function () {
        const modal = document.getElementById('cmCityRequestModal');
        if (modal) modal.classList.remove('active');
    };

    window.handleCityRequestSubmit = async function (e) {
        e.preventDefault();
        const btn = document.getElementById('cmReqSubmitBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>⏳ Saving Request...</span>';
        btn.disabled = true;

        const payload = {
            cityName: document.getElementById('cmReqCityName').value.trim(),
            state: document.getElementById('cmReqState').value.trim(),
            name: document.getElementById('cmReqName').value.trim(),
            contact: document.getElementById('cmReqContact').value.trim(),
            notes: document.getElementById('cmReqNotes').value.trim()
        };

        if (window.CityMitraSheets && window.CityMitraSheets.submitCityRequest) {
            await window.CityMitraSheets.submitCityRequest(payload);
        } else {
            alert(`Thank you! We've noted your request to add "${payload.cityName}".`);
        }

        btn.innerHTML = '<span>✅ Request Submitted!</span>';
        setTimeout(() => {
            closeCityRequestModal();
            btn.innerHTML = originalText;
            btn.disabled = false;
            document.getElementById('cmCityRequestForm').reset();
        }, 1500);
    };

    // Listen for ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCityRequestModal();
    });

    // ── Open Chat with Query (Clean URL compatible) ──
    window.openChat = function (query) {
        const isHttp = window.location.protocol.startsWith('http');
        const target = isHttp ? 'chat' : 'chat.html';
        if (query) {
            window.location.href = `${target}?q=${encodeURIComponent(query)}`;
        } else {
            window.location.href = target;
        }
    };

    // ── Cities Grid ──
    function renderCitiesGrid() {
        const grid = document.getElementById('citiesGrid');
        if (!grid) return;

        const gradients = [
            'linear-gradient(135deg, #EA580C, #FB923C)',
            'linear-gradient(135deg, #059669, #34D399)',
            'linear-gradient(135deg, #1565C0, #42A5F5)',
            'linear-gradient(135deg, #7C3AED, #A78BFA)',
            'linear-gradient(135deg, #E11D48, #FB7185)',
            'linear-gradient(135deg, #D97706, #FBBF24)',
            'linear-gradient(135deg, #00695C, #4DB6AC)',
            'linear-gradient(135deg, #6A1B9A, #AB47BC)',
            'linear-gradient(135deg, #AD1457, #F06292)'
        ];

        grid.innerHTML = CITIES.slice(0, 6).map((c, i) => `
            <div class="city-card reveal" style="background: ${gradients[i % gradients.length]};" onclick="pickCity('${c.id}'); openChat('');">
                <span class="city-card-badge"><span class="pill pill-live" style="background:rgba(255,255,255,0.2);color:white;border-color:transparent;">● LIVE</span></span>
                <div class="city-card-emoji">${c.emoji}</div>
                <h3>${c.name}</h3>
                <p>${c.desc}</p>
                <div class="city-card-tags">
                    ${['Officers', 'Schemes', 'Tourism'].map(t => `<span class="city-card-tag">${t}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // ── Ticker ──
    const CITY_IMAGES = {
        'kkr': 'assets/cities/city_kurukshetra.png',
        'ftb': 'assets/cities/city_fatehabad.png',
        'karnal': 'assets/cities/city_karnal.png',
        'ambala': 'assets/cities/city_ambala.png',
        'pkl': 'assets/cities/city_panchkula.png',
        'srs': 'assets/cities/city_sirsa.png',
        'palwal': 'assets/cities/city_palwal.png',
        'fbd': 'assets/cities/city_faridabad.png',
        'ddn': 'assets/cities/city_dehradun.png',
        'asr': 'assets/cities/city_amritsar.png',
        'vnr': 'assets/cities/city_varanasi.png',
        'jpr': 'assets/cities/city_jaipur.png',
        'lko': 'assets/cities/city_lucknow.png',
        'chd': 'assets/cities/city_chandigarh.png'
    };

    function renderTicker() {
        const track = document.getElementById('tickerTrack');
        if (!track) return;
        const items = CITIES.map(c => `
            <div class="ticker-city" onclick="pickCity('${c.id}'); openChat('');" title="Chat with ${c.name} AI">
                <img class="ticker-city-img" src="${CITY_IMAGES[c.id] || 'icons/icon-192.png'}" alt="${c.name}" onerror="this.src='icons/icon-192.png'">
                <span class="ticker-city-name">${c.name}</span>
                <span class="ticker-city-live">Live</span>
            </div>
        `).join('');
        track.innerHTML = items + items; // Duplicate for seamless marquee loop
    }

    // ── Init ──
    document.addEventListener('DOMContentLoaded', init);

})();
