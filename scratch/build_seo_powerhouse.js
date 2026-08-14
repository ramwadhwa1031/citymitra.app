const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ════════════════════════════════════════════════════════════════════════════
// 1. UPDATE ROBOTS.TXT
// ════════════════════════════════════════════════════════════════════════════
const robotsTxt = `User-agent: *
Allow: /

User-agent: Mediapartners-Google
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://citymitra.app/sitemap.xml
`;
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robotsTxt, 'utf8');
console.log('Updated robots.txt');

// ════════════════════════════════════════════════════════════════════════════
// 2. BLOG POSTS DATA
// ════════════════════════════════════════════════════════════════════════════
const BLOG_POSTS = [
    {
        id: 'architecture-civic-open-data',
        title: 'Architecting City Mitra: Ingesting, Normalizing & Serving Civic Open Data Across 13 Indian Districts',
        slug: 'architecting-civic-open-data-across-indian-districts',
        category: 'Data Engineering',
        readTime: '7 min read',
        date: 'May 12, 2025',
        isoDate: '2025-05-12T10:00:00+05:30',
        author: {
            name: 'Ram Wadhwa',
            role: 'Sr Data Engineer & Founder, City Mitra',
            bio: 'Ram is a Senior Data Engineer specializing in distributed real-time systems, civic data pipelines, and vernacular AI architecture.',
            avatar: '/icons/icon-192.png'
        },
        summary: 'A deep dive into the technical architecture powering City Mitra. Learn how we ingest fragmented government tables, handle OCR on multilingual circulars, and deliver sub-100ms civic query responses.',
        tags: ['Data Engineering', 'System Architecture', 'Civic Tech', 'Open Data', 'ETL Pipelines'],
        content: `
            <h2>The Data Bottleneck in Indian Public Administration</h2>
            <p>India is home to over 780 districts, each governed through hundreds of municipal departments, state administration bodies, and union ministries. While the Digital India initiative has made tremendous strides in publishing data online, the fundamental problem remains: <strong>data fragmentation and lack of semantic normalization</strong>.</p>
            <p>A citizen looking for the contact number of their local Sub-Divisional Magistrate (SDM), agricultural subsidies for tube-wells, or emergency flood relief helplines typically has to navigate 5 to 10 disjointed government portals with varying uptime, obsolete PDFs, and unindexed scanned circulars.</p>

            <h2>Our Three-Tier Civic Data Pipeline</h2>
            <p>To power City Mitra's instant bilingual answers, we engineered a dedicated 3-tier data ingestion and serving architecture:</p>
            
            <div style="background:var(--surface-warm); border:1px solid var(--ink-20); border-radius:12px; padding:20px; margin:24px 0;">
                <h4 style="margin-bottom:8px; color:var(--orange);">1. Ingestion & Extraction Layer (Batch & CDC)</h4>
                <p>We aggregate public-domain datasets across district portals (e.g., Kurukshetra, Ambala, Dehradun), state gazettes, and national portals. Scanned PDFs are processed through specialized OCR models tuned for Hindi, Punjabi, and English vernacular typographic scripts.</p>
            </div>

            <div style="background:var(--surface-warm); border:1px solid var(--ink-20); border-radius:12px; padding:20px; margin:24px 0;">
                <h4 style="margin-bottom:8px; color:var(--orange);">2. Semantic Normalization & Vector Embeddings</h4>
                <p>Extracted entities (officer designations, office hours, jurisdiction boundaries, emergency escalation trees) are structured into strongly-typed JSON schemas. We generate localized semantic embeddings to ensure a query like <em>"DC sahab ka phone number"</em> correctly maps to the <em>Deputy Commissioner Secretariat Desk</em>.</p>
            </div>

            <div style="background:var(--surface-warm); border:1px solid var(--ink-20); border-radius:12px; padding:20px; margin:24px 0;">
                <h4 style="margin-bottom:8px; color:var(--orange);">3. Sub-100ms Edge Serving & Privacy-Preserving Inference</h4>
                <p>Citizen queries are routed through edge endpoints with zero persistent server-side PII retention. The response is compiled dynamically from verified civic graph nodes, ensuring accuracy without hallucination.</p>
            </div>

            <h2>Ensuring 100% Accuracy in Civic Data</h2>
            <p>Unlike conversational LLMs that may hallucinate telephone numbers or officer names, City Mitra employs <strong>Deterministic Verification Guards</strong>. Before any civic contact or scheme requirement is returned to a user, the response is validated against the verified ground-truth graph.</p>

            <h2>What's Next for City Mitra's Data Mesh?</h2>
            <p>We are currently working on real-time event integration—including municipal water supply schedules, district road closures, and weather warnings across our live 13 districts. Our mission is to make every district in India as digitally accessible and transparent as a tap on your phone.</p>
        `
    },
    {
        id: 'smart-cities-vs-smart-districts',
        title: 'Smart Cities vs. Smart Districts: Why India’s Tier-2 & Tier-3 Towns Need Civic AI More Than Metros',
        slug: 'smart-cities-vs-smart-districts-tier-2-civic-ai',
        category: 'Smart Cities',
        readTime: '6 min read',
        date: 'May 8, 2025',
        isoDate: '2025-05-08T10:00:00+05:30',
        author: {
            name: 'Ram Wadhwa',
            role: 'Sr Data Engineer & Founder, City Mitra',
            bio: 'Ram is a Senior Data Engineer specializing in distributed real-time systems, civic data pipelines, and vernacular AI architecture.',
            avatar: '/icons/icon-192.png'
        },
        summary: 'Metros have apps for everything, but Tier-2 and Tier-3 districts house 70% of India’s population. Here is why decentralizing civic intelligence into district-level AI is the true frontier of Smart India.',
        tags: ['Smart Cities', 'Urban Planning', 'Tier-2 India', 'GovTech', 'Decentralization'],
        content: `
            <h2>The Metro Bias in Urban Technology</h2>
            <p>When technology startups talk about "smart cities," the conversation usually revolves around Bengaluru, Mumbai, or Delhi NCR: hyper-local grocery deliveries, cab aggregators, and parking sensor apps. However, over 70% of India's population lives in Tier-2, Tier-3, and rural district headquarters like Fatehabad, Sirsa, Palwal, and Karnal.</p>

            <h2>The Real Challenges in District Administration</h2>
            <p>In smaller districts, citizens face specific friction points that metros resolved years ago:</p>
            <ul>
                <li><strong>Physical Distance to Collectorates:</strong> A farmer or small business owner may have to travel 35 kilometers to the district Mini-Secretariat just to inquire if a specific welfare scheme certificate is ready.</li>
                <li><strong>Information Asymmetry:</strong> Crucial subsidy schemes, health drives, and disaster warnings are often disseminated via wall notices or sporadic press releases that rarely reach the broader populace in real-time.</li>
                <li><strong>Language Barriers:</strong> Official government circulars are frequently written in dense administrative English, alienating vernacular-speaking citizens.</li>
            </ul>

            <h2>Why District-Specific AI is the Solution</h2>
            <p>City Mitra was architected around a <strong>District-First Philosophy</strong>. Rather than creating a generic national bot that gives generic advice, we deploy localized AI instances configured for each individual district. When a resident of Fatehabad asks a question, the AI retrieves data specifically from the Fatehabad District Administration and Haryana State datasets.</p>

            <h2>Economic Impact of Citizen Time Saved</h2>
            <p>By providing immediate answers to questions about government office locations, officer contact details, and requisite documentation, City Mitra eliminates unnecessary physical trips and reduces the burden on front-desk government clerks. That is the true essence of civic empowerment.</p>
        `
    },
    {
        id: 'vernacular-civic-nlp-india',
        title: 'Solving the Vernacular Civic Bottleneck: How NLP and Regional Indian Languages Bridge Citizens and Government',
        slug: 'vernacular-civic-nlp-indian-languages',
        category: 'Civic AI',
        readTime: '8 min read',
        date: 'April 28, 2025',
        isoDate: '2025-04-28T10:00:00+05:30',
        author: {
            name: 'Ram Wadhwa',
            role: 'Sr Data Engineer & Founder, City Mitra',
            bio: 'Ram is a Senior Data Engineer specializing in distributed real-time systems, civic data pipelines, and vernacular AI architecture.',
            avatar: '/icons/icon-192.png'
        },
        summary: 'How we built a hybrid NLP pipeline capable of handling code-mixed Hinglish, vernacular Hindi, and regional dialects to make civic administration accessible to every citizen.',
        tags: ['NLP', 'Machine Learning', 'Vernacular AI', 'Hinglish', 'Civic Access'],
        content: `
            <h2>Language as the Greatest Digital Divide</h2>
            <p>In India, English is spoken by less than 12% of the population, yet more than 60% of official government websites use English as their primary interface. Even when Hindi translations exist, they are often literal, stiff translations of bureaucratic terminology that everyday citizens do not use.</p>

            <h2>Handling Code-Mixed "Hinglish" Queries</h2>
            <p>Citizens rarely search using pure formal Hindi (<em>"उपायुक्त का कार्यालय कहाँ स्थित है?"</em>) or formal English (<em>"Where is the office of the Deputy Commissioner?"</em>). Instead, they ask in code-mixed colloquial vernacular:</p>
            <blockquote style="background:var(--orange-xlt); border-left:4px solid var(--orange); padding:12px 18px; margin:16px 0; font-style:italic;">
                "Karnal me Kisan credit card ke liye kaunse documents chahiye aur kiske paas jana padega?"
            </blockquote>

            <h2>Our NLP & Tokenization Strategy</h2>
            <p>To process these complex queries accurately, City Mitra implements a multi-step semantic parsing pipeline:</p>
            <ol>
                <li><strong>Intent & Entity Extraction:</strong> Detecting the core civic intent (e.g. <em>Scheme_Requirements</em>, <em>Officer_Lookup</em>, <em>Emergency_Helpline</em>).</li>
                <li><strong>Location Disambiguation:</strong> Identifying implicit district context from the user's active session or explicit mention in the prompt.</li>
                <li><strong>Phonetic Transliteration Normalization:</strong> Mapping romanized Hindi variations (e.g., <em>"yojna"</em>, <em>"yojana"</em>, <em>"scheem"</em>) to the standardized knowledge graph entity.</li>
            </ol>

            <h2>Zero-Friction Access for All Citizens</h2>
            <p>Our philosophy is simple: technology should adapt to how people speak, not force people to learn how computers think. By making City Mitra bilingual and conversational, we ensure that every citizen, regardless of tech literacy, can access public services with dignity and ease.</p>
        `
    },
    {
        id: 'emergency-response-data-analytics',
        title: 'Emergency Response Latency in Indian Cities: A Data-Driven Analysis and AI Helpline Routing',
        slug: 'emergency-response-latency-ai-helpline-routing',
        category: 'Public Safety',
        readTime: '5 min read',
        date: 'April 19, 2025',
        isoDate: '2025-04-19T10:00:00+05:30',
        author: {
            name: 'Ram Wadhwa',
            role: 'Sr Data Engineer & Founder, City Mitra',
            bio: 'Ram is a Senior Data Engineer specializing in distributed real-time systems, civic data pipelines, and vernacular AI architecture.',
            avatar: '/icons/icon-192.png'
        },
        summary: 'In critical situations, every second counts. How City Mitra provides zero-latency verified emergency numbers, trauma center hotlines, and district disaster management contacts.',
        tags: ['Emergency Services', 'Public Safety', 'Data Analytics', 'Disaster Management'],
        content: `
            <h2>Seconds That Save Lives</h2>
            <p>During medical emergencies, road accidents, or domestic distress, finding a verified, working contact number is a matter of life and death. Searching Google during a crisis often surfaces outdated commercial directories, wrong STD codes, or closed private clinics.</p>

            <h2>The 112 Unified Emergency Integration</h2>
            <p>India's Emergency Response Support System (ERSS 112) is one of the world's most sophisticated unified emergency architectures. However, specialized district services—such as women helpline (1091), child helpline (1098), traffic police desks, and snakebite anti-venom medical centers—still maintain dedicated district desks.</p>

            <h2>How City Mitra Accelerates Emergency Discovery</h2>
            <p>City Mitra maintains an offline-cached, ultra-fast directory of emergency services for all 13 active districts. When a user requests emergency assistance:</p>
            <ul>
                <li>The response renders instantly with one-tap dialable telephone links (<code>tel:</code> protocol).</li>
                <li>Hospitals with 24x7 trauma care and blood banks are highlighted with exact geographic directions.</li>
                <li>Data is cached directly in the citizen's browser (PWA offline cache), ensuring access even during network disruptions or cellular congestion.</li>
            </ul>
        `
    },
    {
        id: 'geospatial-heritage-kurukshetra-48-kos',
        title: 'Geospatial Data Mapping for Heritage Tourism: Preserving the 48 Kos Kurukshetra Circuit with Modern Tech',
        slug: 'geospatial-heritage-mapping-kurukshetra-48-kos',
        category: 'Heritage & Tourism',
        readTime: '6 min read',
        date: 'April 10, 2025',
        isoDate: '2025-04-10T10:00:00+05:30',
        author: {
            name: 'Ram Wadhwa',
            role: 'Sr Data Engineer & Founder, City Mitra',
            bio: 'Ram is a Senior Data Engineer specializing in distributed real-time systems, civic data pipelines, and vernacular AI architecture.',
            avatar: '/icons/icon-192.png'
        },
        summary: 'How GIS mapping, AI storytellers, and proximity alerts bring ancient cultural circuits like Kurukshetra’s 48 Kos pilgrimage to life for modern pilgrims and global travelers.',
        tags: ['Geospatial', 'GIS', 'Cultural Heritage', 'Kurukshetra', 'Smart Tourism'],
        content: `
            <h2>The Living Heritage of Kurukshetra</h2>
            <p>Kurukshetra is not just a modern district of Haryana; it is one of the oldest cultural and spiritual landscapes on earth. Spanning over 48 Kos (an ancient unit of distance equivalent to roughly 128 kilometers), the heritage circuit encompasses more than 134 sacred tirthas, ghats, and historical monuments spread across Kurukshetra, Kaithal, Karnal, and Jind.</p>

            <h2>The Challenge: Discoverability of Ancient Tirthas</h2>
            <p>While iconic sites like Brahma Sarovar, Jyotisar, and Sannihit Sarovar attract millions of pilgrims during the International Gita Mahotsav, scores of ancient archaeological gems remain virtually unknown due to lack of geo-tagged maps, historical context, and transport guides.</p>

            <h2>Bringing Ancient Heritage into the Digital Era</h2>
            <p>City Mitra integrated a dedicated <strong>AskGita AI & Heritage Guide</strong> module. Pilgrims can:</p>
            <ul>
                <li>Ask philosophical and contextual questions directly from the 700 verses of the Bhagavad Gita.</li>
                <li>Receive automated GPS proximity alerts when they are near historical tirthas like Bhishma Kund (Narkatari) or Sheikh Chilli's Tomb.</li>
                <li>Get complete route itineraries, ghat timings, and nearby civic amenities with zero commercial bias.</li>
            </ul>
        `
    },
    {
        id: 'future-public-records-ai',
        title: 'The Future of Public Records in India: From Bureaucratic Silos to Unified AI Interfaces',
        slug: 'future-of-public-records-in-india-ai-interfaces',
        category: 'GovTech',
        readTime: '7 min read',
        date: 'March 25, 2025',
        isoDate: '2025-03-25T10:00:00+05:30',
        author: {
            name: 'Ram Wadhwa',
            role: 'Sr Data Engineer & Founder, City Mitra',
            bio: 'Ram is a Senior Data Engineer specializing in distributed real-time systems, civic data pipelines, and vernacular AI architecture.',
            avatar: '/icons/icon-192.png'
        },
        summary: 'The shift from static web portals to interactive AI civic agents. Why conversational interfaces represent the next evolutionary leap for e-governance in India.',
        tags: ['GovTech', 'AI Interfaces', 'e-Governance', 'Digital India', 'Future of Tech'],
        content: `
            <h2>The Three Eras of E-Governance in India</h2>
            <p>To understand where digital civic access is heading, it is helpful to look at how public administration interfaces have evolved over the last 25 years:</p>
            <ol>
                <li><strong>Era 1 (2000–2010) — Static Document Repositories:</strong> Government websites acted as static bulletin boards. Citizens downloaded circulars and forms to fill by hand.</li>
                <li><strong>Era 2 (2010–2022) — Portal Proliferation:</strong> Every department built its own portal, app, and login system. While transactions moved online, citizens were overwhelmed by dozens of separate usernames and passwords.</li>
                <li><strong>Era 3 (2023 & Beyond) — Conversational Civic Intelligence:</strong> Instead of navigating menus, dropdowns, and confusing sitemaps, citizens simply state what they need in plain natural language, and the AI agent retrieves and synthesizes the exact answer.</li>
            </ol>

            <h2>Our Vision for City Mitra</h2>
            <p>As a Data Engineer, my goal with City Mitra has always been to build technology that is invisible yet indispensable. When a citizen in Kurukshetra, Ambala, or Dehradun needs help, they shouldn't need a computer science degree to find it. That is the mission that drives every line of code we write.</p>
        `
    }
];

