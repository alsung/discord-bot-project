import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/command";

export const helpComand: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands'),
    execute: async (interaction) => {
        const commands = [
            { name: 'ping', description: 'Replies with Pong!' },
            { name: 'help', description: 'Lists all available commands' },
        ];

        const helpMessage = commands.map(cmd => `**/${cmd.name}**: ${cmd.description}`).join('\n');

        await interaction.reply({
            content: `Here are the available commands:\n${helpMessage}`,
            ephemeral: true,
        });
    }
};