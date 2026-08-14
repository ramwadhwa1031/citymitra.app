const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const pages = ['about', 'services', 'cities', 'chat', 'contact', 'blog', 'blog-post', 'privacy', 'terms', 'disclaimer'];

const canonicalNormalizer = `    <!-- Canonical URL Auto-Normalizer (Prevents duplicate trailing slash and .html) -->
    <script>
    (function(){
        var p = window.location.pathname;
        if (p.endsWith('.html')) {
            window.location.replace(window.location.origin + p.replace(/\\.html$/, '') + window.location.search + window.location.hash);
        } else if (p.length > 1 && p.endsWith('/')) {
            window.location.replace(window.location.origin + p.slice(0, -1) + window.location.search + window.location.hash);
        }
    })();
    </script>
`;

// 1. Process all root HTML files
const rootFiles = ['index.html', ...pages.map(p => p + '.html')];

rootFiles.forEach(fileName => {
    const filePath = path.join(ROOT, fileName);
    if (!fs.existsSync(filePath)) return;

    let html = fs.readFileSync(filePath, 'utf8');

    // Remove any previously inserted normalizer to avoid duplicate
    html = html.replace(/\s*<!-- Canonical URL Auto-Normalizer[\s\S]*?<\/script>\s*/g, '\n');

    // Insert right after <head>
    html = html.replace(/<head>/i, '<head>\n' + canonicalNormalizer);

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Normalized root file:', fileName);
});

// 2. Mirror each page into its subfolder for native GitHub Pages directory handling
pages.forEach(p => {
    const dir = path.join(ROOT, p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const srcHtml = path.join(ROOT, p + '.html');
    if (fs.existsSync(srcHtml)) {
        const content = fs.readFileSync(srcHtml, 'utf8');
        fs.writeFileSync(path.join(dir, 'index.html'), content, 'utf8');
        console.log('Mirrored to:', p + '/index.html');
    }
});

console.log('All canonical normalizers successfully applied.');
