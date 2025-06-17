# 小游戏列表 - Google登录集成

这是一个带有Google账户登录功能的小游戏列表页面。用户需要登录Google账户才能开始游戏。

## 功能特性

- 🎮 游戏列表展示（卡片式布局）
- 🔍 搜索和分类筛选功能
- 🔐 Google账户登录验证
- 👤 用户状态管理
- 📱 响应式设计
- ⌨️ 键盘快捷键支持

## Google登录配置

### 1. 获取Google Client ID

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建OAuth 2.0客户端ID凭据
5. 在"已授权的JavaScript来源"中添加您的域名
6. 复制客户端ID

### 2. 配置应用

在 `script.js` 文件中找到以下行：
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
```

将 `YOUR_GOOGLE_CLIENT_ID` 替换为您的实际Google Client ID。

同时在 `index.html` 中更新：
```html
data-client_id="YOUR_GOOGLE_CLIENT_ID"
```

### 3. 本地测试

由于Google登录需要HTTPS或localhost，建议：
- 使用 `localhost` 进行本地开发
- 部署到HTTPS域名进行生产环境测试

## 使用说明

### 用户登录流程

1. 用户点击"开始游戏"按钮
2. 如果未登录，显示登录模态框
3. 用户点击"使用Google登录"
4. 完成Google OAuth验证
5. 登录成功后可以开始游戏

### 用户界面

- **未登录状态**：显示Google登录按钮
- **已登录状态**：显示用户头像、姓名和退出按钮
- **登录模态框**：当用户尝试开始游戏但未登录时显示

### 键盘快捷键

- `Ctrl+K` / `Cmd+K`：快速聚焦搜索框
- `ESC`：清空搜索或关闭模态框

## 技术实现

### 前端技术栈

- HTML5 + CSS3 + JavaScript (ES6+)
- Google Sign-In API
- LocalStorage 用户状态持久化
- 响应式设计

### 主要功能模块

1. **用户认证模块**
   - Google OAuth 2.0集成
   - JWT token解析
   - 用户状态管理

2. **游戏列表模块**
   - 动态卡片渲染
   - 搜索和筛选功能
   - 交互动画效果

3. **UI交互模块**
   - 模态框管理
   - 键盘快捷键
   - 响应式布局

## 部署说明

1. 确保所有文件都在同一目录下
2. 配置正确的Google Client ID
3. 部署到支持HTTPS的服务器
4. 在Google Cloud Console中添加部署域名到授权来源

## 安全注意事项

- Client ID可以公开，但不要泄露Client Secret
- 用户token存储在localStorage中，仅用于前端状态管理
- 生产环境中应该验证token的有效性
- 建议实现服务端token验证

## 开发计划

- [ ] 添加实际的游戏页面
- [ ] 实现游戏进度保存
- [ ] 添加用户排行榜
- [ ] 支持更多登录方式
- [ ] 添加游戏评分和评论功能
