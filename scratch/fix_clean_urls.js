const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const pages = ['about', 'services', 'cities', 'chat', 'contact', 'blog', 'blog-post', 'privacy', 'terms', 'disclaimer'];

function fixPaths(content) {
    return content
        // CSS & JS assets
        .replace(/href="css\//g, 'href="/css/')
        .replace(/src="js\//g, 'src="/js/')
        .replace(/href="icons\//g, 'href="/icons/')
        .replace(/src="icons\//g, 'src="/icons/')
        // Navigation links
        .replace(/href="index\.html"/g, 'href="/"')
        .replace(/href="index"/g, 'href="/"')
        .replace(/href="about\.html"/g, 'href="/about"')
        .replace(/href="about"/g, 'href="/about"')
        .replace(/href="services\.html"/g, 'href="/services"')
        .replace(/href="services"/g, 'href="/services"')
        .replace(/href="cities\.html"/g, 'href="/cities"')
        .replace(/href="cities"/g, 'href="/cities"')
        .replace(/href="chat\.html"/g, 'href="/chat"')
        .replace(/href="chat"/g, 'href="/chat"')
        .replace(/href="contact\.html"/g, 'href="/contact"')
        .replace(/href="contact"/g, 'href="/contact"')
        .replace(/href="blog\.html"/g, 'href="/blog"')
        .replace(/href="blog"/g, 'href="/blog"')
        .replace(/href="blog-post\.html/g, 'href="/blog-post')
        .replace(/href="privacy\.html"/g, 'href="/privacy"')
        .replace(/href="privacy"/g, 'href="/privacy"')
        .replace(/href="terms\.html"/g, 'href="/terms"')
        .replace(/href="terms"/g, 'href="/terms"')
        .replace(/href="disclaimer\.html"/g, 'href="/disclaimer"')
        .replace(/href="disclaimer"/g, 'href="/disclaimer"');
}

// 1. Fix root HTML files
const allFiles = ['index.html', '404.html', ...pages.map(p => p + '.html')];
allFiles.forEach(f => {
    const fullPath = path.join(ROOT, f);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        content = fixPaths(content);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed paths in:', f);
    }
});

// 2. Create subdirectories with index.html for native GitHub Pages clean URLs
pages.forEach(p => {
    const dirPath = path.join(ROOT, p);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const srcFile = path.join(ROOT, p + '.html');
    if (fs.existsSync(srcFile)) {
        const content = fs.readFileSync(srcFile, 'utf8');
        fs.writeFileSync(path.join(dirPath, 'index.html'), content, 'utf8');
        console.log('Created:', p + '/index.html');
    }
});

console.log('All clean URLs and directory structures generated successfully.');
