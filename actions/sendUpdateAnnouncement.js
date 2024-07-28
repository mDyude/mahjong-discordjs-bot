CHANNEL_ID = process.env.ANNOUNCEMENT_CHANNEL_ID;
const { Client } = require('discord.js');

const sendUpdateAnnouncement = (message) => {
    const client = new Client();
    const channel = client.channels.cache.get(CHANNEL_ID);
    channel.send('content');
}

module.exports = sendUpdateAnnouncement;