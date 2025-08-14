// Spotify Web App - Educational Music Platform
// CIPP Compliant Implementation

class EducationalMusicApp {
    constructor() {
        this.player = null;
        this.deviceId = null;
        this.currentTrack = null;
        this.isPlaying = false;
        this.accessToken = null;
        this.studyTimer = {
            startTime: null,
            elapsed: 0,
            interval: null,
            isRunning: false
        };
        
        // Configuration - You can set this directly or via environment
        this.config = {
            clientId: this.getClientId(),
            // Use origin only to avoid exact-path mismatch in Spotify dashboard
            redirectUri: window.location.origin,
            scopes: [
                'streaming',
                'user-read-email',
                'user-read-private',
                'user-read-playback-state',
                'user-modify-playback-state',
                'playlist-read-private',
                'playlist-read-collaborative'
            ].join(' ')
        };
        
        this.init();
    }
    
    getClientId() {
        // Try multiple ways to get the client ID
        
        // 1. Check if it's set in the HTML (for easy configuration)
        const metaClientId = document.querySelector('meta[name="spotify-client-id"]');
        if (metaClientId && metaClientId.content && metaClientId.content !== 'YOUR_SPOTIFY_CLIENT_ID') {
            return metaClientId.content;
        }
        
        // 2. Check localStorage (for user configuration)
        const storedClientId = localStorage.getItem('spotify_client_id');
        if (storedClientId && storedClientId !== 'YOUR_SPOTIFY_CLIENT_ID') {
            return storedClientId;
        }
        
        // 3. Check URL parameter (for testing)
        const urlParams = new URLSearchParams(window.location.search);
        const urlClientId = urlParams.get('client_id');
        if (urlClientId) {
            localStorage.setItem('spotify_client_id', urlClientId);
            return urlClientId;
        }
        
        // 4. Default placeholder
        return 'YOUR_SPOTIFY_CLIENT_ID';
    }
    
    init() {
        this.setupEventListeners();
        // Initialize Media Session API (for lock screen / background controls)
        this.setupMediaSession();
        // Load public config (Client ID / Redirect URI) from backend first
        this.loadPublicConfig().finally(() => {
            this.checkAuthToken();
            this.hideLoadingScreen();
        });
    }

    async loadPublicConfig() {
        try {
            const res = await fetch('/api/config');
            if (!res.ok) return;
            const cfg = await res.json();
            if (cfg?.client_id) {
                this.config.clientId = cfg.client_id;
            }
            if (cfg?.redirect_uri) {
                this.config.redirectUri = cfg.redirect_uri;
            }
        } catch (e) {
            console.warn('Failed to load public config, falling back to meta/localStorage/URL param.', e);
        }
    }

    // Setup Media Session API for lock screen and control center controls
    setupMediaSession() {
        if (!('mediaSession' in navigator)) return;

        try {
            // Default playback state
            navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';

            // Action handlers
            navigator.mediaSession.setActionHandler('play', async () => {
                try { await this.player?.togglePlay(); } catch (e) { console.warn(e); }
            });
            navigator.mediaSession.setActionHandler('pause', async () => {
                try { await this.player?.togglePlay(); } catch (e) { console.warn(e); }
            });
            navigator.mediaSession.setActionHandler('previoustrack', async () => {
                try { await this.player?.previousTrack(); } catch (e) { console.warn(e); }
            });
            navigator.mediaSession.setActionHandler('nexttrack', async () => {
                try { await this.player?.nextTrack(); } catch (e) { console.warn(e); }
            });
            navigator.mediaSession.setActionHandler('seekto', async (details) => {
                try {
                    if (typeof details.seekTime === 'number') {
                        await this.player?.seek(details.seekTime * 1000);
                    }
                } catch (e) { console.warn(e); }
            });
            navigator.mediaSession.setActionHandler('seekbackward', async (details) => {
                const step = (details?.seekOffset ?? 10) * 1000;
                try {
                    const state = await this.player?.getCurrentState();
                    if (state) await this.player?.seek(Math.max(0, state.position - step));
                } catch (e) { console.warn(e); }
            });
            navigator.mediaSession.setActionHandler('seekforward', async (details) => {
                const step = (details?.seekOffset ?? 10) * 1000;
                try {
                    const state = await this.player?.getCurrentState();
                    if (state) await this.player?.seek(Math.min(state.duration, state.position + step));
                } catch (e) { console.warn(e); }
            });
        } catch (err) {
            console.warn('Media Session not fully supported:', err);
        }
    }

