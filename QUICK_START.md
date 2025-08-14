# 🚀 Quick Start Guide - Music Study Hub

Get your Spotify web app running in 5 minutes!

## 📋 Prerequisites

- ✅ Spotify Premium account
- ✅ Node.js installed (download from nodejs.org)
- ✅ Basic computer skills

## 🎯 Step 1: Spotify App Setup (2 minutes)

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **"Create App"**
3. Fill in:
   - **App Name**: Music Study Hub
   - **App Description**: Educational music platform
   - **Website**: http://localhost:3000
   - **Redirect URI**: http://localhost:3000
4. Click **"Save"**
5. Copy your **Client ID** and **Client Secret**

## ⚡ Step 2: Project Setup (1 minute)

Open terminal/command prompt in the project folder:

```bash
# Install dependencies
npm install

# Run setup wizard
npm run setup
```

The setup wizard will ask for:
- Your Spotify Client ID
- Your Spotify Client Secret
- Port number (just press Enter for default)

## 🎵 Step 3: Start the App (30 seconds)

```bash
# Start the server
npm start
```

Open http://localhost:3000 in your browser!

## 📱 Step 4: Install on iPad (1 minute)

### Option A: PWA Installation (Recommended)
1. Open Safari on your iPad
2. Go to your app URL
3. Tap Share button → "Add to Home Screen"
4. App installs like a native app!

### Option B: Just bookmark it
1. Open the app in Safari
2. Bookmark it for easy access

## 🌐 Step 5: Deploy Online (Optional)

For free hosting, check `DEPLOYMENT.md` for options like:
- Vercel (recommended)
- Netlify
- Railway
- Render

## 🎓 School-Friendly Features

✅ **Educational Interface** - Looks like a study tool
✅ **CIPP Compliant** - Follows school content policies  
✅ **Study Timer** - Track your study sessions
✅ **Focus Branding** - No obvious Spotify references
✅ **PWA Support** - Works offline, installs like an app

## 🔧 Troubleshooting

**"Authentication failed"**
- Double-check your Client ID and Secret
- Make sure redirect URI is exactly: http://localhost:3000

**"Premium required"**
- You need Spotify Premium for playback
- Free accounts can't stream through the Web API

**"Player won't load"**
- Try Chrome or Safari
- Make sure you're using HTTPS in production
- Check browser console for errors

## 📞 Need Help?

1. Check the full `README.md` for detailed instructions
2. Look at `DEPLOYMENT.md` for hosting options
3. Check browser console for error messages

## 🎉 You're Done!

Your Spotify web app is now running and ready to use on your school iPad. The interface looks educational and professional while giving you full access to your Spotify Premium content.

**Pro Tip**: Once deployed online, you can access it from any device, anywhere, without restrictions!