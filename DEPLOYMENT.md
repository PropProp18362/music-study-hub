# 🚀 Deployment Guide - Music Study Hub

This guide covers multiple free deployment options for your Spotify web app.

## 🌟 Recommended: Vercel (Easiest)

Vercel is perfect for this project because it handles both static files and serverless functions.

### Step 1: Prepare for Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

### Step 2: Create vercel.json

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "SPOTIFY_CLIENT_ID": "@spotify_client_id",
    "SPOTIFY_CLIENT_SECRET": "@spotify_client_secret"
  }
}
```

### Step 3: Deploy

```bash
# Deploy
vercel

# Add environment variables
vercel env add SPOTIFY_CLIENT_ID
vercel env add SPOTIFY_CLIENT_SECRET

# Redeploy with environment variables
vercel --prod
```

### Step 4: Update Spotify App Settings

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Edit your app
3. Add your Vercel URL to Redirect URIs: `https://your-app.vercel.app`

## 🔥 Alternative: Netlify

Great for static sites with serverless functions.

### Step 1: Create netlify.toml

```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "."

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Create Netlify Functions

Create `netlify/functions/token.js`:

```javascript
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { code, redirect_uri } = JSON.parse(event.body);
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri
      })
    });

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Step 3: Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

## ⚡ Railway

Perfect for full-stack apps with databases.

### Step 1: Connect Repository

1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Deploy automatically

### Step 2: Set Environment Variables

In Railway dashboard:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `PORT` (Railway sets this automatically)

## 🎯 Render

Great free tier for web services.

### Step 1: Create render.yaml

```yaml
services:
  - type: web
    name: music-study-hub
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SPOTIFY_CLIENT_ID
        fromDatabase: false
      - key: SPOTIFY_CLIENT_SECRET
        fromDatabase: false
```

### Step 2: Deploy

1. Connect your GitHub repo to Render
2. Set environment variables
3. Deploy automatically

## 🏠 Self-Hosting Options

### Option 1: Home Server with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Run your app
npm start

# In another terminal, expose it
ngrok http 3000
```

### Option 2: VPS (DigitalOcean, Linode, etc.)

```bash
# On your VPS
git clone your-repo
cd your-repo
npm install
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name music-study-hub
pm2 startup
pm2 save
```

## 📱 Making it School-Friendly

### Custom Domain

1. Buy a domain that sounds educational:
   - `studymusicplatform.com`
   - `educationalfocus.app`
   - `learningenhancer.net`

2. Point it to your deployment

### SSL Certificate

All deployment platforms provide free SSL certificates automatically.

### Content Optimization

The app is already designed to be school-friendly:
- Educational branding
- Study-focused interface
- No obvious Spotify references
- CIPP compliant design

## 🔧 Environment Variables Checklist

For any deployment platform, you need:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NODE_ENV=production
REDIRECT_URI=https://yourdomain.com
```

## 🚨 Important Notes

1. **HTTPS Required**: Spotify Web Playback SDK requires HTTPS in production
2. **Redirect URI**: Must match exactly in Spotify app settings
3. **Premium Account**: Required for playback functionality
4. **CORS**: Handled automatically by the server

## 📊 Monitoring

### Free Monitoring Options

1. **Vercel Analytics** - Built-in for Vercel deployments
2. **Netlify Analytics** - Built-in for Netlify deployments
3. **Google Analytics** - Add to your HTML
4. **Uptime Robot** - Monitor uptime for free

## 🔄 Continuous Deployment

All recommended platforms support automatic deployment from GitHub:

1. Push to your main branch
2. Platform automatically builds and deploys
3. Your app is updated within minutes

## 💡 Pro Tips

1. **Use Environment Variables**: Never commit secrets to Git
2. **Test Locally First**: Always test with `npm start` before deploying
3. **Monitor Logs**: Check deployment logs if something goes wrong
4. **Backup Strategy**: Keep your code in Git, environment variables documented
5. **Domain Strategy**: Use educational-sounding domain names

## 🆘 Troubleshooting Deployment

### Common Issues

**Build Fails**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check for syntax errors

**Environment Variables Not Working**
- Verify variable names match exactly
- Check platform-specific syntax
- Restart the service after adding variables

**Spotify Authentication Fails**
- Verify redirect URI matches deployment URL
- Check client ID and secret are correct
- Ensure HTTPS is enabled

**App Loads But No Music**
- Check Spotify Premium account
- Verify Web Playback SDK loads over HTTPS
- Check browser console for errors

---

Choose the deployment option that best fits your needs. Vercel is recommended for beginners, while Railway or Render are great for more advanced setups.