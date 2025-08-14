// Simple Express server for Spotify token exchange
// This handles the OAuth flow securely on the backend

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Spotify configuration
const SPOTIFY_CONFIG = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI || `http://localhost:${PORT}`
};

// Validate environment variables
if (!SPOTIFY_CONFIG.clientId || !SPOTIFY_CONFIG.clientSecret) {
    console.error('❌ Missing Spotify credentials in environment variables');
    console.log('Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env file');
    process.exit(1);
}

// Token exchange endpoint
app.post('/api/token', async (req, res) => {
    const { code, redirect_uri } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }
    
    try {
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`).toString('base64')}`
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirect_uri || SPOTIFY_CONFIG.redirectUri
            })
        });
        
        const tokenData = await tokenResponse.json();
        
        if (!tokenResponse.ok) {
            throw new Error(tokenData.error_description || 'Token exchange failed');
        }
        
        // Return token data to client
        res.json({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_in: tokenData.expires_in,
            token_type: tokenData.token_type
        });
        
    } catch (error) {
        console.error('Token exchange error:', error);
        res.status(500).json({ 
            error: 'Token exchange failed',
            message: error.message 
        });
    }
});

// Refresh token endpoint
app.post('/api/refresh', async (req, res) => {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
        return res.status(400).json({ error: 'Refresh token is required' });
    }
    
    try {
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`).toString('base64')}`
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            })
        });
        
        const tokenData = await tokenResponse.json();
        
        if (!tokenResponse.ok) {
            throw new Error(tokenData.error_description || 'Token refresh failed');
        }
        
        res.json({
            access_token: tokenData.access_token,
            expires_in: tokenData.expires_in,
            token_type: tokenData.token_type
        });
        
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ 
            error: 'Token refresh failed',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Public config (safe to expose): lets the client retrieve Client ID and Redirect URI
app.get('/api/config', (req, res) => {
    res.json({
        client_id: SPOTIFY_CONFIG.clientId,
        redirect_uri: SPOTIFY_CONFIG.redirectUri
    });
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404s
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎵 Music Study Hub server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} in your browser`);
    console.log(`🔧 Make sure to set up your Spotify app with redirect URI: http://localhost:${PORT}`);
    
    if (process.env.NODE_ENV === 'production') {
        console.log('🚀 Running in production mode');
    } else {
        console.log('🛠️  Running in development mode');
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully');
    process.exit(0);
});

module.exports = app;