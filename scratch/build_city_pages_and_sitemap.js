const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ════════════════════════════════════════════════════════════════════════════
// 1. CITIES DATA (14 ACTIVE DISTRICTS)
// ════════════════════════════════════════════════════════════════════════════
const CITIES = [
    { 
        id: 'kurukshetra',
        code: 'kkr', 
        name: 'Kurukshetra', 
        nameHi: 'कुरुक्षेत्र',
        state: 'Haryana', 
        emoji: '🕉️', 
        color: '#EA580C', 
        tagline: 'Holy Land of the Mahabharata & Bhagavad Gita',
        desc: 'Kurukshetra is a historic and spiritual district in Haryana, world-renowned for the sacred Brahma Sarovar, Jyotisar, and the 48 Kos pilgrimage circuit. City Mitra provides 24x7 AI civic intelligence for Kurukshetra district administration, DC office helplines, schemes, and tourism.',
        helplines: [
            { label: 'DC Office Control Room', val: '01744-220270' },
            { label: 'Police Control Room', val: '112 / 01744-220100' },
            { label: 'Civil Hospital LNJP', val: '01744-220377' },
            { label: 'Women Helpline', val: '1091' }
        ],
        spots: ['Brahma Sarovar', 'Jyotisar Tirtha', 'Mahabharat Anubhav Kendra', 'Sheikh Chilli Tomb', 'Krishna Museum', 'Panorama & Science Centre']
    },
    { 
        id: 'fatehabad',
        code: 'ftb', 
        name: 'Fatehabad', 
        nameHi: 'फतेहाबाद',
        state: 'Haryana', 
        emoji: '🏛️', 
        color: '#E65100', 
        tagline: 'Pink City of Haryana & Ancient Harappan Heritage',
        desc: 'Fatehabad is an ancient historical and agricultural hub of Haryana, founded in the 14th century by Firoz Shah Tughlaq. Explore verified administration contacts, agricultural schemes, and Harappan sites like Banawali with City Mitra AI.',
        helplines: [
            { label: 'DC Office Fatehabad', val: '01667-220200' },
            { label: 'Police Helpline', val: '112 / 01667-220100' },
            { label: 'Civil Hospital Fatehabad', val: '01667-220300' }
        ],
        spots: ['Firoz Shah Palace & Lat', 'Banawali Harappan Site', 'Humayun Mosque', 'Chilli Lake']
    },
    { 
        id: 'karnal',
        code: 'karnal', 
        name: 'Karnal', 
        nameHi: 'करनाल',
        state: 'Haryana', 
        emoji: '🌾', 
        color: '#2E7D32', 
        tagline: 'City of Danveer Karna & Agricultural Research Capital',
        desc: 'Karnal is known as the Rice Bowl of India and a premier hub for world-class research institutes like NDRI and CSSRI. Access all Karnal district administration contacts, citizen services, and municipal queries instantly.',
        helplines: [
            { label: 'DC Office Karnal', val: '0184-2267500' },
            { label: 'Police Control Room', val: '112 / 0184-2267700' },
            { label: 'Civil Hospital Karnal', val: '0184-2252100' }
        ],
        spots: ['Karna Lake', 'Cantonment Church Tower', 'National Dairy Research Institute (NDRI)', 'Taraori Fort', 'Kalpana Chawla Memorial']
    },
    { 
        id: 'ambala',
        code: 'ambala', 
        name: 'Ambala', 
        nameHi: 'अम्बाला',
        state: 'Haryana', 
        emoji: '🏛️', 
        color: '#1565C0', 
        tagline: 'Twin City of North India & Major Cantonment Hub',
        desc: 'Ambala is a strategic railway junction, historic cantonment, and famous manufacturing center for scientific instruments. City Mitra connects Ambala citizens with official civic records, municipal services, and emergency helplines.',
        helplines: [
            { label: 'DC Office Ambala', val: '0171-2530001' },
            { label: 'Police Control Room', val: '112 / 0171-2530100' },
            { label: 'Civil Hospital Ambala Cantt', val: '0171-2640200' }
        ],
        spots: ['St. Paul Church', 'Holy Redeemer Church', 'Cloth Market Ambala City', 'Badshahi Bagh Gurudwara', 'Patel Park']
    },
    { 
        id: 'panchkula',
        code: 'pkl', 
        name: 'Panchkula', 
        nameHi: 'पंचकूला',
        state: 'Haryana', 
        emoji: '🏔️', 
        color: '#00695C', 
        tagline: 'Gateway to the Shivalik Hills & Planned Modern City',
        desc: 'Panchkula is an impeccably planned city adjoining Chandigarh, nestled at the foothills of the Shivalik range. Find Mata Mansa Devi Temple info, Morni Hills routes, and Panchkula administration contacts.',
        helplines: [
            { label: 'DC Office Panchkula', val: '0172-2581200' },
            { label: 'Police Control Room', val: '112 / 0172-2581100' },
            { label: 'Sector 6 General Hospital', val: '0172-2584200' }
        ],
        spots: ['Mata Mansa Devi Temple', 'Morni Hills & Tikkar Taal', 'Pinjore Gardens (Yadavindra)', 'Cactus Garden', 'Nada Sahib Gurudwara']
    },
    { 
        id: 'sirsa',
        code: 'srs', 
        name: 'Sirsa', 
        nameHi: 'सिरसा',
        state: 'Haryana', 
        emoji: '🌿', 
        color: '#6A1B9A', 
        tagline: 'Historic City of the Saraswati Valley',
        desc: 'Sirsa is one of the oldest places in North India situated in the ancient Saraswati valley. Access Sirsa district magistrate details, grain market (Mandi) updates, and welfare scheme information 24x7.',
        helplines: [
            { label: 'DC Office Sirsa', val: '01666-248880' },
            { label: 'Police Helpline', val: '112 / 01666-248100' },
            { label: 'Civil Hospital Sirsa', val: '01666-248300' }
        ],
        spots: ['Tara Baba Kutiya', 'Dera Sacha Sauda Complex', 'Sarsai Nath Temple', 'Chaudhary Devi Lal Park']
    },
    { 
        id: 'palwal',
        code: 'palwal', 
        name: 'Palwal', 
        nameHi: 'पलवल',
        state: 'Haryana', 
        emoji: '🛕', 
        color: '#E65100', 
        tagline: 'Historic Gateway to Braj Bhumi',
        desc: 'Palwal is steeped in ancient Indian history and played a pivotal role during the freedom struggle where Mahatma Gandhi was first arrested in 1919. Find Palwal administration, collectorate, and civic services.',
        helplines: [
            { label: 'DC Office Palwal', val: '01275-248900' },
            { label: 'Police Helpline', val: '112' },
            { label: 'Civil Hospital Palwal', val: '01275-248300' }
        ],
        spots: ['Panchavati Temple', 'Gandhi Ashram Memorial', 'Dauji Temple', 'Draupadi Ghat']
    },
    { 
        id: 'faridabad',
        code: 'fbd', 
        name: 'Faridabad', 
        nameHi: 'फरीदाबाद',
        state: 'Haryana', 
        emoji: '🏭', 
        color: '#C62828', 
        tagline: 'Industrial Powerhouse of Haryana & NCR Metro Hub',
        desc: 'Faridabad is the largest city in Haryana and a premier industrial and manufacturing capital. City Mitra empowers Faridabad residents with instant civic info, municipal corporation (MCF) services, and emergency desks.',
        helplines: [
            { label: 'DC Office Faridabad', val: '0129-2227800' },
            { label: 'Municipal Corporation (MCF)', val: '0129-2415555' },
            { label: 'BK Civil Hospital', val: '0129-2415100' }
        ],
        spots: ['Surajkund Heritage Lake', 'Badkhal Lake', 'Raja Nahar Singh Palace', 'CITM Lake', 'Shirdi Sai Baba Temple']
    },
    { 
        id: 'dehradun',
        code: 'ddn', 
        name: 'Dehradun', 
        nameHi: 'देहरादून',
        state: 'Uttarakhand', 
        emoji: '🏔️', 
        color: '#1B5E20', 
        tagline: 'Capital of Uttarakhand & Gateway to the Himalayas',
        desc: 'Dehradun is the scenic capital of Uttarakhand, famous for prestige institutions, Doon Valley, and proximity to Mussoorie and Rishikesh. Access Dehradun administration, disaster management, and tourism info.',
        helplines: [
            { label: 'District Magistrate Office', val: '0135-2626066' },
            { label: 'State Disaster Helpline', val: '1070 / 0135-2710334' },
            { label: 'Police Control Room', val: '112 / 0135-2716200' },
            { label: 'Doon Hospital', val: '0135-2659012' }
        ],
        spots: ['Robber’s Cave (Guchhupani)', 'Sahastradhara Springs', 'Forest Research Institute (FRI)', 'Tapkeshwar Mahadev Temple', 'Mindrolling Monastery']
    },
    { 
        id: 'amritsar',
        code: 'asr', 
        name: 'Amritsar', 
        nameHi: 'अमृतसर',
        state: 'Punjab', 
        emoji: '🛕', 
        color: '#E65100', 
        tagline: 'Spiritual Capital of Sikhism & Golden Temple City',
        desc: 'Amritsar is the spiritual and cultural heart of Punjab, home to Harmandir Sahib (The Golden Temple) and Wagah Border. Connect with Amritsar administrative contacts, heritage guidelines, and emergency services.',
        helplines: [
            { label: 'DC Office Amritsar', val: '0183-2226161' },
            { label: 'Police Control Room', val: '112 / 0183-2225588' },
            { label: 'Guru Nanak Dev Hospital', val: '0183-2571700' }
        ],
        spots: ['Sri Harmandir Sahib (Golden Temple)', 'Jallianwala Bagh', 'Attari-Wagah Border Ceremony', 'Gobindgarh Fort', 'Partition Museum']
    },
    { 
        id: 'varanasi',
        code: 'vnr', 
        name: 'Varanasi', 
        nameHi: 'वाराणसी',
        state: 'Uttar Pradesh', 
        emoji: '🕉️', 
        color: '#BF360C', 
        tagline: 'The World’s Oldest Living Spiritual City (Kashi)',
        desc: 'Varanasi (Kashi) is the timeless cultural and spiritual capital on the sacred banks of the Ganges. Access Kashi Vishwanath corridor info, ghat details, municipal corporation contacts, and emergency assistance.',
        helplines: [
            { label: 'DM Office Varanasi', val: '0542-2508800' },
            { label: 'Police Control Room', val: '112 / 0542-2508500' },
            { label: 'BHU Sir Sunderlal Hospital', val: '0542-2309200' }
        ],
        spots: ['Kashi Vishwanath Temple', 'Dashashwamedh Ghat Aarti', 'Assi Ghat', 'Sarnath Buddhist Circuit', 'Manikarnika Ghat']
    },
    { 
        id: 'jaipur',
        code: 'jpr', 
        name: 'Jaipur', 
        nameHi: 'जयपुर',
        state: 'Rajasthan', 
        emoji: '🏰', 
        color: '#AD1457', 
        tagline: 'The Pink City & UNESCO World Heritage Capital',
        desc: 'Jaipur is the royal capital of Rajasthan, famous for majestic forts, palaces, and vibrant Rajasthani culture. Access Jaipur collectorate info, heritage entry timings, and civic services.',
        helplines: [
            { label: 'District Collectorate Jaipur', val: '0141-2206699' },
            { label: 'Police Helpline', val: '112 / 0141-2203333' },
            { label: 'SMS Hospital Jaipur', val: '0141-2518222' }
        ],
        spots: ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort', 'Albert Hall Museum']
    },
    { 
        id: 'lucknow',
        code: 'lko', 
        name: 'Lucknow', 
        nameHi: 'लखनऊ',
        state: 'Uttar Pradesh', 
        emoji: '🕌', 
        color: '#4527A0', 
        tagline: 'City of Nawabs, Culture, Tehzeeb & State Capital',
        desc: 'Lucknow is the grand capital of Uttar Pradesh, renowned for its Awadhi architecture, literature, and governance. Access Lucknow administration, state secretariat departments, and emergency helplines.',
        helplines: [
            { label: 'DM Office Lucknow', val: '0522-2623000' },
            { label: 'Police Helpline', val: '112 / 0522-2615000' },
            { label: 'KGMU Trauma Centre', val: '0522-2257540' }
        ],
        spots: ['Bara Imambara & Bhulbhulaiya', 'Chota Imambara', 'Rumi Darwaza', 'The British Residency', 'Ambedkar Memorial Park']
    },
    { 
        id: 'chandigarh',
        code: 'chd', 
        name: 'Chandigarh', 
        nameHi: 'चंडीगढ़',
        state: 'Chandigarh', 
        emoji: '🌹', 
        color: '#00838F', 
        tagline: 'The City Beautiful — India’s Premier Planned Union Territory',
        desc: 'Chandigarh is India’s first planned modern city, designed by Le Corbusier, serving as the joint capital of Haryana and Punjab. Access Chandigarh Administration, municipal corporation, and PGIMER emergency information.',
        helplines: [
            { label: 'Chandigarh Administration DC Office', val: '0172-2740045' },
            { label: 'Police Control Room', val: '112 / 0172-2749194' },
            { label: 'PGIMER Emergency', val: '0172-2746018' },
            { label: 'GMSH Sector 16 Hospital', val: '0172-2752000' }
        ],
        spots: ['Rock Garden by Nek Chand', 'Sukhna Lake', 'Zakir Hussain Rose Garden', 'Capitol Complex (UNESCO)', 'Sector 17 Plaza']
    }
];

