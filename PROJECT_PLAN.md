# Hunty Zombie 游戏资讯网站项目规划

> 一个专注于 Hunty Zombie (Roblox) 游戏的综合资讯平台，提供兑换码、Wiki、攻略等内容服务。

## 目录

- [📋 静态网站详细实施计划](#-静态网站详细实施计划)
- [🎨 资讯网站专业设计方案](#-资讯网站专业设计方案)

---

## 📋 静态网站详细实施计划

### 一、技术架构方案

#### 技术栈（适配Cloudflare Pages）
```
核心技术:
├── HTML5 (语义化标签)
├── CSS3 (原生 + Tailwind CSS via CDN)
├── Vanilla JavaScript (ES6+)
├── 静态站点生成: 11ty 或纯HTML
├── 数据存储: JSON文件 + Cloudflare KV
├── API: Cloudflare Workers (无服务器函数)
└── CDN: Cloudflare 全球加速
```

### 二、项目文件结构

```
huntyzombie-online/
├── index.html                 # 首页
├── 404.html                   # 404页面
├── robots.txt                 # SEO爬虫规则
├── sitemap.xml               # 网站地图
├── _headers                  # Cloudflare安全头配置
├── _redirects                # URL重定向规则
├── manifest.json             # PWA配置
├── 
├── /assets/
│   ├── /css/
│   │   ├── main.css         # 主样式
│   │   ├── responsive.css   # 响应式
│   │   └── animations.css   # 动画效果
│   ├── /js/
│   │   ├── app.js          # 主程序
│   │   ├── codes.js        # 兑换码逻辑
│   │   ├── search.js       # 搜索功能
│   │   └── i18n.js         # 多语言
│   ├── /images/
│   │   ├── /weapons/       # 武器图片
│   │   ├── /zombies/       # 僵尸图片
│   │   └── /icons/         # 图标资源
│   └── /data/
│       ├── codes.json      # 兑换码数据
│       ├── weapons.json    # 武器数据
│       ├── zombies.json    # 僵尸数据
│       └── translations.json # 翻译文件
│
├── /codes/
│   ├── index.html          # 兑换码中心
│   ├── active.html         # 活跃码
│   └── expired.html        # 过期码
│
├── /wiki/
│   ├── index.html          # Wiki首页
│   ├── /weapons/
│   │   ├── index.html      # 武器列表
│   │   └── [weapon-id].html # 武器详情页
│   ├── /zombies/
│   │   ├── index.html      # 僵尸图鉴
│   │   └── [zombie-id].html # 僵尸详情
│   ├── /maps/
│   │   ├── index.html      # 地图列表
│   │   └── [map-id].html   # 地图攻略
│   ├── /perks/
│   │   └── index.html      # 技能树
│   └── /pets/
│       └── index.html      # 宠物系统
│
├── /scripts/
│   ├── index.html          # 脚本中心
│   ├── legal.html          # 合法脚本
│   └── automation.html     # 自动化工具
│
├── /guides/
│   ├── index.html          # 攻略首页
│   ├── beginner.html       # 新手教程
│   ├── advanced.html       # 进阶技巧
│   └── videos.html         # 视频攻略
│
└── /api/                   # Cloudflare Workers
    ├── verify-code.js      # 验证兑换码
    ├── fetch-data.js       # 获取游戏数据
    └── analytics.js        # 数据统计
```

### 三、核心页面开发计划

#### 1. 首页 (index.html)
```html
功能模块:
- Hero区域: 游戏介绍 + CTA按钮
- 最新兑换码轮播
- 热门攻略推荐
- 实时游戏数据展示
- 更新公告栏
- 快速导航卡片
```

#### 2. 兑换码系统 (/codes/)
```javascript
核心功能:
- 自动刷新码列表（每小时）
- 一键复制功能
- 验证状态显示（有效/过期/已使用）
- 倒计时显示
- 筛选和搜索
- 本地存储已使用记录
```

#### 3. Wiki系统 (/wiki/)
```javascript
数据结构设计:
- JSON数据驱动
- 客户端渲染
- 懒加载图片
- 离线缓存支持
- 筛选器（稀有度/类型/属性）
```

### 四、SEO优化实施方案

#### 1. 技术SEO
```html
<!-- 每个页面必备的SEO标签 -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="页面描述">
<meta name="keywords" content="hunty zombie, codes, wiki">
<link rel="canonical" href="https://yourdomain.com/current-page">

<!-- Open Graph -->
<meta property="og:title" content="页面标题">
<meta property="og:description" content="页面描述">
<meta property="og:image" content="分享图片">

<!-- Schema.org结构化数据 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "GameApplication",
  "name": "Hunty Zombie",
  "applicationCategory": "Game"
}
</script>
```

#### 2. 性能优化
```javascript
实施策略:
- 图片: WebP格式 + 懒加载
- CSS/JS: 压缩 + 内联关键CSS
- HTML: 压缩 + Gzip
- 缓存: Service Worker + CDN
- 预加载: 关键资源预取
```

#### 3. 多语言支持
```javascript
// i18n.js 实现
const languages = {
  'en': 'English (默认)',
  'zh': '简体中文',
  'ja': '日本語',
  'ko': '한국어'
};

// URL结构: /en/codes/, /zh/codes/
// 或使用参数: ?lang=zh
```

### 五、Cloudflare部署配置

#### 1. Pages配置
```yaml
# .cloudflare/config.yml
build:
  command: ""  # 纯静态无需构建
  publish: "/"

headers:
  /*:
    X-Frame-Options: SAMEORIGIN
    X-Content-Type-Options: nosniff
    Cache-Control: public, max-age=3600

redirects:
  - from: /old-codes
    to: /codes
    status: 301
```

#### 2. Workers脚本示例
```javascript
// api/verify-code.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 从KV存储获取码状态
  const status = await CODES_KV.get(code)
  
  return new Response(JSON.stringify({
    code,
    valid: status === 'active',
    expiry: '2025-09-01'
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

### 六、Google AdSense集成

```html
<!-- 在需要广告的位置插入 -->
<div class="ad-container">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-YOUR-ID"
       data-ad-slot="YOUR-SLOT"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

### 七、内容更新机制

```javascript
// 自动更新系统设计
1. GitHub Actions定时任务
   - 每日爬取官方数据
   - 更新JSON文件
   - 自动部署到Cloudflare

2. 手动更新面板
   - 简单的管理界面
   - 通过Workers API更新KV数据
   - 无需重新部署

3. 社区贡献
   - GitHub Pull Request
   - 表单提交系统
```

### 八、开发优先级和时间线

```
第一阶段（3-5天）:
├── 创建基础HTML结构
├── 实现响应式CSS
├── 首页完成
└── 部署到Cloudflare Pages

第二阶段（5-7天）:
├── 兑换码页面完整功能
├── Wiki基础页面
├── JSON数据结构设计
└── 基础JavaScript功能

第三阶段（7-10天）:
├── 完善所有Wiki内容
├── 实现搜索功能
├── 多语言支持
└── SEO优化

第四阶段（持续）:
├── 内容填充
├── 性能优化
├── 用户反馈改进
└── 新功能迭代
```

### 九、具体文件创建清单

1. **index.html** - 主页
2. **main.css** - 主样式文件
3. **app.js** - 核心JavaScript
4. **codes/index.html** - 兑换码页面
5. **wiki/index.html** - Wiki首页
6. **codes.json** - 兑换码数据
7. **_headers** - Cloudflare配置
8. **manifest.json** - PWA配置
9. **robots.txt** - SEO配置
10. **README.md** - 项目说明

---

## 🎨 资讯网站专业设计方案

### 一、核心设计理念

#### 设计风格定位：Dark Gaming + Neon Accent
```
主题风格：后启示录科技感 + 霓虹赛博朋克元素
设计语言：现代扁平化 + 微质感 + 动态交互
用户体验：信息密度高但不杂乱，游戏感强但不幼稚
```

### 二、视觉设计系统

#### 1. 色彩方案
```css
/* 主色调 - 暗黑科技感 */
--primary-dark: #0A0E1A      /* 深空黑 - 主背景 */
--secondary-dark: #151923     /* 碳灰 - 卡片背景 */
--tertiary-dark: #1E2430      /* 钢铁灰 - 边框/分割线 */

/* 强调色 - 霓虹感 */
--accent-red: #FF3E3E         /* 血红 - 危险/警告/僵尸主题 */
--accent-green: #00FF88       /* 霓虹绿 - 成功/活跃码 */
--accent-blue: #00D4FF        /* 赛博蓝 - 链接/交互 */
--accent-purple: #B833FF      /* 电紫 - 稀有/史诗物品 */
--accent-gold: #FFD700        /* 金色 - 传说/特殊 */

/* 功能色 */
--text-primary: #FFFFFF       /* 主文字 */
--text-secondary: #B8BCC8     /* 次要文字 */
--text-muted: #6C7380        /* 禁用/提示文字 */

/* 渐变色 */
--gradient-hero: linear-gradient(135deg, #FF3E3E 0%, #B833FF 100%);
--gradient-glow: radial-gradient(circle, rgba(255,62,62,0.3) 0%, transparent 70%);
```

#### 2. 排版系统
```css
/* 字体选择 */
--font-display: 'Orbitron', 'Black Ops One', sans-serif;  /* 标题 - 科技感 */
--font-body: 'Rajdhani', 'Russo One', sans-serif;         /* 正文 - 游戏感 */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;    /* 代码/数据 */
--font-chinese: 'Noto Sans SC', 'Microsoft YaHei';        /* 中文支持 */

/* 字体大小体系 */
--text-xs: 0.75rem;    /* 12px - 标签/徽章 */
--text-sm: 0.875rem;   /* 14px - 辅助信息 */
--text-base: 1rem;     /* 16px - 正文 */
--text-lg: 1.125rem;   /* 18px - 副标题 */
--text-xl: 1.5rem;     /* 24px - 标题 */
--text-2xl: 2rem;      /* 32px - 大标题 */
--text-3xl: 3rem;      /* 48px - Hero标题 */
```

#### 3. 网格与间距
```css
/* 响应式网格系统 */
--grid-cols-mobile: 1;
--grid-cols-tablet: 2;
--grid-cols-desktop: 3;
--grid-cols-wide: 4;

/* 间距系统 (8px基准) */
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-5: 3rem;     /* 48px */
```

### 三、UI组件设计

#### 1. 导航栏设计
```html
样式特点：
- 固定顶部 + 毛玻璃效果
- Logo带霓虹发光动画
- 悬浮菜单项有扫描线效果
- 移动端抽屉式菜单带故障艺术动画

视觉效果：
┌──────────────────────────────────────┐
│ [≡] HUNTY ZOMBIE  [CODES][WIKI][GUIDE]│ <- 半透明背景+模糊
└──────────────────────────────────────┘
```

#### 2. 卡片组件
```css
特效设计：
- 边框：霓虹渐变光效
- 悬浮：向上浮动 + 阴影增强
- 点击：脉冲波纹效果
- 背景：暗色毛玻璃 + 噪点纹理

┌─────────────────────┐
│ ░░░░░░░░░░░░░░░░░░  │ <- 扫描线动画
│ [WEAPON NAME]       │
│ ▓▓▓▓▓▓▓▓░░ 70%     │ <- 进度条
│ DMG: 999 | SPD: A+  │
└─────────────────────┘
```

#### 3. 按钮系统
```css
/* 主按钮 - 霓虹边框 */
.btn-primary {
  background: transparent;
  border: 2px solid var(--accent-green);
  box-shadow: 
    0 0 20px rgba(0,255,136,0.5),
    inset 0 0 20px rgba(0,255,136,0.1);
  transition: all 0.3s;
}

/* 悬浮效果 */
.btn-primary:hover {
  background: var(--accent-green);
  color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 
    0 10px 40px rgba(0,255,136,0.7),
    0 0 0 2px rgba(0,255,136,0.3);
}
```

### 四、特色视觉元素

#### 1. 背景设计
```css
/* 动态背景 */
- 粒子系统：漂浮的灰烬/雪花效果
- 扫描线：CRT显示器扫描线动画
- 网格背景：赛博朋克风格网格
- 故障效果：随机glitch动画

/* 实现示例 */
.hero-background {
  background: 
    linear-gradient(180deg, transparent 0%, #0A0E1A 100%),
    url('grid-pattern.svg'),
    radial-gradient(circle at 20% 50%, #FF3E3E22 0%, transparent 50%);
  animation: scan-lines 8s linear infinite;
}
```

#### 2. 数据可视化
```javascript
// 武器属性雷达图
样式：霓虹线条 + 半透明填充
颜色：根据稀有度变化

// 伤害计算器
样式：赛博朋克仪表盘
动画：数字滚动效果

// 兑换码倒计时
样式：LED数字显示
效果：紧急时闪烁红光
```

#### 3. 加载动画
```css
设计方案：
1. DNA螺旋加载器（病毒主题）
2. 弹药装填动画（射击主题）
3. 心跳监测线（生存主题）
4. 故障文字效果（赛博主题）
```

### 五、响应式设计策略

#### 移动端优化（Mobile First）
```css
/* 断点设计 */
--breakpoint-sm: 640px;   /* 手机 */
--breakpoint-md: 768px;   /* 平板 */
--breakpoint-lg: 1024px;  /* 笔记本 */
--breakpoint-xl: 1280px;  /* 桌面 */
--breakpoint-2xl: 1536px; /* 宽屏 */

移动端特殊处理：
- 触摸优化：按钮最小44x44px
- 滑动手势：左右切换页面
- 底部导航：固定快捷菜单
- 折叠内容：手风琴式展开
```

### 六、交互动效设计

#### 1. 微交互
```javascript
// 鼠标跟随效果
- 光标变为准星
- 悬浮元素发光
- 点击产生爆炸粒子

// 滚动效果
- 视差滚动背景
- 元素渐入动画
- 进度指示器

// 声音反馈（可选）
- 悬浮：金属音
- 点击：射击音
- 成功：升级音
```

#### 2. 页面过渡
```css
/* 页面切换动画 */
1. 故障切换：glitch效果过渡
2. 扫描过渡：从上到下扫描线
3. 像素化：像素分解重组
4. 爆炸过渡：中心爆炸扩散
```

### 七、特色页面设计

#### 1. 首页 Hero 区域
```
设计布局：
┌────────────────────────────────┐
│  HUNTY ZOMBIE                  │ <- 大标题+故障效果
│  SURVIVE THE APOCALYPSE        │ <- 打字机动画
│                                │
│  [▶ PLAY NOW] [GET CODES]      │ <- 霓虹按钮
│                                │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░    │ <- 实时数据滚动
└────────────────────────────────┘
```

#### 2. 兑换码页面
```css
特色设计：
- 验证状态：绿色✓发光 / 红色✗闪烁
- 复制按钮：点击后DNA螺旋动画
- 倒计时：最后1小时变红+心跳效果
- 新代码：顶部通知栏滑入+霓虹边框
```

#### 3. Wiki页面
```css
信息架构：
- 左侧：浮动目录+进度条
- 中间：内容区+图片灯箱
- 右侧：相关推荐+快速跳转
- 底部：评论系统+贡献者
```

### 八、性能优化设计

```javascript
视觉性能平衡：
1. 关键动画：60FPS（导航、按钮）
2. 装饰动画：30FPS（背景粒子）
3. 懒加载：图片、非首屏动画
4. 降级方案：低端设备关闭特效
5. 暗黑模式：默认启用减少耗电
```

### 九、无障碍设计

```css
可访问性考虑：
- 高对比模式：增强文字可读性
- 焦点指示：键盘导航清晰
- 屏幕阅读：语义化HTML
- 动画控制：可关闭动效
- 字体缩放：响应系统设置
```

### 十、品牌一致性

```
设计系统文档：
1. Logo规范：最小尺寸、安全区域
2. 图标库：统一的游戏图标集
3. 插画风格：像素艺术/低多边形
4. 截图规范：统一边框和阴影
5. 社交媒体：模板化设计
```

---

## 项目特点总结

### 技术优势
- ✅ **完全静态网站**：适合Cloudflare Pages部署
- ✅ **高性能**：利用CDN和缓存技术
- ✅ **SEO友好**：结构化数据和多语言支持
- ✅ **易于维护**：JSON数据驱动
- ✅ **可扩展**：模块化设计

### 设计亮点
- ⚡ **视觉冲击力强**：符合游戏主题的暗黑赛博风
- 🎮 **游戏沉浸感**：丰富的动效和交互反馈
- 📱 **全平台适配**：响应式设计优化体验
- 🚀 **性能优秀**：渐进增强，核心内容优先
- ♿ **包容性设计**：考虑各类用户需求

### 设计灵感来源
- Cyberpunk 2077 官网
- Valorant 游戏界面
- Discord 暗色主题
- Steam 游戏商店

---

## 联系方式

如需项目相关支持或有任何问题，请通过以下方式联系：

- GitHub Issues: [项目仓库]
- Email: [联系邮箱]

---

*最后更新时间：2025年8月29日*