// ════════════════════════════════════════════════════════════════════════════
// 3. GENERATE STATIC PRE-RENDERED BLOG POST PAGES
// ════════════════════════════════════════════════════════════════════════════
function renderPostPageHtml(post) {
    const canonicalUrl = `https://citymitra.app/blog/${post.id}`;
    
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
    <title>${post.title} — City Mitra Blog</title>
    <meta name="description" content="${post.summary}">
    <meta name="keywords" content="${post.tags.join(', ')}, Ram Wadhwa, City Mitra, Civic Data, GovTech India">
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="icon" href="/icons/icon-192.png" type="image/png">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">

    <!-- Google Search Console & AdSense Verification -->
    <meta name="google-site-verification" content="google2e3856b787fd8a8f">
    <meta name="google-adsense-account" content="ca-pub-5496851328899189">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5496851328899189" crossorigin="anonymous"></script>

    <!-- Open Graph -->
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.summary}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="https://citymitra.app/icons/icon-512.png">
    <meta property="article:published_time" content="${post.isoDate}">
    <meta property="article:author" content="${post.author.name}">
    <meta property="article:section" content="${post.category}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${post.title}">
    <meta name="twitter:description" content="${post.summary}">
    <meta name="twitter:image" content="https://citymitra.app/icons/icon-512.png">

    <!-- JSON-LD TechArticle / BlogPosting Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "${post.title}",
      "description": "${post.summary}",
      "image": "https://citymitra.app/icons/icon-512.png",
      "datePublished": "${post.isoDate}",
      "dateModified": "2026-08-14T12:00:00+05:30",
      "author": {
        "@type": "Person",
        "name": "${post.author.name}",
        "jobTitle": "${post.author.role}",
        "url": "https://citymitra.app/about",
        "sameAs": "https://citymitra.app/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "City Mitra",
        "logo": {
          "@type": "ImageObject",
          "url": "https://citymitra.app/icons/icon-512.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${canonicalUrl}"
      },
      "keywords": "${post.tags.join(', ')}",
      "articleSection": "${post.category}"
    }
    </script>

    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/design-tokens.css">
    <link rel="stylesheet" href="/css/navbar.css">
    <link rel="stylesheet" href="/css/sections.css">
    <link rel="stylesheet" href="/css/blog.css">
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
            <a href="/cities" class="nav-link">Cities</a>
            <a href="/blog" class="nav-link active">Blog</a>
            <a href="/about" class="nav-link">About</a>
            <a href="/contact" class="nav-link">Contact</a>
        </div>
        <div class="nav-actions">
            <a href="/chat" class="nav-ai-btn" title="Open AI Chat">✦</a>
            <a href="/chat" class="nav-cta">→ Try AI Chat</a>
        </div>
    </div>
