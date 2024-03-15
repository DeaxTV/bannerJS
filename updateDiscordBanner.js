const axios = require('axios');
const fs = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

// Replace discord token with yours
const DISCORD_BOT_TOKEN = "your discord bot token;

// Define URLs for profile picture and banner
const PROFILE_IMAGE_URL = "link here";
const BANNER_IMAGE_URL = "link here";

async function updateProfileAndBanner() {
    try {
        // Download profile and banner images
        const [profileImageResponse, bannerImageResponse] = await Promise.all([
            axios.get(PROFILE_IMAGE_URL, { responseType: 'arraybuffer' }),
            axios.get(BANNER_IMAGE_URL, { responseType: 'arraybuffer' })
        ]);

        // Check if images were downloaded successfully
        if (profileImageResponse.status === 200 && bannerImageResponse.status === 200) {
            // Convert images to base64
            const [profileImageBase64, bannerImageBase64] = await Promise.all([
                Buffer.from(profileImageResponse.data, 'binary').toString('base64'),
                Buffer.from(bannerImageResponse.data, 'binary').toString('base64')
            ]);

            // Prepare JSON payload with base64-encoded images
            const payload = {
                avatar: `data:image/gif;base64,${profileImageBase64}`,
                banner: `data:image/gif;base64,${bannerImageBase64}`
            };

            // Prepare headers with bot token
            const headers = {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json'
            };

            // Send HTTP PATCH request to update profile picture and banner
            const response = await axios.patch('https://discord.com/api/v10/users/@me', payload, { headers });

            // Check if the response indicates success
            if (response.status === 200) {
                console.log('Profile picture and banner changed successfully!');
            } else {
                console.log('Failed to change profile picture and banner:', response.data);
            }
        } else {
            console.log('Failed to download profile picture or banner');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

updateProfileAndBanner();
