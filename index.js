// The fs module is Node's native file system module. 
// fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
require('dotenv').config();

// The path module is Node's native path utility module. 
// path helps construct paths to access files and directories
const path = require('node:path');

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const token = process.env.TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// The Collection class extends JavaScript's native Map class, 
// and includes more extensive, useful functionality. 
// Collection is used to store and efficiently retrieve commands for execution.
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// construct a path to the commands directory
	const commandsPath = path.join(foldersPath, folder);

	// The first fs.readdirSync() method then reads the path to the directory 
	// and returns an array of all the folder names it contains, currently ['utility'].
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
