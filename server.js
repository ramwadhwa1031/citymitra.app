const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=UTF-8',
    '.xml': 'application/xml; charset=UTF-8',
    '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
    // Parse URL and strip query params
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    let reqPath = decodeURIComponent(parsedUrl.pathname);

    if (reqPath === '/') {
        reqPath = '/index.html';
    }

    let filePath = path.join(ROOT, reqPath);

    // If file exists as is
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        serveFile(filePath, res);
        return;
    }

    // Clean URL fallback: check if filePath + '.html' exists
    const htmlFilePath = filePath + '.html';
    if (fs.existsSync(htmlFilePath) && fs.statSync(htmlFilePath).isFile()) {
        serveFile(htmlFilePath, res);
        return;
    }

    // Check if directory with index.html
    const indexFilePath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexFilePath) && fs.statSync(indexFilePath).isFile()) {
        serveFile(indexFilePath, res);
        return;
    }

    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end('<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p><a href="/">Back to Home</a>');
});

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
        });
        res.end(content);
    });
}

server.listen(PORT, () => {
    console.log(`\n🚀 City Mitra Local Dev Server is live at: http://localhost:${PORT}\n`);
});
