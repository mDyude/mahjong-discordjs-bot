// The fs module is Node's native file system module. 
// fs is used to read the commands directory and identify our command files.
require('dotenv').config();
const PORT = process.env.PORT;
const fs = require('node:fs');
const express = require('express');
const cors = require('cors');
const app = express();
const generalRoutes = require('./routes/generalRoutes.js');
const fetchRanking = require("./actions/fetchRanking.js");
const PLAYER_URL = process.env.PLAYER_URL;
const announceChannelID = process.env.ANNOUNCEMENT_CHANNEL_ID;

// The path module is Node's native path utility module. 
// path helps construct paths to access files and directories
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const token = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// app.use((cors()));
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "https://mahjong680.club/"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.json());
app.use('/api', generalRoutes, async (req, res) => {
	try {
		if (req.body.message === "Players Updated") {
			// send message to the announcement channel
			const channel = client.channels.cache.get(announceChannelID);
			sendMsg = await fetchRanking(PLAYER_URL);
			await channel.send(`🀄️🀄️🀄️🀄️新玩家已更新🀄️🀄️🀄️🀄️：\n${sendMsg}`);

			console.log("Players Updated");
			res.status(200).json(req.body);

		} else if (req.body.message === "Games Updated") {
			announceString = "顺位        玩家        座位        分数\n";
			req.body.gameData.forEach(scores => {
				announceString += `${scores.rank}            ${scores.playerName}        ${scores.direction}        ${scores.score}\n`;
			});

			console.log("Games Updated");
			console.log(announceString);

			const channel = client.channels.cache.get(announceChannelID);
			await channel.send(`🀄️🀄️🀄️🀄️对局已更新🀄️🀄️🀄️🀄️：\n${announceString}`);

			sendMsg = await fetchRanking(PLAYER_URL);
			await channel.send(`🀄️🀄️🀄️🀄️更新后最新排名🀄️🀄️🀄️🀄️：\n${sendMsg}`);

			console.log("Players Updated");

			// send the latest game added to the announcement channel
			res.status(200).json(req.body);

		} else {
			console.log("Hello from Yui");
			res.status(404).json({ message: "No data found" });
		}

	} catch (error) {
		console.error(`error in generalRoutes: ${error}`);
		res.status(500).json({ message: "Error" });
	}
});
app.listen(PORT, () => {
	console.log('Server is running on port ' + PORT);
});

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// construct a path to the commands directory
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	// for each file in the directory, require the file 
	// and add it to the client.commands Collection
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		// comand is a reference to the exported module from the file
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// get events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	// if the event has a once property, bind it with client.once
	if (event.once) {
		// The client.once() method is used to bind a listener that will only be called once to an event.
		// The event name is passed as the first parameter, and the listener is passed as the second parameter.
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


// Log in to Discord with your client's token
client.login(token);
