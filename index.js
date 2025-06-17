const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mysql = require('mysql2');
// const games = require('./data/games'); // 不再需要

// MySQL 连接配置
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'simple_game',
    port: 3306
};

// 语言配置
const messages = {
    'en': {
        '404': '404 - Page Not Found',
        '500': 'Server Error: ',
        'server_running': '🎮 Game List Server running at http://localhost:',
        'external_url': '🌐 External access URL: ',
        'switch_to_zh': 'Switch to Chinese',
        'switch_to_en': 'Switch to English'
    },
    'zh': {
        '404': '404 - 页面未找到',
        '500': '服务器错误: ',
        'server_running': '🎮 小游戏列表服务器运行在 http://localhost:',
        'external_url': '🌐 外部访问地址: ',
        'switch_to_zh': '切换到中文',
        'switch_to_en': '切换到英文'
    }
};

// 获取用户首选语言
function getPreferredLanguage(req) {
    // 首先检查 cookie
    const cookies = parseCookies(req.headers.cookie || '');
    if (cookies.language && messages[cookies.language]) {
        return cookies.language;
    }
    
    // 然后检查 Accept-Language 头
    const acceptLanguage = req.headers['accept-language'];
    if (!acceptLanguage) return 'en';
    
    const languages = acceptLanguage.split(',');
    const preferredLanguage = languages[0].split('-')[0].toLowerCase();
    return messages[preferredLanguage] ? preferredLanguage : 'en';
}

// 解析 cookies
function parseCookies(cookieHeader) {
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
    return cookies;
}

// 设置 cookie
function setCookie(res, name, value, maxAge) {
    res.setHeader('Set-Cookie', `${name}=${value}; Max-Age=${maxAge}; Path=/; HttpOnly`);
}

// 从MySQL获取游戏数据
function getGamesFromMySQL(lang, category = 'all', search = '', callback) {
    const connection = mysql.createConnection(dbConfig);
    let sql = `SELECT * FROM games WHERE 1=1`;
    const params = [];

    if (category !== 'all') {
        sql += ` AND LOWER(category_en) = ?`;
        params.push(category.toLowerCase());
    }
    if (search) {
        sql += ` AND (LOWER(title_${lang}) LIKE ? OR LOWER(description_${lang}) LIKE ?)`;
        params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }
    sql += ` ORDER BY id ASC`;

    connection.query(sql, params, (err, results) => {
        connection.end();
        if (err) {
            callback(err);
            return;
        }
        // 格式化为前端需要的格式
        const games = results.map(game => ({
            id: game.id,
            title: game[`title_${lang}`],
            description: game[`description_${lang}`],
            category: game[`category_${lang}`],
            image: game.image,
            rating: game.rating
        }));
        callback(null, games);
    });
}

const server = http.createServer((req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 处理语言切换请求
    if (pathname === '/api/switch-language') {
        const lang = parsedUrl.query.lang;
        if (lang && messages[lang]) {
            setCookie(res, 'language', lang, 31536000); // 1年有效期
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, language: lang }));
            return;
        }
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid language' }));
        return;
    }

    // 处理游戏数据请求
    if (pathname === '/api/games') {
        const lang = parsedUrl.query.language === 'zh' ? 'zh' : 'en'; // 默认英文
        const category = parsedUrl.query.category || 'all';
        const search = parsedUrl.query.search || '';
        getGamesFromMySQL(lang, category, search, (err, gamesData) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Database error' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(gamesData));
        });
        return;
    }

    // 处理静态文件请求
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`<h1>${messages[getPreferredLanguage(req)]['404']}</h1>`, 'utf-8');
            } else {
                res.writeHead(500);
                res.end(messages[getPreferredLanguage(req)]['500'] + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 12000;
server.listen(PORT, '0.0.0.0', () => {
    const lang = 'zh'; // 默认使用中文显示服务器启动信息
    const msg = messages[lang];
    console.log(`${msg['server_running']}${PORT}`);
    console.log(`${msg['external_url']}https://work-1-fegxsoaimuemnqhz.prod-runtime.all-hands.dev`);
});
