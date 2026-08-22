// ══════════════════════════════════════════
// CITY MITRA — Chat Engine V2
// Response formatting, city theming, proximity
// ══════════════════════════════════════════

(function () {
    'use strict';

    // ── City Database with themes & landmarks ──
    const CITIES = [
        { id: 'kkr', name: 'Kurukshetra', nameHi: 'कुरुक्षेत्र', state: 'Haryana', emoji: '🕉️', color: '#EA580C', theme: 'mahabharat',
          features: { gita: true, proximity: true },
          landmarks: [
            { name: 'Brahma Sarovar', lat: 29.9638, lng: 76.8314, icon: '🕉️', desc: 'Sacred lake — largest man-made water tank in Asia' },
            { name: 'Krishna Museum', lat: 29.9672, lng: 76.8281, icon: '🏛️', desc: 'Museum dedicated to Lord Krishna\'s life & Mahabharata' },
            { name: 'Jyotisar', lat: 29.9607, lng: 76.7965, icon: '📖', desc: 'Where Lord Krishna delivered the Bhagavad Gita to Arjuna' },
            { name: 'Sannihit Sarovar', lat: 29.9620, lng: 76.8345, icon: '🛕', desc: 'Meeting point of seven sacred Saraswati rivers' },
            { name: 'Sheikh Chilli Tomb', lat: 29.9711, lng: 76.8181, icon: '🏛️', desc: 'Mughal-era tomb with beautiful architecture' }
          ]
        },
        { id: 'ftb', name: 'Fatehabad', nameHi: 'फतेहाबाद', state: 'Haryana', emoji: '🏛️', color: '#E65100', theme: 'heritage', features: { gita: false }, landmarks: [] },
        { id: 'karnal', name: 'Karnal', nameHi: 'करनाल', state: 'Haryana', emoji: '🌾', color: '#2E7D32', theme: 'agriculture', features: { gita: false }, landmarks: [] },
        { id: 'ambala', name: 'Ambala', nameHi: 'अंबाला', state: 'Haryana', emoji: '🏛️', color: '#1565C0', theme: 'cantonment', features: { gita: false }, landmarks: [] },
        { id: 'pkl', name: 'Panchkula', nameHi: 'पंचकूला', state: 'Haryana', emoji: '🏔️', color: '#00695C', theme: 'nature', features: { gita: false }, landmarks: [] },
        { id: 'srs', name: 'Sirsa', nameHi: 'सिरसा', state: 'Haryana', emoji: '🌿', color: '#6A1B9A', theme: 'heritage', features: { gita: false }, landmarks: [] },
        { id: 'palwal', name: 'Palwal', nameHi: 'पलवल', state: 'Haryana', emoji: '🛕', color: '#E65100', theme: 'temple', features: { gita: false }, landmarks: [] },
        { id: 'fbd', name: 'Faridabad', nameHi: 'फरीदाबाद', state: 'Haryana', emoji: '🏭', color: '#C62828', theme: 'industrial', features: { gita: false }, landmarks: [] },
        { id: 'ddn', name: 'Dehradun', nameHi: 'देहरादून', state: 'Uttarakhand', emoji: '🏔️', color: '#1B5E20', theme: 'mountain', features: { gita: false }, landmarks: [] },
        { id: 'asr', name: 'Amritsar', nameHi: 'अमृतसर', state: 'Punjab', emoji: '🛕', color: '#E65100', theme: 'spiritual', features: { gita: false }, landmarks: [] },
        { id: 'vns', name: 'Varanasi', nameHi: 'वाराणसी', state: 'Uttar Pradesh', emoji: '🕉️', color: '#BF360C', theme: 'spiritual', features: { gita: false }, landmarks: [] },
        { id: 'jaipur', name: 'Jaipur', nameHi: 'जयपुर', state: 'Rajasthan', emoji: '🏰', color: '#AD1457', theme: 'royal', features: { gita: false }, landmarks: [] },
        { id: 'lko', name: 'Lucknow', nameHi: 'लखनऊ', state: 'Uttar Pradesh', emoji: '🕌', color: '#4527A0', theme: 'nawabi', features: { gita: false }, landmarks: [] },
        { id: 'chd', name: 'Chandigarh', nameHi: 'चंडीगढ़', state: 'Chandigarh', emoji: '🌹', color: '#00838F', theme: 'modern', features: { gita: false }, landmarks: [] }
    ];

    // ── n8n Webhooks ──
    const WEBHOOK_CHAT = 'https://n8n-workflow-test.duckdns.org/webhook/chat';
    const WEBHOOK_GITA = 'https://n8n-workflow-test.duckdns.org/webhook/InfoBot_AskGita';

    // ── State ──
    // Migrate stale city IDs from localStorage (old vnr→vns, jpr→jaipur)
    const ID_MIGRATION = { 'vnr': 'vns', 'jpr': 'jaipur' };
    let currentCity = JSON.parse(localStorage.getItem('cm_selected_city')) || CITIES[0];
    if (currentCity && ID_MIGRATION[currentCity.id]) {
        currentCity = CITIES.find(c => c.id === ID_MIGRATION[currentCity.id]) || CITIES[0];
        localStorage.setItem('cm_selected_city', JSON.stringify(currentCity));
    }
    // Also validate the stored city still exists in CITIES
    if (currentCity && !CITIES.find(c => c.id === currentCity.id)) {
        currentCity = CITIES[0];
        localStorage.setItem('cm_selected_city', JSON.stringify(currentCity));
    }
    let currentLanguage = localStorage.getItem('cm_language') || 'en';
    let conversations = JSON.parse(localStorage.getItem('cm_conversations')) || {};
    let activeConversationId = null;
    let isProcessing = false;
    let proximityWatchId = null;

    // ── DOM ──
    const $ = id => document.getElementById(id);

    // ══════════════════════════════════
    // INITIALIZATION
    // ══════════════════════════════════

    function updateLangUI() {
        const isHi = currentLanguage === 'hi';

        // 1. Toggle Button
        const btn = $('langToggle');
        if (btn) btn.textContent = isHi ? 'हि' : 'EN';

        // 2. Input Placeholder
        const input = $('chatInput');
        if (input) input.placeholder = isHi ? 'अपने शहर के बारे में कुछ भी पूछें...' : 'Ask anything about your city...';

        // 3. Welcome Titles & Subtitle
        const welcomeTitle = document.querySelector('#chatWelcome h1');
        if (welcomeTitle) welcomeTitle.textContent = isHi ? 'मैं आपकी क्या मदद कर सकता हूँ?' : 'What can I help you find?';

        const welcomeSubtitle = document.querySelector('#chatWelcome p');
        if (welcomeSubtitle) welcomeSubtitle.textContent = isHi 
            ? 'अपने जिले के अधिकारियों, योजनाओं, पर्यटन और आपातकालीन सेवाओं के बारे में पूछें।'
            : 'Ask about any district — officers, schemes, tourism, emergencies, and more.';

        const vibesLabel = document.querySelector('.chat-vibes-label');
        if (vibesLabel) vibesLabel.textContent = isHi ? 'या किसी विषय से शुरू करें' : 'OR START WITH A TOPIC';

        // 4. Update Suggestion Cards & Vibe Chips
        updateSuggestions();
        updateVibes();
    }

    function updateVibes() {
        const vibesContainer = document.querySelector('.chat-vibes');
        if (!vibesContainer) return;
        const isHi = currentLanguage === 'hi';
        vibesContainer.innerHTML = isHi ? `
            <button class="vibe-chip" onclick="sendSuggestion('सरकारी अधिकारी और विभाग')">
                <span class="vibe-chip-emoji">🏛️</span> शासन
            </button>
            <button class="vibe-chip" onclick="sendSuggestion('पर्यटन स्थल और ऐतिहासिक जगहें')">
                <span class="vibe-chip-emoji">🏕️</span> पर्यटन
            </button>
            <button class="vibe-chip" onclick="sendSuggestion('आपातकालीन हेल्पलाइन और अस्पताल')">
                <span class="vibe-chip-emoji">🚨</span> आपातकाल
            </button>
            <button class="vibe-chip" onclick="sendSuggestion('जनगणना आंकड़े और जनसंख्या')">
                <span class="vibe-chip-emoji">📊</span> जनगणना
            </button>
            <button class="vibe-chip" onclick="sendSuggestion('सरकारी योजनाएं और सेवाएं')">
                <span class="vibe-chip-emoji">📋</span> योजनाएं
            </button>
            <button class="vibe-chip" onclick="sendSuggestion('भगवद गीता अध्याय 1 व्याख्या')">
                <span class="vibe-chip-emoji">📖</span> गीता AI
            </button>
        ` : `
            <button class="vibe-chip" onclick="sendSuggestion('Government officers and departments')">
                <span class="vibe-chip-emoji">🏛️</span> Governance
            </button>
            <button class="vibe-chip" onclick="sendSuggestion('Tourist places and heritage sites')">
                <span class="vibe-chip-emoji">🏕️</span> Tourism
            </button>
            <button class="vibe-chip" onclick="sendSuggestion('Emergency helplines and hospitals')">
                <span class="vibe-chip-emoji">🚨</span> Emergency
            </button>
            <button class="vibe-chip" onclick="sendSuggestion('Census data and population')">
                <span class="vibe-chip-emoji">📊</span> Census
            </button>
            <button class="vibe-chip" onclick="sendSuggestion('Government schemes and services')">
                <span class="vibe-chip-emoji">📋</span> Schemes
            </button>
            <button class="vibe-chip" onclick="sendSuggestion('Explain Bhagavad Gita Chapter 1')">
                <span class="vibe-chip-emoji">📖</span> Gita AI
            </button>
        `;
    }

    function init() {
        updateLangUI();
        updateCityUI();
        applyCityTheme();
        renderSidebarCities();
        renderChatHistory();
        handleURLParams();
        setupInputListeners();
        setupMobileMenu();
        updateSuggestions();
        startProximityWatch();
    }

    function handleURLParams() {
        const params = new URLSearchParams(window.location.search);
        const cityParam = params.get('city');
        if (cityParam) {
            const found = CITIES.find(c => c.id === cityParam || c.name.toLowerCase() === cityParam.toLowerCase());
            if (found) {
                currentCity = found;
                localStorage.setItem('cm_selected_city', JSON.stringify(found));
                updateCityUI();
                applyCityTheme();
            }
        }
        const query = params.get('q');
        if (query) {
            startNewChat();
            setTimeout(() => sendMessageText(query), 300);
        }
    }

    function setupInputListeners() {
        const input = $('chatInput');
        if (input) input.addEventListener('input', () => {
            $('sendBtn').disabled = input.value.trim() === '';
        });
    }

    function setupMobileMenu() {
        const menuBtn = $('mobileMenuBtn');
        const check = () => { if (menuBtn) menuBtn.style.display = window.innerWidth <= 768 ? 'block' : 'none'; };
        check();
        window.addEventListener('resize', check);
    }

    // ══════════════════════════════════
    // CITY THEMING
    // ══════════════════════════════════

    function applyCityTheme() {
        // Accent bar color
        const bar = $('cityThemeBar');
        if (bar) bar.style.background = currentCity.color;

        // CSS custom property for accent
        document.documentElement.style.setProperty('--city-accent', currentCity.color);
    }

    // ══════════════════════════════════
    // CITY MANAGEMENT
    // ══════════════════════════════════

    function updateCityUI() {
        const nameEl = $('sidebarCityName');
        const emojiEl = $('sidebarCityEmoji');
        if (nameEl) nameEl.textContent = currentCity.name;
        if (emojiEl) emojiEl.textContent = currentCity.emoji;
        const headerTitle = $('chatHeaderTitle');
        if (headerTitle && !activeConversationId) headerTitle.textContent = 'New chat';
    }

    function selectCity(cityId) {
        currentCity = CITIES.find(c => c.id === cityId) || CITIES[0];
        localStorage.setItem('cm_selected_city', JSON.stringify(currentCity));
        updateCityUI();
        applyCityTheme();
        updateSuggestions();
        closeSidebarCityPicker();
        startProximityWatch();
        // Reset to fresh welcome screen for the new city
        startNewChat();
    }

    function renderSidebarCities() {
        const list = $('sidebarCityList');
        if (!list) return;
        list.innerHTML = CITIES.map(c => `
            <div class="city-item ${c.id === currentCity.id ? 'active' : ''}" onclick="selectCity('${c.id}')">
                <span class="city-item-emoji">${c.emoji}</span>
                <span class="city-item-name">${c.name}</span>
                <span class="city-item-state">${c.state}</span>
            </div>
        `).join('');
    }

    window.filterSidebarCities = function (query) {
        const list = $('sidebarCityList');
        const q = query.toLowerCase();
        list.innerHTML = CITIES
            .filter(c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q))
            .map(c => `
                <div class="city-item ${c.id === currentCity.id ? 'active' : ''}" onclick="selectCity('${c.id}')">
                    <span class="city-item-emoji">${c.emoji}</span>
                    <span class="city-item-name">${c.name}</span>
                    <span class="city-item-state">${c.state}</span>
                </div>
            `).join('');
    };

    function updateSuggestions() {
        const el = $('chatSuggestions');
        if (!el) return;
        const city = currentCity.name;
        if (currentLanguage === 'hi') {
            el.innerHTML = `
                <button class="suggestion-card" onclick="sendSuggestion('${city} के उपायुक्त (DC) कौन हैं?')">${city} के उपायुक्त (DC) कौन हैं?</button>
                <button class="suggestion-card" onclick="sendSuggestion('${city} में आपातकालीन संपर्क')">${city} में आपातकालीन संपर्क</button>
                <button class="suggestion-card" onclick="sendSuggestion('${city} में घूमने की मुख्य जगहें')">${city} में घूमने की मुख्य जगहें</button>
                <button class="suggestion-card" onclick="sendSuggestion('${city} में सरकारी योजनाएं')">${city} में सरकारी योजनाएं</button>
            `;
        } else {
            el.innerHTML = `
                <button class="suggestion-card" onclick="sendSuggestion('Who is the DC of ${city}?')">Who is the DC of ${city}?</button>
                <button class="suggestion-card" onclick="sendSuggestion('Emergency contacts in ${city}')">Emergency contacts in ${city}</button>
                <button class="suggestion-card" onclick="sendSuggestion('Tourist places in ${city}')">Tourist places in ${city}</button>
                <button class="suggestion-card" onclick="sendSuggestion('Government schemes in ${city}')">Government schemes in ${city}</button>
            `;
        }
    }

    // ══════════════════════════════════
    // PROXIMITY ALERTS (GPS)
    // ══════════════════════════════════

    function startProximityWatch() {
        if (proximityWatchId) navigator.geolocation.clearWatch(proximityWatchId);
        if (!currentCity.features?.proximity || !currentCity.landmarks?.length) return;
        if (!navigator.geolocation) return;

        proximityWatchId = navigator.geolocation.watchPosition(
            pos => checkProximity(pos.coords.latitude, pos.coords.longitude),
            () => {},
            { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
        );
    }

    const alertedLandmarks = new Set();

    function checkProximity(lat, lng) {
        if (!currentCity.landmarks) return;
        currentCity.landmarks.forEach(lm => {
            const dist = getDistanceMeters(lat, lng, lm.lat, lm.lng);
            if (dist <= 500 && !alertedLandmarks.has(lm.name)) {
                alertedLandmarks.add(lm.name);
                showProximityToast(lm, Math.round(dist));
            }
        });
    }

    function getDistanceMeters(lat1, lng1, lat2, lng2) {
        const R = 6371e3;
        const p1 = lat1 * Math.PI / 180, p2 = lat2 * Math.PI / 180;
        const dp = (lat2 - lat1) * Math.PI / 180;
        const dl = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dp/2)**2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function showProximityToast(landmark, dist) {
        const toast = $('proximityToast');
        if (!toast) return;
        $('proximityIcon').textContent = landmark.icon;
        $('proximityTitle').textContent = `📍 You're near ${landmark.name}!`;
        $('proximityDesc').textContent = `${dist}m away — ${landmark.desc}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 8000);
    }

    window.dismissProximity = function () {
        const toast = $('proximityToast');
        if (toast) toast.classList.remove('show');
    };

    // ══════════════════════════════════
    // CONVERSATION MANAGEMENT
    // ══════════════════════════════════

    function generateId() {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    function startNewChat() {
        activeConversationId = null;
        $('chatWelcome').style.display = 'flex';
        $('chatConversation').classList.remove('active');
        $('chatConversation').innerHTML = '';
        $('chatInput').value = '';
        $('chatInput').focus();
        $('sendBtn').disabled = true;
        updateCityUI();
        updateSuggestions();
        $('chatHeaderTitle').textContent = 'New chat';
    }

    function saveConversations() {
        localStorage.setItem('cm_conversations', JSON.stringify(conversations));
    }

    function renderChatHistory() {
        const el = $('chatHistory');
        if (!el) return;
        const keys = Object.keys(conversations).sort((a, b) =>
            (conversations[b].updatedAt || 0) - (conversations[a].updatedAt || 0)
        );
        let html = '<div class="sidebar-section-label">RECENT</div>';
        keys.slice(0, 15).forEach(id => {
            const conv = conversations[id];
            html += `<div class="sidebar-chat-item ${id === activeConversationId ? 'active' : ''}" onclick="loadConversation('${id}')">${conv.title || 'New chat'}</div>`;
        });
        if (keys.length === 0) html += '<div style="padding:10px;color:rgba(255,255,255,0.2);font-size:12px;">No recent chats</div>';
        el.innerHTML = html;
    }

    function loadConversation(convId) {
        const conv = conversations[convId];
        if (!conv) return;
        activeConversationId = convId;
        $('chatWelcome').style.display = 'none';
        $('chatConversation').classList.add('active');
        $('chatConversation').innerHTML = '';
        conv.messages.forEach(msg => appendMessageBubble(msg.role, msg.role === 'bot' ? formatBotResponse(msg.content) : msg.content, msg.time, false));
        $('chatHeaderTitle').textContent = conv.title || 'Chat';
        renderChatHistory();
        scrollToBottom();
    }

    function clearCurrentChat() {
        if (activeConversationId) { delete conversations[activeConversationId]; saveConversations(); }
        startNewChat();
        renderChatHistory();
    }

    // ══════════════════════════════════
    // MESSAGE SENDING (n8n API)
    // ══════════════════════════════════

    async function sendMessageText(text) {
        if (!text.trim() || isProcessing) return;
        isProcessing = true;

        if (!activeConversationId) {
            activeConversationId = generateId();
            conversations[activeConversationId] = {
                title: text.substring(0, 40) + (text.length > 40 ? '...' : ''),
                messages: [], cityId: currentCity.id,
                createdAt: Date.now(), updatedAt: Date.now()
            };
            $('chatWelcome').style.display = 'none';
            $('chatConversation').classList.add('active');
        }
        $('chatHeaderTitle').textContent = conversations[activeConversationId].title;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        conversations[activeConversationId].messages.push({ role: 'user', content: text, time });
        conversations[activeConversationId].updatedAt = Date.now();
        saveConversations();
        renderChatHistory();

        appendMessageBubble('user', text, time);
        scrollToBottom();

        $('typingIndicator').classList.add('active');
        scrollToBottom();

        const isGita = isGitaQuery(text);
        const webhookUrl = isGita ? WEBHOOK_GITA : WEBHOOK_CHAT;

        const isHindi = currentLanguage === 'hi';
        const promptToSend = isHindi 
            ? `${text}\n\n(कृपया उत्तर हिंदी भाषा में देवें / Respond in Hindi language)` 
            : text;

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: promptToSend,
                    message: promptToSend,
                    user_query: text,
                    language: currentLanguage,
                    lang: currentLanguage,
                    city: currentCity.id
                })
            });
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const responseText = await response.text();
            if (!responseText.trim()) throw new Error('Empty response');

            const data = JSON.parse(responseText);
            let botContent;

            if (isGita) {
                botContent = data.answer || data.response || data.text || null;
                if (!botContent) throw new Error('Invalid Gita response');
                botContent = botContent.trim().replace(/\|\|\s*$/, '');
                const disc = currentLanguage === 'hi' ? '\n\n---\n_यह AI द्वारा उत्पन्न प्रतिक्रिया है।_' : '\n\n---\n_AI-generated response. Verify with scholars._';
                botContent = `📖 **Gita Wisdom**\n\n${botContent}${disc}`;
            } else {
                botContent = Array.isArray(data)
                    ? (data[0]?.response || data[0]?.text || null)
                    : (data.response || data.text || data.message || null);
                if (!botContent) throw new Error('Invalid response');
            }

            const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            conversations[activeConversationId].messages.push({ role: 'bot', content: botContent, time: botTime });
            saveConversations();

            $('typingIndicator').classList.remove('active');
            appendMessageBubble('bot', formatBotResponse(botContent), botTime);

        } catch (error) {
            console.error('Chat error:', error);
            $('typingIndicator').classList.remove('active');
            const errMsg = currentLanguage === 'hi' ? '⚠️ कुछ गड़बड़ हुई। पुनः प्रयास करें।' : '⚠️ Something went wrong. Try again.';
            appendMessageBubble('bot', errMsg, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }

        isProcessing = false;
        $('chatInput').value = '';
        $('chatInput').style.height = 'auto';
        $('sendBtn').disabled = true;
        scrollToBottom();
    }

    function isGitaQuery(text) {
        const keywords = ['gita', 'गीता', 'bhagavad', 'भगवद', 'shloka', 'श्लोक', 'karma yoga',
            'कर्म योग', 'arjuna', 'अर्जुन', 'krishna', 'कृष्ण', 'dharma', 'dhyana',
            'parikrama', 'परिक्रमा', '48 kos', '48 कोस', 'mahotsav', 'महोत्सव'];
        const lower = text.toLowerCase();
        return currentCity.features?.gita && keywords.some(k => lower.includes(k));
    }

    // ══════════════════════════════════
    // RESPONSE FORMATTING (UNIVERSAL)
    // ══════════════════════════════════

    function formatBotResponse(rawText) {
        if (!rawText) return '';

        // ══ STEP 1: Aggressive cleanup ══
        let t = rawText;

        // Strip ALL REPLACE_WITH_* placeholders
        t = t.replace(/REPLACE_WITH_[A-Z_]+/g, '');

        // Strip feedback/survey blocks completely (everything after "Help us improve")
        t = t.replace(/📊?\s*Help us [Ii]mprove!?[\s\S]*/g, '');
        t = t.replace(/\?\?\s*Help us [Ii]mprove!?[\s\S]*/g, '');
        t = t.replace(/\uFFFD\s*\?\?\s*Help[\s\S]*/g, '');
        t = t.replace(/Share your feedback:?[\s\S]*/gi, '');
        t = t.replace(/https:\/\/script\.google\.com[^\s\n]*/g, '');
        t = t.replace(/\?id=[a-zA-Z0-9_&=]*/g, '');

        // Convert bell character (\u0007) to bullet •  (n8n uses this!)
        t = t.replace(/\u0007/g, '•');

        // Strip corrupted emoji characters (?? sequences, \uFFFD etc.)
        t = t.replace(/\uFFFD/g, '');
        t = t.replace(/\?\?\s*\?\?/g, '');

        // Strip underscore/dash separators
        t = t.replace(/[_]{2,}/g, '');
        t = t.replace(/^[-—]{3,}$/gm, '');

        // Convert obfuscated emails: [at] → @, [dot] → .
        t = t.replace(/\[at\]/gi, '@').replace(/\[dot\]/gi, '.');

        // Convert markdown links: [text](url) and * **text**: url
        // Keep these for later processing

        // Clean multiple blank lines → max 1
        t = t.replace(/\n\s*\n\s*\n/g, '\n\n');
        t = t.trim();

        // If nearly empty after cleanup, show a fallback
        if (t.replace(/\s/g, '').length < 5) return '<em>No information available for this query.</em>';

        // ══ STEP 2: Parse into structured parts ══
        const lines = t.split('\n');
        let title = '';
        let contentBlocks = []; // Sequence: { type: 'paragraph', text: '...' } or { type: 'bullets', items: [...] }
        let fields = []; // { icon, label, value }
        let links = [];
        let allBulletItems = [];
        let currentBullets = null;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line) {
                if (currentBullets && currentBullets.items.length > 0) {
                    contentBlocks.push(currentBullets);
                    currentBullets = null;
                }
                continue;
            }

            // Skip pure separator lines
            if (/^[-—_=•]{2,}$/.test(line)) continue;
            if (/^REPLACE_WITH/.test(line)) continue;

            // ── Title: first **bold** line ──
            if (!title && /^\*\*(.+)\*\*$/.test(line)) {
                title = line.replace(/\*\*/g, '').trim();
                continue;
            }
            // First non-empty line as fallback title
            if (!title && i < 2 && line.length < 80 && !line.includes('http') && !line.startsWith('•') && !line.startsWith('-')) {
                title = line.replace(/\*\*/g, '').trim();
                continue;
            }

            // ── Strip **bold** markers for processing ──
            let cleanLine = line.replace(/\*\*/g, '');

            // ── Detect "He can be contacted at:" — skip this line ──
            if (/^He can be contacted at:?\s*$/i.test(cleanLine)) continue;
            if (/^contacted at:?\s*$/i.test(cleanLine)) continue;
            if (/^Contact:?\s*$/i.test(cleanLine)) continue;

            // ── Detect URLs ──
            const urlMatch = cleanLine.match(/(https?:\/\/[^\s]+)/);
            const plainDomain = cleanLine.match(/^(?:🔗\s*)?([a-z0-9-]+(?:\.[a-z]{2,}){1,2})\s*$/i);
            if (urlMatch && !/script\.google/.test(urlMatch[1])) {
                links.push(urlMatch[1]);
                const before = cleanLine.replace(urlMatch[0], '').trim();
                if (before && before.length > 3) {
                    if (currentBullets) { contentBlocks.push(currentBullets); currentBullets = null; }
                    contentBlocks.push({ type: 'paragraph', text: before });
                }
                continue;
            }
            if (plainDomain) {
                links.push('https://' + plainDomain[1]);
                continue;
            }

            // ── Detect email on its own line ──
            const emailAlone = cleanLine.match(/^(?:📧\s*)?([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,})\s*$/);
            if (emailAlone) {
                fields.push({ icon: '📧', label: 'Email', value: emailAlone[1] });
                continue;
            }

            // ── Detect phone number on its own line ──
            const phoneAlone = cleanLine.match(/^(?:📞\s*)?(?:Phone[:\s]*(?:number[:\s]*(?:is)?)?)?(\+?(?:91[-\s]?)?0?\d{2,5}[-\s]?\d{5,8})\.?\s*$/i);
            if (phoneAlone) {
                fields.push({ icon: '📞', label: 'Phone', value: phoneAlone[1].replace(/\.$/, '') });
                continue;
            }

            // ── Detect labeled fields (Key: Value pattern) ──
            const kvMatch = cleanLine.match(/^(?:([🏛📞📧🏢🕘📍🌐📋💰👤⚖️🏥🚨])\s*)?([A-Za-z][A-Za-z\s.]{1,20}?):\s*(.+)$/);
            if (kvMatch && kvMatch[3].length > 1) {
                const rawLabel = kvMatch[2].trim();
                const rawValue = kvMatch[3].trim();
                const emoji = kvMatch[1] || getFieldIcon(rawLabel);

                if (!/^(he can be|can be|is|was|the|and|but|or|as|at|in)/i.test(rawLabel)) {
                    fields.push({ icon: emoji, label: rawLabel, value: rawValue });
                    continue;
                }
            }

            // ── Detect bullet items (• or - or *) ──
            if (/^[•\-\*]\s+/.test(cleanLine) || (cleanLine.match(/•/g) || []).length >= 2) {
                const items = cleanLine.split(/\s*•\s*/).filter(Boolean);
                if (!currentBullets) {
                    currentBullets = { type: 'bullets', items: [] };
                }
                items.forEach(item => {
                    const clean = item.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').trim();
                    if (clean.length > 1) {
                        currentBullets.items.push(clean);
                        allBulletItems.push(clean);
                    }
                });
                continue;
            }

            // If we were collecting bullets and now hit regular paragraph text
            if (currentBullets && currentBullets.items.length > 0) {
                contentBlocks.push(currentBullets);
                currentBullets = null;
            }

            // ── Address-like lines (contains Sector, Secretariat, etc.) ──
            if (/(?:Mini Secretariat|Sector \d|D\.?C\.?\s*[Oo]ffice)/i.test(cleanLine)) {
                fields.push({ icon: '📍', label: 'Address', value: cleanLine.replace(/^D\.C\.?\s*[Oo]ffice,?\s*/i, '').trim() });
                continue;
            }

            // ── State + pincode lines ──
            if (/^(?:Haryana|Punjab|Rajasthan|Uttar Pradesh|Uttarakhand|Chandigarh)/i.test(cleanLine)) {
                const lastAddr = fields.findLast(f => f.icon === '📍');
                if (lastAddr) { lastAddr.value += ', ' + cleanLine; }
                else { fields.push({ icon: '📍', label: 'Location', value: cleanLine }); }
                continue;
            }

            // ── Remaining text → body paragraphs ──
            if (cleanLine.length > 2) {
                contentBlocks.push({ type: 'paragraph', text: cleanLine });
            }
        }

        if (currentBullets && currentBullets.items.length > 0) {
            contentBlocks.push(currentBullets);
        }

        // ── Helper: Is this an Entity Directory List vs Feature/Spec List ──
        function isEntityDirectory(cardTitle, items, fullText) {
            if (!items || items.length === 0) return false;
            const t = (cardTitle + ' ' + fullText).toLowerCase();
            
            // Explicit list title: "Tourist places in Kurukshetra", "कुरुक्षेत्र में घूमने की मुख्य जगहें", "List of departments", "Emergency Helplines"
            const isListTitle = /(?:घूमने की|पर्यटन स्थल|मुख्य जगहें|दर्शनीय स्थल|धरोहर स्थल|विभागों की सूची|अस्पतालों|योजनाओं|places to visit|tourist (?:places|attractions|spots)|list of|directory|departments|schemes|universities|colleges|emergency (?:numbers|helplines))/i.test(cardTitle);
            
            if (!isListTitle) {
                // If title is a single specific place/monument/person (e.g. "Mahabharat Anubhav Kendra", "Brahma Sarovar")
                return false;
            }

            // If title is a list title, check if items are short standalone entity names
            let descriptiveCount = 0;
            for (const item of items) {
                const words = item.trim().split(/\s+/);
                if (words.length > 5 || item.length > 38 || /(?:showing|delivering|explaining|equipped|accessible|download|recommended|provides|features|includes|during|located|experience|consists|contains)/i.test(item)) {
                    descriptiveCount++;
                }
            }
            return (descriptiveCount / items.length) < 0.3;
        }

        const isDir = isEntityDirectory(title, allBulletItems, t);

        // ══ STEP 3: Build beautiful HTML ══
        let html = '<div class="response-card">';

        // Header
        if (title) {
            html += `<div class="response-card-header"><span class="response-card-icon">${getTitleIcon(title)}</span> ${escHtml(title)}</div>`;
        }

        // Body Content (Rendered sequentially in natural order)
        if (contentBlocks.length > 0) {
            html += '<div class="response-card-body">';
            contentBlocks.forEach(block => {
                if (block.type === 'paragraph') {
                    const formatted = escHtml(block.text)
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/He can be contacted at:\s*/gi, '');
                    html += `<p class="response-para">${formatted}</p>`;
                } else if (block.type === 'bullets') {
                    if (isDir) {
                        // Directory items will be rendered as search pills in .response-tags
                    } else {
                        // Descriptive feature list for this specific place/topic
                        html += '<ul class="response-feature-list">';
                        block.items.forEach(item => {
                            html += `<li class="response-feature-item"><span class="rfi-icon">✦</span><span class="rfi-text">${escHtml(item.replace(/\*\*/g, ''))}</span></li>`;
                        });
                        html += '</ul>';
                    }
                }
            });
            html += '</div>';
        }

        // Fields (icon | label | value)
        if (fields.length > 0) {
            const HINDI_LABELS = {
                'EMAIL': 'ईमेल', 'Email': 'ईमेल',
                'PHONE': 'फ़ोन', 'Phone': 'फ़ोन',
                'LOCATION': 'स्थान', 'Location': 'स्थान',
                'ADDRESS': 'पता', 'Address': 'पता',
                'Deputy Commissioner': 'उपआयुक्त (DC)'
            };
            html += '<div class="response-card-fields">';
            fields.forEach(f => {
                let val = escHtml(f.value);
                if (f.icon === '📞') val = `<a href="tel:${f.value.replace(/[\s-]/g, '')}" class="response-link">${escHtml(f.value)}</a>`;
                if (f.icon === '📧') val = `<a href="mailto:${f.value}" class="response-link">${escHtml(f.value)}</a>`;
                const labelText = (currentLanguage === 'hi' && HINDI_LABELS[f.label]) ? HINDI_LABELS[f.label] : f.label;
                html += `<div class="response-field"><span class="rf-icon">${f.icon}</span><span class="rf-label">${escHtml(labelText)}</span><span class="rf-value">${val}</span></div>`;
            });
            html += '</div>';
        }

        // Clickable Explore Pills & Suggestions
        if (isDir && allBulletItems.length > 0) {
            // DIRECTORY LIST: Render places/departments as Search Pills!
            html += '<div class="response-tags">';
            allBulletItems.forEach(item => {
                const clean = item.replace(/\*\*/g, '').trim();
                if (clean.length > 1) {
                    const safeAttr = escHtml(clean).replace(/"/g, '&quot;');
                    html += `<button type="button" class="response-tag clickable-tag" onclick="askAboutTopic(this.getAttribute('data-query'))" data-query="${safeAttr}" title="Click to ask about: ${safeAttr}"><span class="tag-search-icon">🔍</span> ${escHtml(clean)}</button>`;
                }
            });
            html += '</div>';
        } else if (!isDir && title && title.length > 2 && title.length < 60) {
            // SPECIFIC DETAIL CARD: Render Smart Contextual Follow-Up Suggestions!
            const isHi = currentLanguage === 'hi';
            const cleanTitle = title.replace(/\*\*/g, '').trim();
            const suggestions = [];

            if (isHi) {
                suggestions.push({ label: `🗺️ ${cleanTitle} कैसे पहुंचें?`, query: `${cleanTitle} कैसे पहुंचें?` });
                suggestions.push({ label: `🕘 समय और टिकट`, query: `${cleanTitle} का समय और टिकट` });
                suggestions.push({ label: `🏛️ ${currentCity.nameHi || currentCity.name} के अन्य पर्यटन स्थल`, query: `${currentCity.nameHi || currentCity.name} में पर्यटन स्थल` });
            } else {
                suggestions.push({ label: `🗺️ How to reach ${cleanTitle}?`, query: `How to reach ${cleanTitle}?` });
                suggestions.push({ label: `🕘 Timings & Ticket`, query: `Timings and entry fee for ${cleanTitle}` });
                suggestions.push({ label: `🏛️ Other places in ${currentCity.name}`, query: `Tourist places in ${currentCity.name}` });
            }

            html += '<div class="response-tags response-followups">';
            suggestions.forEach(s => {
                const safeQuery = escHtml(s.query).replace(/"/g, '&quot;');
                html += `<button type="button" class="response-tag response-followup-pill" onclick="askAboutTopic(this.getAttribute('data-query'))" data-query="${safeQuery}" title="Ask: ${safeQuery}">${escHtml(s.label)}</button>`;
            });
            html += '</div>';
        }

        // Links
        if (links.length > 0) {
            html += '<div class="response-card-links">';
            links.forEach(url => {
                try {
                    const fullUrl = url.startsWith('http') ? url : 'https://' + url;
                    const host = new URL(fullUrl).hostname.replace('www.', '');
                    html += `<a href="${fullUrl}" target="_blank" rel="noopener" class="response-link-btn">🔗 ${host}</a>`;
                } catch {}
            });
            html += '</div>';
        }

        html += '</div>';

        // If card is essentially empty (only title), fall back to general
        if (!fields.length && !allBulletItems.length && !contentBlocks.length && !links.length) {
            return formatGeneralResponse(rawText);
        }

        return html;
    }

    // ── Helper: Get icon for field label ──
    function getFieldIcon(label) {
        const l = label.toLowerCase();
        if (/phone|tel|mobile|helpline|fax/.test(l)) return '📞';
        if (/email|e-mail|mail/.test(l)) return '📧';
        if (/address|office|location|place/.test(l)) return '📍';
        if (/time|timing|hours|open|close/.test(l)) return '🕘';
        if (/website|web|portal|url/.test(l)) return '🌐';
        if (/name|officer|dc|sdm|dm/.test(l)) return '👤';
        if (/designation|post|rank/.test(l)) return '🏛️';
        if (/fax/.test(l)) return '📠';
        return '📋';
    }

    // ── Helper: Get icon for card title ──
    function getTitleIcon(title) {
        const t = title.toLowerCase();
        if (/dc|commissioner|officer|sdm|dm/.test(t)) return '🏛️';
        if (/emergency|helpline|police|fire|ambulance/.test(t)) return '🚨';
        if (/department|government/.test(t)) return '📋';
        if (/tourist|tourism|place|visit|घूमने|स्थल/.test(t)) return '🏛️';
        if (/scheme|yojana|welfare/.test(t)) return '📝';
        if (/census|population|data/.test(t)) return '📊';
        if (/hospital|health|medical/.test(t)) return '🏥';
        if (/school|education|college/.test(t)) return '🎓';
        return '🏛️';
    }

    // ── Format: General text (fallback) ──
    function formatGeneralResponse(text) {
        let f = text;
        f = f.replace(/REPLACE_WITH_[A-Z_]+/g, '');
        f = f.replace(/https:\/\/script\.google\.com[^\s\n]*/g, '');
        f = f.replace(/[_]{2,}/g, '');
        f = f.replace(/[-—]{4,}/g, '<hr>');
        f = f.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        f = f.replace(/(^|\s)_(.+?)_(\s|$|<)/g, '$1<em>$2</em>$3');
        f = f.replace(/^[•\-\*]\s+(.+)$/gm, (match, itemText) => {
            const clean = itemText.replace(/<\/?[^>]+(>|$)/g, "").trim();
            const safeAttr = escHtml(clean).replace(/"/g, '&quot;');
            return `<li class="clickable-bullet" onclick="askAboutTopic(this.getAttribute('data-query') || this.innerText)" data-query="${safeAttr}" title="Click to ask about: ${safeAttr}">${itemText}</li>`;
        });
        f = f.replace(/((?:<li.*?<\/li>\s*)+)/g, '<ul class="interactive-bullets">$1</ul>');
        f = f.replace(/(^|[^"'>])(https?:\/\/[^\s<>"']+)/gm, (m, pre, url) => {
            if (/script\.google/.test(url)) return '';
            try { return `${pre}<a href="${url}" target="_blank" class="response-link">🔗 ${new URL(url).hostname.replace('www.','')}</a>`; }
            catch { return m; }
        });
        f = f.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" class="response-link">📧 $1</a>');
        f = f.replace(/(0\d{2,4})[-\s](\d{6,8})/g, '<a href="tel:$1$2" class="response-link">📞 $1-$2</a>');
        f = f.replace(/\n/g, '<br>');
        f = f.replace(/(<br\s*\/?>){3,}/g, '<br>');
        return f;
    }

    function escHtml(text) {
        const d = document.createElement('div');
        d.textContent = (text || '');
        return d.innerHTML;
    }

    // ══════════════════════════════════
    // MESSAGE RENDERING
    // ══════════════════════════════════

    function appendMessageBubble(role, content, time, animate = true) {
        const row = document.createElement('div');
        row.className = `msg-row ${role}`;

        if (role === 'user') {
            row.innerHTML = `
                <div class="msg-content" style="margin-left:auto;">
                    <div class="msg-bubble user">${escapeHtml(content)}</div>
                    <div class="msg-time" style="text-align:right;">${time}</div>
                </div>`;
        } else {
            row.innerHTML = `
                <div class="msg-avatar bot-avatar" style="background:${currentCity.color};">✦</div>
                <div class="msg-content">
                    <div class="msg-sender">${currentCity.name} Guide <span class="powered">✦ CityMitra</span></div>
                    <div class="msg-bubble bot">${content}</div>
                    <div class="msg-time">${time}</div>
                    <div class="msg-actions">
                        <button class="msg-action-btn" onclick="copyMessage(this)">📋 Copy</button>
                        <button class="msg-action-btn" onclick="speakMessage(this)">🔊 Listen</button>
                    </div>
                </div>`;
        }

        $('chatConversation').appendChild(row);
        if (animate) row.style.animation = 'fade-in-up 0.3s ease forwards';
    }

    function escapeHtml(text) {
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    function scrollToBottom() {
        const el = $('chatMessages');
        setTimeout(() => { if (el) el.scrollTop = el.scrollHeight; }, 50);
    }

    // ══════════════════════════════════
    // UI HELPERS
    // ══════════════════════════════════

    window.sendMessage = () => { const t = $('chatInput').value.trim(); if (t) sendMessageText(t); };
    window.sendSuggestion = text => sendMessageText(text);

    // Auto-fill query into chat box and immediately search
    window.askAboutTopic = function (topic) {
        if (!topic) return;
        let clean = String(topic)
            .replace(/^[🔍✨🏛️🛕📍•\-\*]\s*/u, '')
            .replace(/<[^>]*>/g, '')
            .trim();
        if (!clean) return;

        const input = $('chatInput');
        if (input) {
            input.value = clean;
            input.style.height = 'auto';
            input.focus();
        }

        // Trigger search directly in chatbot
        sendMessageText(clean);
    };

    window.handleInputKeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
    window.autoResizeTextarea = el => { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 100) + 'px'; };

    window.toggleLanguage = function () {
        currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
        localStorage.setItem('cm_language', currentLanguage);
        updateLangUI();
    };

    window.startNewChat = startNewChat;
    window.loadConversation = loadConversation;
    window.clearCurrentChat = clearCurrentChat;
    window.selectCity = selectCity;

    window.toggleSidebar = () => { $('chatSidebar').classList.toggle('open'); $('sidebarOverlay').classList.toggle('active'); };
    window.closeSidebar = () => { $('chatSidebar').classList.remove('open'); $('sidebarOverlay').classList.remove('active'); };

    window.toggleSidebarCityPicker = function () {
        const dd = $('sidebarCityDropdown');
        dd.classList.toggle('open');
    };

    function closeSidebarCityPicker() {
        const dd = $('sidebarCityDropdown');
        if (dd) dd.classList.remove('open');
        renderSidebarCities();
    }

    window.copyMessage = function (btn) {
        const text = btn.closest('.msg-content').querySelector('.msg-bubble').textContent;
        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = '✅ Copied';
            setTimeout(() => { btn.innerHTML = '📋 Copy'; }, 2000);
        });
    };

    window.speakMessage = function (btn) {
        const text = btn.closest('.msg-content').querySelector('.msg-bubble').textContent;
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
            speechSynthesis.speak(u);
            btn.textContent = '🔇 Stop';
            u.onend = () => { btn.innerHTML = '🔊 Listen'; };
        }
    };

    document.addEventListener('DOMContentLoaded', init);
})();
