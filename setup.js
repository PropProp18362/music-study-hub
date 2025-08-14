#!/usr/bin/env node

// Setup script for Music Study Hub
// This helps configure the app with your Spotify credentials

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🎵 Music Study Hub - Setup Wizard');
console.log('=====================================\n');

console.log('This wizard will help you configure your Spotify integration.\n');

console.log('Before starting, make sure you have:');
console.log('1. ✅ A Spotify Premium account');
console.log('2. ✅ Created a Spotify app at https://developer.spotify.com/dashboard');
console.log('3. ✅ Your Client ID and Client Secret ready\n');

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function setup() {
    try {
        // Get Spotify credentials
        console.log('📝 Spotify App Configuration');
        console.log('-----------------------------');
        
        const clientId = await askQuestion('Enter your Spotify Client ID: ');
        if (!clientId) {
            console.log('❌ Client ID is required!');
            process.exit(1);
        }
        
        const clientSecret = await askQuestion('Enter your Spotify Client Secret: ');
        if (!clientSecret) {
            console.log('❌ Client Secret is required!');
            process.exit(1);
        }
        
        const port = await askQuestion('Enter port number (default: 3000): ') || '3000';
        
        // Create .env file
        const envContent = `# Spotify API Configuration
SPOTIFY_CLIENT_ID=${clientId}
SPOTIFY_CLIENT_SECRET=${clientSecret}

# Server Configuration
PORT=${port}
NODE_ENV=development

# Redirect URI (update for production)
REDIRECT_URI=http://localhost:${port}
`;
        
        fs.writeFileSync('.env', envContent);
        console.log('✅ Created .env file');
        
        // Update HTML file with Client ID
        const htmlPath = path.join(__dirname, 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        htmlContent = htmlContent.replace(
            '<meta name="spotify-client-id" content="YOUR_SPOTIFY_CLIENT_ID">',
            `<meta name="spotify-client-id" content="${clientId}">`
        );
        fs.writeFileSync(htmlPath, htmlContent);
        console.log('✅ Updated index.html with Client ID');
        
        // Instructions
        console.log('\n🎉 Setup Complete!');
        console.log('==================\n');
        
        console.log('Next steps:');
        console.log('1. Install dependencies: npm install');
        console.log('2. Start the server: npm start');
        console.log(`3. Open http://localhost:${port} in your browser`);
        console.log(`4. In your Spotify app settings, add this redirect URI: http://localhost:${port}`);
        
        console.log('\n📱 For deployment:');
        console.log('- Check DEPLOYMENT.md for hosting options');
        console.log('- Update redirect URI in Spotify app settings');
        console.log('- Set environment variables on your hosting platform');
        
        console.log('\n🔧 Configuration files created:');
        console.log('- .env (server configuration)');
        console.log('- index.html (updated with Client ID)');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

// Check if already configured
if (fs.existsSync('.env')) {
    rl.question('⚠️  .env file already exists. Overwrite? (y/N): ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            setup();
        } else {
            console.log('Setup cancelled.');
            rl.close();
        }
    });
} else {
    setup();
}