const { SlashCommandBuilder } = require('discord.js');

// These are placed inside module.exports so they can be read by other files
// module.exports is how you export data in Node.js 
// so that you can require() it in other files.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),

    // The execute method, which will contain the functionality to run from our event handler when the command is used.
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