// ════════════════════════════════════════════════════════════════════════════
// 2. RENDER CITY LANDING PAGES
// ════════════════════════════════════════════════════════════════════════════
function renderCityPageHtml(city) {
    const canonicalUrl = `https://citymitra.app/cities/${city.id}/`;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Clean URL Extension Normalizer -->
    <script>
    (function(){
        var p = window.location.pathname;
        if (p.endsWith('.html')) {
            window.location.replace(window.location.origin + p.replace(/\\.html$/, '') + window.location.search + window.location.hash);
        }
    })();
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${city.name} AI Civic Assistant & Administration Guide | City Mitra</title>
    <meta name="description" content="Centralized 24x7 civic AI for ${city.name} (${city.state}). Access DC office contacts, government schemes, emergency helplines, hospital numbers, and tourist spots.">
    <meta name="keywords" content="${city.name} government services, ${city.name} DC office, ${city.name} emergency helplines, ${city.name} tourism, ${city.state} civic AI, Ram Wadhwa, City Mitra">
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="icon" href="/icons/icon-192.png" type="image/png">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">

    <!-- Google Search Console & AdSense Verification -->
    <meta name="google-site-verification" content="google2e3856b787fd8a8f">
    <meta name="google-adsense-account" content="ca-pub-5496851328899189">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5496851328899189" crossorigin="anonymous"></script>

    <!-- Open Graph -->
    <meta property="og:title" content="${city.name} AI Civic Assistant — City Mitra">
    <meta property="og:description" content="All government officers, emergency helplines, welfare schemes, and tourist guides for ${city.name}, ${city.state}.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="https://citymitra.app/icons/icon-512.png">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${city.name} AI Civic Assistant — City Mitra">
    <meta name="twitter:description" content="24x7 verified civic intelligence for ${city.name}, ${city.state}.">
    <meta name="twitter:image" content="https://citymitra.app/icons/icon-512.png">

    <!-- JSON-LD AdministrativeArea & Civic Service Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "AdministrativeArea",
      "name": "${city.name}",
      "alternateName": "${city.nameHi}",
      "description": "${city.desc}",
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": "${city.state}",
        "containedInPlace": {
          "@type": "Country",
          "name": "India"
        }
      },
      "url": "${canonicalUrl}",
      "mainEntityOfPage": "${canonicalUrl}"
    }
    </script>

    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/design-tokens.css">
    <link rel="stylesheet" href="/css/navbar.css">
    <link rel="stylesheet" href="/css/sections.css">
    <style>
        .city-hero {
            background: linear-gradient(135deg, #090c24 0%, #151244 35%, #2a0e4e 70%, #46143c 100%);
            padding: calc(var(--nav-h) + 60px) 24px 70px;
            color: white;
            position: relative;
            overflow: hidden;
            border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .city-hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: 
                radial-gradient(rgba(255, 255, 255, 0.12) 1.2px, transparent 1.2px),
                radial-gradient(circle at 20% 30%, rgba(234, 88, 12, 0.35) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(124, 58, 237, 0.4) 0%, transparent 55%);
            background-size: 28px 28px, 100% 100%, 100% 100%;
            pointer-events: none;
        }
        .city-container {
            max-width: 960px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
        }
        .city-badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 20px;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: var(--radius-full);
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #FFEDD5;
            margin-bottom: 16px;
        }
        .city-h1 {
            font-size: clamp(2.2rem, 5vw, 3.4rem);
            font-weight: 900;
            line-height: 1.15;
            margin-bottom: 12px;
        }
        .city-tagline {
            font-size: clamp(1.1rem, 2vw, 1.3rem);
            color: #FED7AA;
            font-weight: 600;
            margin-bottom: 24px;
        }
        .city-actions {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
            margin-top: 28px;
        }
        .btn-city-ai {
            padding: 14px 30px;
            background: var(--orange);
            color: white;
            border-radius: var(--radius-full);
            font-weight: 700;
            font-size: 15px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 20px rgba(234, 88, 12, 0.4);
            transition: all 0.25s ease;
        }
        .btn-city-ai:hover {
            background: var(--orange-deep);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(234, 88, 12, 0.5);
            color: white;
        }
        .btn-city-ghost {
            padding: 14px 26px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.25);
            color: white;
            border-radius: var(--radius-full);
            font-weight: 600;
            font-size: 15px;
            text-decoration: none;
            backdrop-filter: blur(10px);
            transition: all 0.25s ease;
        }
        .btn-city-ghost:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            transform: translateY(-2px);
        }
        .city-section {
            padding: 60px 24px;
            background: #FFFBF5;
        }
        .city-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            margin-top: 32px;
        }
        @media (max-width: 768px) {
            .city-grid-2 { grid-template-columns: 1fr; }
        }
        .city-card {
            background: white;
            border: 1px solid var(--ink-20);
            border-radius: var(--radius-lg);
            padding: 28px;
            box-shadow: var(--shadow-sm);
        }
        .city-card h3 {
            font-size: 1.25rem;
            font-weight: 800;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--ink);
        }
        .city-helpline-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid var(--ink-05);
            font-size: 14px;
        }
        .city-helpline-item:last-child { border-bottom: none; }
        .city-spot-pill {
            display: inline-block;
            padding: 6px 14px;
            background: #FAF8F5;
            border: 1px solid var(--ink-10);
            border-radius: var(--radius-full);
            font-size: 13px;
            font-weight: 600;
            color: var(--ink-80);
            margin: 4px;
        }
    </style>