    // Update lock screen/control center metadata
    updateMediaSessionMetadata(track, paused) {
        if (!('mediaSession' in navigator) || !track) return;

        try {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.name,
                artist: track.artists?.map(a => a.name).join(', ') || 'Unknown',
                album: track.album?.name || '',
                artwork: (track.album?.images || []).map(img => ({ src: img.url, sizes: `${img.width}x${img.height}`, type: 'image/png' }))
            });
            navigator.mediaSession.playbackState = paused ? 'paused' : 'playing';
        } catch (e) {
            console.warn('Failed updating Media Session metadata:', e);
        }
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            if (this.accessToken) {
                this.showPlayerScreen();
            } else {
                this.showLoginScreen();
            }
        }, 2000);
    }
    
    setupEventListeners() {
        // Login
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.getElementById('retry-btn').addEventListener('click', () => this.retry());
        
        // Player controls
        document.getElementById('play-pause-btn').addEventListener('click', () => this.togglePlayback());
        document.getElementById('play-pause-main').addEventListener('click', () => this.togglePlayback());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousTrack());
        document.getElementById('next-btn').addEventListener('click', () => this.nextTrack());
        
        // Volume control
        document.getElementById('volume-slider').addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
        
        // Study timer
        document.getElementById('timer-toggle').addEventListener('click', () => this.toggleStudyTimer());
        
        // Handle Spotify Web Playback SDK
        window.onSpotifyWebPlaybackSDKReady = () => {
            this.initializePlayer();
        };
    }
    
    checkAuthToken() {
        // Check URL for auth token
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
            this.showError('Authentication failed: ' + error);
            return;
        }
        
        if (code) {
            this.exchangeCodeForToken(code);
            return;
        }
        
        // Check localStorage for existing token
        const storedToken = localStorage.getItem('spotify_access_token');
        const tokenExpiry = localStorage.getItem('spotify_token_expiry');
        
        if (storedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
            this.accessToken = storedToken;
            this.initializePlayer();
        }
    }
    
    async exchangeCodeForToken(code) {
        try {
            // In a real implementation, this should be done on your backend
            // For demo purposes, we'll show the structure
            const response = await fetch('/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    redirect_uri: this.config.redirectUri
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.accessToken = data.access_token;
                
                // Store token with expiry
                localStorage.setItem('spotify_access_token', data.access_token);
                localStorage.setItem('spotify_token_expiry', Date.now() + (data.expires_in * 1000));
                
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
                this.initializePlayer();
            } else {
                throw new Error('Token exchange failed');
            }
        } catch (error) {
            console.error('Token exchange error:', error);
            this.showError('Failed to authenticate. Please try again.');
        }
    }
    
    login() {
        if (!this.config.clientId || this.config.clientId === 'YOUR_SPOTIFY_CLIENT_ID') {
            this.showSetupInstructions();
            return;
        }
        
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('client_id', this.config.clientId);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('redirect_uri', this.config.redirectUri);
        authUrl.searchParams.append('scope', this.config.scopes);
        authUrl.searchParams.append('show_dialog', 'true');
        
        window.location.href = authUrl.toString();
    }
    
    logout() {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expiry');
        this.accessToken = null;
        
        if (this.player) {
            this.player.disconnect();
        }
        
        this.showLoginScreen();
    }
    
    retry() {
        window.location.reload();
    }
    
    initializePlayer() {
        if (!this.accessToken) {
            this.showError('No access token available');
            return;
        }
        
        this.player = new Spotify.Player({
            name: 'Educational Music Hub',
            getOAuthToken: cb => { cb(this.accessToken); },
            volume: 0.5
        });
        
        // Error handling
        this.player.addListener('initialization_error', ({ message }) => {
            console.error('Failed to initialize:', message);
            this.showError('Failed to initialize player: ' + message);
        });
        
        this.player.addListener('authentication_error', ({ message }) => {
            console.error('Failed to authenticate:', message);
            this.logout();
        });
        
        this.player.addListener('account_error', ({ message }) => {
            console.error('Failed to validate Spotify account:', message);
            this.showError('Account validation failed. Premium account required.');
        });
        
        this.player.addListener('playback_error', ({ message }) => {
            console.error('Failed to perform playback:', message);
            this.showError('Playback error: ' + message);
        });
        
        // Playback status updates
        this.player.addListener('player_state_changed', (state) => {
            if (!state) return;
            
            this.currentTrack = state.track_window.current_track;
            this.isPlaying = !state.paused;
            
            this.updateUI(state);
        });
        
        // Ready
        this.player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            this.deviceId = device_id;
            this.loadUserData();
            this.loadPlaylists();
            this.showPlayerScreen();
        });
        
        // Not Ready
        this.player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });
        
        // Connect to the player!
        this.player.connect();
    }
    
    async loadUserData() {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                document.getElementById('user-name').textContent = userData.display_name || 'User';
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }
    
    async loadPlaylists() {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.displayPlaylists(data.items);
            }
        } catch (error) {
            console.error('Failed to load playlists:', error);
            this.createDefaultPlaylists();
        }
    }
    
    displayPlaylists(playlists) {
        const container = document.getElementById('playlists-container');
        container.innerHTML = '';
        
        // Filter for study-appropriate playlists or show all
        const studyKeywords = ['study', 'focus', 'concentration', 'ambient', 'classical', 'instrumental', 'chill', 'lofi'];
        
        playlists.forEach(playlist => {
            const playlistElement = document.createElement('div');
            playlistElement.className = 'playlist-item';
            playlistElement.innerHTML = `
                <img src="${playlist.images[0]?.url || 'icons/default-album.png'}" alt="${playlist.name}">
                <h4>${playlist.name}</h4>
                <p>${playlist.tracks.total} tracks</p>
            `;
            
            playlistElement.addEventListener('click', () => {
                this.playPlaylist(playlist.uri);
            });
            
            container.appendChild(playlistElement);
        });
    }
    
    createDefaultPlaylists() {
        // Create some default educational playlists if none are found
        const defaultPlaylists = [
            {
                name: 'Focus & Concentration',
                description: 'Instrumental music for deep focus',
                image: 'icons/focus-playlist.png'
            },
            {
                name: 'Study Ambient',
                description: 'Ambient sounds for studying',
                image: 'icons/ambient-playlist.png'
            },
            {
                name: 'Classical Study',
                description: 'Classical music for learning',
                image: 'icons/classical-playlist.png'
            }
        ];
        
        const container = document.getElementById('playlists-container');
        container.innerHTML = '';
        
        defaultPlaylists.forEach(playlist => {
            const playlistElement = document.createElement('div');
            playlistElement.className = 'playlist-item';
            playlistElement.innerHTML = `
                <img src="${playlist.image}" alt="${playlist.name}">
                <h4>${playlist.name}</h4>
                <p>${playlist.description}</p>
            `;
            
            container.appendChild(playlistElement);
        });
    }
    
    async playPlaylist(playlistUri) {
        try {
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    context_uri: playlistUri
                })
            });
        } catch (error) {
            console.error('Failed to play playlist:', error);
            this.showError('Failed to play playlist');
        }
    }
    
    async togglePlayback() {
        if (!this.player) return;
        
        try {
            await this.player.togglePlay();
        } catch (error) {
            console.error('Failed to toggle playback:', error);
        }
    }
    
    async previousTrack() {
        if (!this.player) return;
        
        try {
            await this.player.previousTrack();
        } catch (error) {
            console.error('Failed to go to previous track:', error);
        }
    }
    
    async nextTrack() {
        if (!this.player) return;
        
        try {
            await this.player.nextTrack();
        } catch (error) {
            console.error('Failed to go to next track:', error);
        }
    }
    
    async setVolume(volume) {
        if (!this.player) return;
        
        try {
            await this.player.setVolume(volume);
        } catch (error) {
            console.error('Failed to set volume:', error);
        }
    }
    
    updateUI(state) {
        if (!state || !state.track_window.current_track) return;
        
        const track = state.track_window.current_track;
        
        // Update track info
        document.getElementById('track-name').textContent = track.name;
        document.getElementById('track-artist').textContent = track.artists.map(a => a.name).join(', ');
        document.getElementById('track-image').src = track.album.images[0]?.url || 'icons/default-album.png';
        
        // Update play/pause buttons
        const playIcon = state.paused ? '▶️' : '⏸️';
        document.querySelector('.play-icon').textContent = playIcon;
        document.getElementById('play-pause-main').textContent = playIcon;
        
        // Update progress
        const progress = (state.position / state.duration) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
        
        // Update time
        document.getElementById('current-time').textContent = this.formatTime(state.position);
        document.getElementById('total-time').textContent = this.formatTime(state.duration);

        // Update Media Session metadata for lock screen/control center
        this.updateMediaSessionMetadata(track, state.paused);
    }
    
    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    toggleStudyTimer() {
        if (this.studyTimer.isRunning) {
            this.stopStudyTimer();
        } else {
            this.startStudyTimer();
        }
    }
    
    startStudyTimer() {
        this.studyTimer.startTime = Date.now() - this.studyTimer.elapsed;
        this.studyTimer.isRunning = true;
        
        this.studyTimer.interval = setInterval(() => {
            this.studyTimer.elapsed = Date.now() - this.studyTimer.startTime;
            this.updateTimerDisplay();
        }, 1000);
        
        document.getElementById('timer-toggle').textContent = 'Pause Session';
    }
    
    stopStudyTimer() {
        if (this.studyTimer.interval) {
            clearInterval(this.studyTimer.interval);
        }
        
        this.studyTimer.isRunning = false;
        document.getElementById('timer-toggle').textContent = 'Resume Session';
    }
    
    updateTimerDisplay() {
        const totalSeconds = Math.floor(this.studyTimer.elapsed / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    showLoginScreen() {
        this.hideAllScreens();
        document.getElementById('login-screen').style.display = 'block';
    }
    
    showPlayerScreen() {
        this.hideAllScreens();
        document.getElementById('player-screen').style.display = 'block';
    }
    
    showError(message) {
        this.hideAllScreens();
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-screen').style.display = 'block';
    }
    
    hideAllScreens() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.style.display = 'none');
    }
    
    showSetupInstructions() {
        const instructions = `
        🔧 Setup Required:
        
        1. Go to https://developer.spotify.com/dashboard
        2. Create a new app
        3. Add this URL as redirect URI: ${window.location.origin}${window.location.pathname}
        4. Copy your Client ID
        5. Replace 'YOUR_SPOTIFY_CLIENT_ID' in the code with your actual Client ID
        
        For detailed instructions, check the README.md file.
        `;
        
        alert(instructions);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EducationalMusicApp();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}