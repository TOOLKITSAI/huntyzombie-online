# 🎮 Hunty Zombie Online - Game Information Website

A comprehensive game information website for Hunty Zombie (Roblox), featuring game codes, wiki, guides, scripts, and more. Built with pure HTML/CSS/JS for easy deployment on Cloudflare Pages.

## 🚀 Features

- **Active Codes System** - Real-time game codes with expiration tracking
- **Game Wiki** - Complete database of weapons, zombies, maps, perks, and pets
- **Guides & Tutorials** - Beginner and advanced strategies
- **Scripts & Tools** - Legal automation tools and helpers
- **Responsive Design** - Optimized for all devices
- **Dark Gaming Theme** - Cyberpunk-inspired visual design
- **Multi-language Support** - EN, ZH, JA, KO
- **PWA Support** - Installable as a mobile app

## 📋 Completed Pages

- ✅ **Homepage** (`index.html`) - Main landing page with hero section, latest codes, and featured content
- ✅ **Codes Center** (`/codes/`) - Complete list of active and expired game codes
- ✅ **Wiki Hub** (`/wiki/`) - Central hub for all game information
- ✅ **Guides Section** (`/guides/`) - Tutorials and strategies for all skill levels  
- ✅ **Scripts & Tools** (`/scripts/`) - Safe automation scripts and game tools
- ✅ **404 Error Page** (`404.html`) - Custom error page with navigation

## 📁 Project Structure

```
huntyzombie-online/
├── index.html              # Homepage
├── 404.html               # 404 error page
├── manifest.json          # PWA configuration
├── robots.txt            # SEO crawler rules
├── sitemap.xml           # Sitemap for search engines
├── _headers              # Cloudflare security headers
├── _redirects            # URL redirects
├── assets/
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   ├── images/          # Image assets
│   └── data/            # JSON data files
├── codes/                # Codes section pages
├── wiki/                 # Wiki section pages
├── scripts/              # Scripts section pages
└── guides/               # Guides section pages
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: Google Fonts (Orbitron, Rajdhani, JetBrains Mono)
- **Icons**: Font Awesome 6.4.0
- **Hosting**: Cloudflare Pages
- **CDN**: Cloudflare

## 🚀 Deployment

### Deploy to Cloudflare Pages

1. Fork or clone this repository
2. Sign up for [Cloudflare Pages](https://pages.cloudflare.com/)
3. Connect your GitHub repository
4. Deploy with these settings:
   - Build command: (leave empty - static site)
   - Build output directory: `/`
   - Root directory: `/`

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/huntyzombie-online.git
cd huntyzombie-online
```

2. Serve locally using the included Python server:
```bash
# Using the included server script (recommended)
python3 server.py

# Or using Python's built-in server
python3 -m http.server 8000

# Or using Node.js
npx serve

# Or using VS Code Live Server extension
# Right-click index.html -> Open with Live Server
```

3. Visit `http://localhost:8000` in your browser

4. Navigate to different sections:
   - Homepage: `http://localhost:8000/`
   - Codes: `http://localhost:8000/codes/`
   - Wiki: `http://localhost:8000/wiki/`
   - Guides: `http://localhost:8000/guides/`
   - Scripts: `http://localhost:8000/scripts/`

## 📝 Content Management

### Adding New Codes

Edit `/assets/data/codes.json`:
```json
{
  "code": "NEWCODE2025",
  "status": "active",
  "rewards": ["1000 Coins", "Epic Weapon"],
  "expires": "2025-12-31T23:59:59Z"
}
```

### Updating Game Data

- Weapons: `/assets/data/weapons.json`
- Zombies: `/assets/data/zombies.json`
- Maps: `/assets/data/maps.json`

## 🎨 Customization

### Colors

Edit CSS variables in `/assets/css/main.css`:
```css
:root {
  --primary-dark: #0A0E1A;
  --accent-green: #00FF88;
  --accent-blue: #00D4FF;
  /* ... more colors */
}
```

### Fonts

Modify font imports in HTML files or CSS:
```css
--font-display: 'Orbitron', sans-serif;
--font-body: 'Rajdhani', sans-serif;
```

## 📊 SEO Optimization

- Semantic HTML5 structure
- Schema.org structured data
- Open Graph meta tags
- Twitter Card meta tags
- XML sitemap
- Optimized robots.txt

## 🔒 Security Features

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- Permissions Policy

## 📱 Progressive Web App

The site is PWA-ready with:
- Service Worker support (to be implemented)
- Offline functionality
- App manifest
- Install prompts

## 🌍 Multi-language Support

Supported languages:
- English (EN) - Default
- Chinese (ZH)
- Japanese (JA)
- Korean (KO)

Access language versions:
- `/?lang=en` - English
- `/?lang=zh` - Chinese
- `/?lang=ja` - Japanese
- `/?lang=ko` - Korean

## 📈 Analytics

To add Google Analytics:
1. Get your GA4 measurement ID
2. Add to all HTML files before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 💰 Monetization

Google AdSense integration ready:
1. Sign up for [Google AdSense](https://www.google.com/adsense/)
2. Get your publisher ID
3. Add ad units to desired pages
4. Update `data-ad-client` and `data-ad-slot` in HTML

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes. Hunty Zombie is owned by its respective creators on Roblox.

## ⚠️ Disclaimer

This is an unofficial fan site and is not affiliated with Roblox Corporation or the creators of Hunty Zombie.

## 📞 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Last Updated**: August 29, 2025