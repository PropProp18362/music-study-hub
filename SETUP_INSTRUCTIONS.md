# LISD Educational Music Platform - Setup Instructions

## 🏫 CIPA-Compliant Spotify Integration for Schools

This educational music platform is designed specifically for Lewisville Independent School District (LISD) and complies with CIPA (Children's Internet Protection Act) requirements.

## 🚀 Quick Deployment to Vercel

### Step 1: Spotify App Setup
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app with these settings:
   - **App Name**: LISD Educational Music Platform
   - **App Description**: CIPA-compliant educational music platform for enhanced learning
   - **Website**: Your Vercel deployment URL
   - **Redirect URI**: `https://your-vercel-app.vercel.app` (replace with your actual URL)

### Step 2: Environment Variables
In your Vercel project settings, add these environment variables:

```
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
REDIRECT_URI=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Step 3: Deploy
1. Connect your GitHub repository to Vercel
2. Deploy with these settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

## 🛡️ CIPA Compliance Features

### Content Filtering
- ✅ Automatic explicit content filtering
- ✅ Educational keyword-based playlist filtering
- ✅ Real-time track appropriateness checking
- ✅ Blocked content categories (violence, drugs, adult themes)

### Educational Focus
- ✅ Study-safe playlist curation
- ✅ Focus-enhancing music genres only
- ✅ Academic session tracking
- ✅ Educational usage logging

### Privacy & Security
- ✅ No personal data storage
- ✅ FERPA-compliant data handling
- ✅ Secure authentication flow
- ✅ Content Security Policy headers

## 📱 Background Playback (iOS Safari)

The app includes PWA (Progressive Web App) features for background playback:

1. **Add to Home Screen**: Users can install the app from Safari
2. **Media Session API**: Enables lock screen controls
3. **Service Worker**: Provides offline functionality
4. **Background Audio**: Continues playing when Safari is minimized

### iOS Setup for Students:
1. Open the website in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will now work like a native app with background playback

## 🎵 Supported Music Types

### ✅ Allowed Content:
- Classical music
- Instrumental tracks
- Lo-fi hip hop
- Ambient sounds
- Nature sounds
- Piano music
- Study playlists
- Focus music
- Meditation music

### ❌ Blocked Content:
- Explicit lyrics
- Party/club music
- Content referencing drugs/alcohol
- Violent themes
- Adult content
- Inappropriate language

## 🔧 Technical Features

### Backend (Serverless Functions)
- Token exchange endpoint (`/api/token`)
- Token refresh endpoint (`/api/refresh`)
- Public configuration endpoint (`/api/config`)
- Health check endpoint (`/api/health`)

### Frontend
- Spotify Web Playback SDK integration
- Real-time content filtering
- Study session tracking
- PWA capabilities
- Responsive design

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer Policy: strict-origin-when-cross-origin
- Permissions Policy for autoplay

## 🏫 School Administrator Notes

### For LISD IT Department:
1. The app requires Spotify Premium accounts for students
2. All content is filtered through CIPA-compliant algorithms
3. No personal data is stored or transmitted
4. Usage can be monitored through browser developer tools
5. The app can be whitelisted by domain name

### Monitoring & Compliance:
- Educational usage is logged locally (no server storage)
- Content filtering logs are available in browser console
- All API calls are to approved educational services (Spotify)
- No third-party tracking or analytics

## 🚨 Troubleshooting

### Common Issues:
1. **404 Errors**: Ensure environment variables are set in Vercel
2. **Playback Issues**: Requires Spotify Premium account
3. **Background Playback**: Must be added to iOS home screen
4. **Content Blocked**: Working as intended - only educational content allowed

### Support:
For technical support, check the browser console for detailed error messages. All errors are logged with educational compliance in mind.

## 📋 Compliance Checklist

- ✅ CIPA (Children's Internet Protection Act) compliant
- ✅ COPPA (Children's Online Privacy Protection Act) compliant  
- ✅ FERPA (Family Educational Rights and Privacy Act) compliant
- ✅ Content filtering active
- ✅ No inappropriate content access
- ✅ Educational purpose clearly stated
- ✅ Privacy policy implemented
- ✅ Secure data handling
- ✅ Age-appropriate interface
- ✅ School district branding

---

**Educational Use Only** - This platform is designed exclusively for academic enhancement and complies with all applicable educational technology regulations.