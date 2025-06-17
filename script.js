// 游戏数据
const games = [
    {
        id: 1,
        title: "俄罗斯方块",
        description: "经典的益智游戏，通过旋转和移动方块来消除完整的行",
        category: "puzzle",
        icon: "🧩",
        rating: 4.8,
        players: "1.2M",
        difficulty: "简单"
    },
    {
        id: 2,
        title: "贪吃蛇",
        description: "控制小蛇吃食物长大，避免撞到自己或墙壁",
        category: "casual",
        icon: "🐍",
        rating: 4.6,
        players: "980K",
        difficulty: "简单"
    },
    {
        id: 3,
        title: "太空射击",
        description: "驾驶飞船在太空中战斗，消灭敌人保卫地球",
        category: "action",
        icon: "🚀",
        rating: 4.7,
        players: "756K",
        difficulty: "中等"
    },
    {
        id: 4,
        title: "数独",
        description: "在9x9的网格中填入数字，每行、每列、每个3x3方格都包含1-9",
        category: "puzzle",
        icon: "🔢",
        rating: 4.5,
        players: "654K",
        difficulty: "困难"
    },
    {
        id: 5,
        title: "跳跃小球",
        description: "控制小球跳跃避开障碍物，收集金币获得高分",
        category: "casual",
        icon: "⚽",
        rating: 4.3,
        players: "432K",
        difficulty: "简单"
    },
    {
        id: 6,
        title: "塔防大战",
        description: "建造防御塔阻止敌人通过，策略性的塔防游戏",
        category: "strategy",
        icon: "🏰",
        rating: 4.9,
        players: "1.5M",
        difficulty: "中等"
    },
    {
        id: 7,
        title: "记忆翻牌",
        description: "翻开卡片找到相同的图案，训练你的记忆力",
        category: "puzzle",
        icon: "🃏",
        rating: 4.4,
        players: "321K",
        difficulty: "简单"
    },
    {
        id: 8,
        title: "飞行冒险",
        description: "驾驶飞机穿越危险的峡谷，收集能量和道具",
        category: "action",
        icon: "✈️",
        rating: 4.6,
        players: "567K",
        difficulty: "中等"
    },
    {
        id: 9,
        title: "连连看",
        description: "找到相同的图案并用线连接，清除所有方块",
        category: "puzzle",
        icon: "🔗",
        rating: 4.2,
        players: "789K",
        difficulty: "简单"
    },
    {
        id: 10,
        title: "象棋大师",
        description: "与AI对弈中国象棋，提升你的棋艺水平",
        category: "strategy",
        icon: "♟️",
        rating: 4.7,
        players: "445K",
        difficulty: "困难"
    },
    {
        id: 11,
        title: "泡泡射击",
        description: "射击彩色泡泡，三个或更多相同颜色的泡泡会消除",
        category: "casual",
        icon: "🫧",
        rating: 4.5,
        players: "892K",
        difficulty: "简单"
    },
    {
        id: 12,
        title: "跑酷英雄",
        description: "在城市中奔跑跳跃，避开障碍物收集金币",
        category: "action",
        icon: "🏃",
        rating: 4.8,
        players: "1.1M",
        difficulty: "中等"
    }
];

// DOM 元素
const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const loading = document.getElementById('loading');

// 当前过滤状态
let currentCategory = 'all';
let currentSearchTerm = '';

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        renderGames(games);
    }, 1000);
});

// 显示加载状态
function showLoading() {
    loading.style.display = 'block';
    gamesGrid.style.display = 'none';
}

// 隐藏加载状态
function hideLoading() {
    loading.style.display = 'none';
    gamesGrid.style.display = 'grid';
}

// 渲染游戏卡片
function renderGames(gamesToRender) {
    if (gamesToRender.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <h3>😔 没有找到游戏</h3>
                <p>试试其他搜索词或选择不同的分类</p>
            </div>
        `;
        return;
    }

    gamesGrid.innerHTML = gamesToRender.map(game => `
        <div class="game-card" onclick="playGame(${game.id})">
            <div class="game-image">
                ${game.icon}
            </div>
            <div class="game-content">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-meta">
                    <span class="game-category">${getCategoryName(game.category)}</span>
                    <div class="game-rating">
                        <span>⭐</span>
                        <span>${game.rating}</span>
                    </div>
                </div>
                <div class="game-stats">
                    <span>👥 ${game.players} 玩家</span>
                    <span>🎯 ${game.difficulty}</span>
                </div>
                <button class="play-button" onclick="event.stopPropagation(); playGame(${game.id})">
                    🎮 开始游戏
                </button>
            </div>
        </div>
    `).join('');
}

// 获取分类中文名称
function getCategoryName(category) {
    const categoryNames = {
        'puzzle': '益智',
        'action': '动作',
        'casual': '休闲',
        'strategy': '策略'
    };
    return categoryNames[category] || category;
}

// 过滤游戏
function filterGames() {
    let filteredGames = games;

    // 按分类过滤
    if (currentCategory !== 'all') {
        filteredGames = filteredGames.filter(game => game.category === currentCategory);
    }

    // 按搜索词过滤
    if (currentSearchTerm) {
        filteredGames = filteredGames.filter(game => 
            game.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            game.description.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );
    }

    renderGames(filteredGames);
}

// 搜索功能
searchInput.addEventListener('input', function(e) {
    currentSearchTerm = e.target.value;
    filterGames();
});

// 分类过滤功能
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // 更新按钮状态
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // 更新当前分类
        currentCategory = this.dataset.category;
        
        // 过滤游戏
        filterGames();
    });
});

// 播放游戏功能
function playGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (game) {
        // 这里可以添加实际的游戏启动逻辑
        alert(`🎮 正在启动 "${game.title}"...\n\n${game.description}\n\n(这是一个演示，实际游戏功能需要进一步开发)`);
        
        // 可以在这里添加跳转到具体游戏页面的逻辑
        // window.location.href = `games/${game.id}/index.html`;
    }
}

// 添加一些交互动画
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        } else {
            card.style.transform = '';
        }
    });
});

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // ESC 清空搜索
    if (e.key === 'Escape') {
        searchInput.value = '';
        currentSearchTerm = '';
        filterGames();
        searchInput.blur();
    }
});

// 添加搜索框占位符动画
const placeholders = [
    '搜索游戏...',
    '试试"俄罗斯方块"',
    '试试"贪吃蛇"',
    '试试"太空射击"',
    '按 Ctrl+K 快速搜索'
];

let placeholderIndex = 0;
setInterval(() => {
    if (searchInput !== document.activeElement && !searchInput.value) {
        searchInput.placeholder = placeholders[placeholderIndex];
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }
}, 3000);