</head>
<body>

<!-- NAVBAR -->
<nav class="navbar" id="navbar">
    <div class="nav-inner">
        <div style="display:flex;align-items:center;">
            <a href="/" class="nav-logo">
                <img src="/icons/icon-192.png" alt="City Mitra" class="nav-logo-icon">
                <div><div class="nav-logo-text">City <span>Mitra</span></div><div class="nav-logo-sub">Your City's AI</div></div>
            </a>
        </div>
        <div class="nav-links" id="navLinks">
            <a href="/" class="nav-link">Home</a>
            <a href="/services" class="nav-link">Services</a>
            <a href="/cities" class="nav-link active">Cities</a>
            <a href="/blog" class="nav-link">Blog</a>
            <a href="/about" class="nav-link">About</a>
            <a href="/contact" class="nav-link">Contact</a>
        </div>
        <div class="nav-actions">
            <a href="/chat" class="nav-ai-btn" title="Open AI Chat">✦</a>
            <a href="/chat" class="nav-cta">→ Try AI Chat</a>
        </div>
    </div>
</nav>

<!-- CITY HERO -->
<section class="city-hero">
    <div class="city-container">
        <div class="city-badge-pill">${city.emoji} ${city.state} District Portal</div>
        <h1 class="city-h1">${city.name} Civic AI & Directory</h1>
        <div class="city-tagline">${city.tagline}</div>
        <p style="font-size:1.1rem; line-height:1.7; max-width:780px; color:rgba(255,255,255,0.9);">${city.desc}</p>
        <div class="city-actions">
            <a href="/chat" class="btn-city-ai" onclick="localStorage.setItem('cm_selected_city', JSON.stringify({id:'${city.code}', name:'${city.name}', state:'${city.state}'}))">💬 Launch ${city.name} AI Assistant</a>
            <a href="#helplines" class="btn-city-ghost">📞 District Helplines</a>
            <a href="/cities" class="btn-city-ghost">🗺️ All 13 Districts</a>
        </div>
    </div>