</nav>

<!-- ══════════════════════════════════════════ -->
<!-- ARTICLE CONTAINER                          -->
<!-- ══════════════════════════════════════════ -->
<main class="section" style="padding-top: calc(var(--nav-h) + 50px); background: #FFFBF5; min-height: 80vh;">
    <div class="article-container">
        <!-- Back link -->
        <a href="/blog" class="btn btn-ghost" style="margin-bottom: 24px; display:inline-flex; align-items:center; gap:6px; text-decoration:none; font-weight:600; color:var(--ink-70);">
            ← Back to All Articles
        </a>

        <!-- Header -->
        <header class="article-header">
            <div class="article-meta-bar">
                <span class="blog-card-category">${post.category}</span>
                <span>${post.date}</span>
                <span>•</span>
                <span>${post.readTime}</span>
            </div>
            <h1 class="article-title">${post.title}</h1>
            <p style="font-size: 1.2rem; color: var(--ink-70); line-height: 1.6; margin-bottom: 24px;">${post.summary}</p>

            <!-- Author Card -->
            <div class="article-author-card">
                <div class="author-avatar-wrap" style="width: 52px; height: 52px; border-radius: 50%; background: var(--orange); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; flex-shrink: 0;">RW</div>
                <div>
                    <div style="font-weight: 800; color: var(--ink); font-size: 16px;">${post.author.name}</div>
                    <div style="font-size: 13px; color: var(--orange); font-weight: 600;">${post.author.role}</div>
                </div>
            </div>
        </header>

        <!-- TOP AD SLOT -->
        <div class="ad-slot ad-slot-top" style="margin:28px 0;">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-5496851328899189"
                 data-ad-slot="1234567890"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <!-- Article Content -->
        <article class="article-content">
            ${post.content}
        </article>

        <!-- Topic Tags -->
        <div style="margin-top:40px; padding-top:20px; border-top:1px solid var(--ink-10);">
            <strong style="margin-right:12px; font-size:14px; color:var(--ink-70);">Topics:</strong>
            ${post.tags.map(t => `<span style="display:inline-block; padding:5px 14px; background:white; border:1px solid var(--ink-20); border-radius:var(--radius-full); font-size:13px; font-weight:600; color:var(--ink-80); margin-right:8px; margin-bottom:8px;">#${t}</span>`).join('')}
        </div>

        <!-- Author Spotlight Card (E-E-A-T) -->
        <div class="article-author-card" style="margin-top:40px; background: white; padding: 24px; border: 1px solid var(--ink-20); border-radius: var(--radius-lg); display:flex; gap:18px; align-items:flex-start;">
            <div class="author-avatar-wrap" style="width: 60px; height: 60px; border-radius: 50%; background: var(--orange); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 22px; flex-shrink: 0;">RW</div>
            <div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--ink); margin-bottom: 4px;">About the Author: ${post.author.name}</h3>
                <div style="font-size: 13px; color: var(--orange); font-weight: 600; margin-bottom: 8px;">${post.author.role}</div>
                <p style="font-size: 0.95rem; color: var(--ink-70); line-height: 1.6; margin-bottom: 10px;">${post.author.bio}</p>
                <a href="/about" style="color:var(--orange); font-weight:700; font-size:13.5px; text-decoration:none;">Learn about Ram's engineering mission on City Mitra →</a>
            </div>
        </div>

        <!-- BOTTOM AD SLOT -->
        <div class="ad-slot ad-slot-bottom" style="margin:32px 0;">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-5496851328899189"
                 data-ad-slot="0987654321"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <!-- Related Navigation -->
        <div style="text-align:center; margin-top:48px;">
            <a href="/blog" class="btn btn-primary" style="display:inline-block; padding:12px 28px; background:var(--orange); color:white; border-radius:var(--radius-full); text-decoration:none; font-weight:700;">Explore More Knowledge Hub Articles →</a>
        </div>
    </div>
