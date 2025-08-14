# 🎵 Music Study Hub - Educational Spotify Integration

A CIPP-compliant web application that provides access to Spotify through an educational music platform interface. Designed specifically for school environments with strict content policies.

## ✨ Features

- 🎧 **Full Spotify Integration** - Stream your Premium Spotify content
- 📚 **Educational Interface** - Disguised as a study productivity tool
- 🔒 **CIPP Compliant** - Follows institutional content policies
- 📱 **PWA Support** - Install as an app on iPad/mobile devices
- ⏱️ **Study Timer** - Track your study sessions
- 🎨 **Clean UI** - Professional, educational appearance
- 🔄 **Offline Support** - Works even with limited connectivity
- 🛡️ **Secure** - Proper OAuth implementation with backend token handling

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ installed
- Spotify Premium account
- Spotify Developer account (free)

### 1. Spotify App Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in the details:
   - **App Name**: Music Study Hub
   - **App Description**: Educational music platform for enhanced learning
   - **Website**: Your domain (or http://localhost:3000 for testing)
   - **Redirect URI**: `http://localhost:3000` (or your domain)
4. Save your **Client ID** and **Client Secret**

### 2. Project Setup

```bash
# Clone or download the project
cd SchoolIpadSpotifyHack

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your Spotify credentials
# SPOTIFY_CLIENT_ID=your_client_id_here
# SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

### 3. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Open http://localhost:3000 in your browser.

## 📱 Installing on iPad

### Method 1: PWA Installation (Recommended)

1. Open Safari on your iPad
2. Navigate to your deployed app URL
3. Tap the Share button
4. Select "Add to Home Screen"
5. The app will install as a native-looking app

### Method 2: Web Bookmark

1. Open the app in Safari
2. Bookmark it for easy access
3. The app works fully in the browser

## 🌐 Deployment Options

### Free Hosting Options

#### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

#### 2. Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### 3. Railway
```bash
# Connect your GitHub repo to Railway
# Set environment variables in Railway dashboard
```

#### 4. Render
- Connect your GitHub repository
- Set environment variables
- Deploy automatically

### Environment Variables for Production

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
REDIRECT_URI=https://yourdomain.com
NODE_ENV=production
```

## 🔧 Configuration

### Spotify App Settings

In your Spotify app dashboard, make sure to add these redirect URIs:
- `http://localhost:3000` (for development)
- `https://yourdomain.com` (for production)

### CIPP Compliance Features

- Educational branding and terminology
- Study session tracking
- Focus-oriented interface
- Productivity features
- Proper content security policies
- No obvious Spotify branding in the interface

## 🛠️ Customization

### Changing the App Name/Branding

Edit these files:
- `index.html` - Update title and meta tags
- `manifest.json` - Update app name and description
- `styles.css` - Customize colors and styling

### Adding Custom Playlists

Modify the `createDefaultPlaylists()` function in `app.js` to add your preferred study playlists.

### Styling

The app uses CSS custom properties for easy theming. Main colors:
- Primary: `#667eea`
- Secondary: `#764ba2`
- Background: Linear gradient

## 📋 Usage Instructions

1. **First Time Setup**:
   - Click "Connect Educational Account"
   - Log in with your Spotify Premium account
   - Grant permissions

2. **Playing Music**:
   - Browse your playlists in the "Educational Playlists" section
   - Click any playlist to start playing
   - Use the player controls to manage playback

3. **Study Timer**:
   - Click "Start Session" to begin timing your study session
   - The timer runs independently of music playback

4. **Offline Mode**:
   - The app caches itself for offline access
   - Music streaming requires internet connection

## 🔒 Security & Privacy

- All authentication is handled securely via OAuth 2.0
- Tokens are stored locally and expire automatically
- No user data is collected or stored on servers
- HTTPS enforced in production
- Content Security Policy implemented

## 🐛 Troubleshooting

### Common Issues

**"Authentication failed"**
- Check your Spotify Client ID and Secret
- Verify redirect URI matches exactly
- Ensure you have Spotify Premium

**"Player initialization failed"**
- Make sure you're using HTTPS in production
- Check browser compatibility (Chrome/Safari recommended)
- Verify Spotify Premium account

**"No playlists showing"**
- Check your Spotify account has playlists
- Verify API permissions were granted
- Try refreshing the page

### Browser Compatibility

- ✅ Safari (iOS/macOS)
- ✅ Chrome (all platforms)
- ✅ Firefox (desktop)
- ✅ Edge (desktop)
- ❌ Internet Explorer (not supported)

## 📚 Technical Details

### Architecture

- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Backend**: Node.js, Express
- **Authentication**: Spotify OAuth 2.0
- **Caching**: Service Worker API
- **PWA**: Web App Manifest

### API Endpoints

- `POST /api/token` - Exchange authorization code for access token
- `POST /api/refresh` - Refresh expired access token
- `GET /api/health` - Health check

### File Structure

```
SchoolIpadSpotifyHack/
├── index.html          # Main app interface
├── styles.css          # Styling and responsive design
├── app.js             # Frontend JavaScript logic
├── server.js          # Backend Express server
├── sw.js              # Service Worker for PWA
├── manifest.json      # PWA manifest
├── package.json       # Node.js dependencies
├── .env.example       # Environment variables template
└── README.md          # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for educational purposes. Users are responsible for complying with their institution's policies and Spotify's Terms of Service. The app requires a Spotify Premium subscription to function properly.

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your Spotify app configuration
3. Check browser console for error messages
4. Ensure all environment variables are set correctly

For additional help, create an issue in the repository with:
- Browser and version
- Error messages
- Steps to reproduce the issue

---

**Made with ❤️ for students who need their music to focus and learn effectively.**# music-study-hub