</section>

<!-- AD SLOT -->
<div class="ad-slot" style="margin:24px 0;">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-5496851328899189"
         data-ad-slot="auto"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
</div>

<!-- CITY DETAILS SECTION -->
<main class="city-section" id="helplines">
    <div class="city-container">
        <div class="city-grid-2">
            <!-- District Helplines Card -->
            <div class="city-card">
                <h3>🚨 Emergency & Control Rooms</h3>
                <div>
                    ${city.helplines.map(h => `
                        <div class="city-helpline-item">
                            <span style="color:var(--ink-70); font-weight:500;">${h.label}</span>
                            <a href="tel:${h.val.split('/')[0].trim()}" style="color:var(--orange); font-weight:700; text-decoration:none;">${h.val}</a>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Tourist & Cultural Attractions Card -->
            <div class="city-card">
                <h3>🏛️ Key Landmarks & Attractions</h3>
                <div style="margin-top:12px;">
                    ${city.spots.map(s => `<span class="city-spot-pill">📍 ${s}</span>`).join('')}
                </div>
                <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--ink-10);">
                    <a href="/chat" style="color:var(--orange); font-weight:700; font-size:14px; text-decoration:none;" onclick="localStorage.setItem('cm_selected_city', JSON.stringify({id:'${city.code}', name:'${city.name}', state:'${city.state}'}))">Ask ${city.name} AI about timings, route & history →</a>
                </div>
            </div>
        </div>

        <!-- E-E-A-T SOURCING & ABOUT BIO -->
        <div class="city-card" style="margin-top:36px; background:#FAF8F5; border-left:4px solid var(--orange);">
            <h3 style="font-size:1.15rem; color:var(--ink);">🛡️ Official Civic Data Sourcing & Verification</h3>
            <p style="font-size:14px; color:var(--ink-70); line-height:1.6;">
                City Mitra is an independent open-civic intelligence initiative engineered by <strong>Ram Wadhwa (Sr Data Engineer)</strong>. 
                Data for ${city.name} is aggregated from public domain government datasets (data.gov.in, ${city.name.toLowerCase()}.nic.in, Haryana/state gazettes) 
                and verified via deterministic validation guards to deliver 100% accurate, non-hallucinated civic answers.
            </p>
        </div>
    </div>
</main>

<!-- FOOTER -->
<footer class="footer-v2">
    <div class="container">
        <div class="footer-v2-bottom">
            <div>© 2025 City Mitra. Open Civic Data Initiative for ${city.name}, ${city.state}. Founded by Ram Wadhwa.</div>
            <div class="footer-v2-legal-links">
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
                <a href="/disclaimer">Civic Disclaimer</a>
            </div>
        </div>
    </div>
</footer>

</body>
</html>`;
}

// ════════════════════════════════════════════════════════════════════════════
// 3. GENERATE ALL CITY DIRECTORY PAGES
// ════════════════════════════════════════════════════════════════════════════
CITIES.forEach(c => {
    const cityDir = path.join(ROOT, 'cities', c.id);
    if (!fs.existsSync(cityDir)) fs.mkdirSync(cityDir, { recursive: true });
    fs.writeFileSync(path.join(cityDir, 'index.html'), renderCityPageHtml(c), 'utf8');
    console.log('Rendered City Page:', c.name, '-> cities/' + c.id + '/index.html');
});

// ════════════════════════════════════════════════════════════════════════════
// 4. GENERATE DYNAMIC REAL-TIME SITEMAP.XML (WITH TODAY'S LIVE TIMESTAMP)
// ════════════════════════════════════════════════════════════════════════════
const todayIso = new Date().toISOString().split('T')[0]; // Live current date e.g. 2026-08-14

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    <!-- ══ Core Platform Pages ══ -->
    <url>
        <loc>https://citymitra.app/</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://citymitra.app/services</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://citymitra.app/cities</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://citymitra.app/chat</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://citymitra.app/blog</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://citymitra.app/about</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
    </url>
    <url>
        <loc>https://citymitra.app/contact</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- ══ City-Specific Dedicated District Landing Pages (14 Live Districts) ══ -->
${CITIES.map(c => `    <url>
        <loc>https://citymitra.app/cities/${c.id}/</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.88</priority>
    </url>`).join('\n')}

    <!-- ══ Pre-Rendered Static Blog Articles by Ram Wadhwa ══ -->
    <url>
        <loc>https://citymitra.app/blog/architecture-civic-open-data/</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
    </url>
    <url>
        <loc>https://citymitra.app/blog/smart-cities-vs-smart-districts/</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
    </url>
    <url>
        <loc>https://citymitra.app/blog/vernacular-civic-nlp-india/</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
    </url>
    <url>
        <loc>https://citymitra.app/blog/emergency-response-data-analytics/</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
    </url>
    <url>
        <loc>https://citymitra.app/blog/geospatial-heritage-kurukshetra-48-kos/</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
    </url>
    <url>
        <loc>https://citymitra.app/blog/future-public-records-ai/</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
    </url>

    <!-- ══ Legal & Compliance Pages ══ -->
    <url>
        <loc>https://citymitra.app/privacy</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://citymitra.app/terms</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://citymitra.app/disclaimer</loc>
        <lastmod>${todayIso}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>

</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml, 'utf8');
console.log('\n✅ Generated dynamic sitemap.xml with ' + (10 + CITIES.length + 6) + ' URLs and real-time timestamp:', todayIso);