</main>

<!-- FOOTER -->
<footer class="footer-v2">
    <div class="container">
        <div class="footer-v2-bottom">
            <div>© 2025 City Mitra. All rights reserved. Open Civic Data Initiative. Founded by Ram Wadhwa.</div>
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

// Generate static directories for all blog posts
BLOG_POSTS.forEach(post => {
    // 1. /blog/[id]/index.html
    const dirById = path.join(ROOT, 'blog', post.id);
    if (!fs.existsSync(dirById)) fs.mkdirSync(dirById, { recursive: true });
    fs.writeFileSync(path.join(dirById, 'index.html'), renderPostPageHtml(post), 'utf8');

    // 2. /blog/[slug]/index.html
    if (post.slug && post.slug !== post.id) {
        const dirBySlug = path.join(ROOT, 'blog', post.slug);
        if (!fs.existsSync(dirBySlug)) fs.mkdirSync(dirBySlug, { recursive: true });
        fs.writeFileSync(path.join(dirBySlug, 'index.html'), renderPostPageHtml(post), 'utf8');
    }
    console.log('Rendered static blog post:', post.id);
});

// ════════════════════════════════════════════════════════════════════════════
// 4. UPDATE BLOG.HTML TO LINK TO CLEAN STATIC URLS
// ════════════════════════════════════════════════════════════════════════════
let blogHubHtml = fs.readFileSync(path.join(ROOT, 'blog.html'), 'utf8');

