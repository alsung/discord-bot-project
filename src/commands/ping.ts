import { CommandInteraction } from "discord.js";

export const pingCommand = {
    data: {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    async execute(interaction: CommandInteraction) {
        await interaction.reply('Pong!');
    },
};