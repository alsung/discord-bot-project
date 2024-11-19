import { Client, Collection, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import { Command } from "./types/command";

dotenv.config();

// Initialize client with the necessary intents
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

// Initialize commands collection in the client
client.commands = new Collection<string, Command>();

// Define the commands array with the correct type (to store command data)
const commands: SlashCommandBuilder[] = []; // Specify the array type

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load commands from 'commands' folder
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const { pingCommand } = require(path.join(commandsPath, file)); // Destructure the exported command
    client.commands.set(pingCommand.data.name, pingCommand); // Set the command in the client.commands collection
    commands.push(pingCommand.data); // Push the command to the commands array
}

// Register commands with Discord API (for all guilds for simplicity)
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);
(async () => {
    try {
        console.log('Start refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction); // Execute the command
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(process.env.BOT_TOKEN);