// Replace dynamic query links with static clean slug URLs in blog.html
BLOG_POSTS.forEach(post => {
    const reg = new RegExp(`href=["'](?:/)?blog-post(?:\\.html)?\\?id=${post.id}["']`, 'g');
    blogHubHtml = blogHubHtml.replace(reg, `href="/blog/${post.id}"`);
});
fs.writeFileSync(path.join(ROOT, 'blog.html'), blogHubHtml, 'utf8');
fs.writeFileSync(path.join(ROOT, 'blog', 'index.html'), blogHubHtml, 'utf8');
console.log('Updated blog.html to use clean static slug URLs');

// ════════════════════════════════════════════════════════════════════════════
// 5. UPDATE SITEMAP.XML WITH CLEAN STATIC BLOG URLS & FRESH TIMESTAMPS
// ════════════════════════════════════════════════════════════════════════════
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    <!-- Core Main Pages -->
    <url>
        <loc>https://citymitra.app/</loc>
        <lastmod>2026-08-14</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://citymitra.app/services</loc>
        <lastmod>2026-08-14</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://citymitra.app/cities</loc>
        <lastmod>2026-08-14</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://citymitra.app/chat</loc>
        <lastmod>2026-08-14</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://citymitra.app/blog</loc>
        <lastmod>2026-08-14</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://citymitra.app/about</loc>
        <lastmod>2026-08-14</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
    </url>
    <url>
        <loc>https://citymitra.app/contact</loc>
        <lastmod>2026-08-14</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Clean Static Blog Articles by Ram Wadhwa -->
${BLOG_POSTS.map(p => `    <url>
        <loc>https://citymitra.app/blog/${p.id}</loc>
        <lastmod>2026-08-14</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
    </url>`).join('\n')}

    <!-- Legal & Compliance Pages -->
    <url>
        <loc>https://citymitra.app/privacy</loc>
        <lastmod>2026-08-14</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://citymitra.app/terms</loc>
        <lastmod>2026-08-14</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://citymitra.app/disclaimer</loc>
        <lastmod>2026-08-14</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>

</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml, 'utf8');
console.log('Updated sitemap.xml with 100% clean static URLs and fresh timestamps');

// ════════════════════════════════════════════════════════════════════════════
// 6. ENRICH JSON-LD SCHEMAS ON ALL MAIN PAGES
// ════════════════════════════════════════════════════════════════════════════

// Add FAQPage Schema to chat.html
let chatHtml = fs.readFileSync(path.join(ROOT, 'chat.html'), 'utf8');
const chatFaqSchema = `    <!-- Schema.org FAQPage Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is City Mitra?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "City Mitra is India's first AI civic assistant, providing centralized, 24x7 verified information on government services, district administration officers, welfare schemes, tourism, and emergency contacts across 13 Indian districts."
          }
        },
        {
          "@type": "Question",
          "name": "Which districts are currently live on City Mitra?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "City Mitra is currently active across 13 districts including Kurukshetra, Ambala, Karnal, Panipat, Dehradun, Faridabad, Rohtak, Hisar, Sirsa, Fatehabad, Kaithal, Yamunanagar, and Panchkula."
          }
        },
        {
          "@type": "Question",
          "name": "Is City Mitra free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, City Mitra is 100% free for all Indian citizens as part of an open civic data initiative."
          }
        },
        {
          "@type": "Question",
          "name": "How does City Mitra ensure civic data accuracy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All civic data is ingested directly from verified public-domain government portals, district gazettes, and official administration registries, cross-validated via automated deterministic guards."
          }
        }
      ]
    }
    </script>
`;
if (!chatHtml.includes('"@type": "FAQPage"')) {
    chatHtml = chatHtml.replace(/<\/head>/i, chatFaqSchema + '\n</head>');
    fs.writeFileSync(path.join(ROOT, 'chat.html'), chatHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT, 'chat', 'index.html'), chatHtml, 'utf8');
    console.log('Added FAQPage schema to chat.html');
}

// Add GovernmentService Collection Schema to services.html
let servicesHtml = fs.readFileSync(path.join(ROOT, 'services.html'), 'utf8');
const servicesSchema = `    <!-- Schema.org GovernmentService Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "City Mitra Government Services Directory",
      "description": "Comprehensive directory of district government services across 13 Indian districts, including administration, public safety, health, revenue, and municipal utilities.",
      "url": "https://citymitra.app/services",
      "provider": {
        "@type": "Organization",
        "name": "City Mitra",
        "url": "https://citymitra.app"
      }
    }
    </script>
`;
if (!servicesHtml.includes('"@type": "CollectionPage"')) {
    servicesHtml = servicesHtml.replace(/<\/head>/i, servicesSchema + '\n</head>');
    fs.writeFileSync(path.join(ROOT, 'services.html'), servicesHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT, 'services', 'index.html'), servicesHtml, 'utf8');
    console.log('Added CollectionPage schema to services.html');
}

// Add AdministrativeArea Collection Schema to cities.html
let citiesHtml = fs.readFileSync(path.join(ROOT, 'cities.html'), 'utf8');
const citiesSchema = `    <!-- Schema.org AdministrativeArea Collection Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "City Mitra Active Districts Directory",
      "description": "Explore 13 live Indian district AI civic assistants with dedicated local knowledge bases and real-time civic directory integration.",
      "url": "https://citymitra.app/cities",
      "provider": {
        "@type": "Organization",
        "name": "City Mitra",
        "url": "https://citymitra.app"
      }
    }
    </script>
`;
if (!citiesHtml.includes('"@type": "CollectionPage"')) {
    citiesHtml = citiesHtml.replace(/<\/head>/i, citiesSchema + '\n</head>');
    fs.writeFileSync(path.join(ROOT, 'cities.html'), citiesHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT, 'cities', 'index.html'), citiesHtml, 'utf8');
    console.log('Added CollectionPage schema to cities.html');
}

// Add ContactPage Schema to contact.html
let contactHtml = fs.readFileSync(path.join(ROOT, 'contact.html'), 'utf8');
const contactSchema = `    <!-- Schema.org ContactPage Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact City Mitra",
      "description": "Get in touch with the City Mitra civic engineering team for district onboarding, partnership, and feedback.",
      "url": "https://citymitra.app/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "City Mitra",
        "url": "https://citymitra.app",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Civic Support & Feedback",
          "url": "https://citymitra.app/contact"
        }
      }
    }
    </script>
`;
if (!contactHtml.includes('"@type": "ContactPage"')) {
    contactHtml = contactHtml.replace(/<\/head>/i, contactSchema + '\n</head>');
    fs.writeFileSync(path.join(ROOT, 'contact.html'), contactHtml, 'utf8');
    fs.writeFileSync(path.join(ROOT, 'contact', 'index.html'), contactHtml, 'utf8');
    console.log('Added ContactPage schema to contact.html');
}

console.log('\n🚀 ALL SEO AUDIT ITEMS RESOLVED SUCCESSFULLY!');
