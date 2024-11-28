import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import pool from '../database/database';

export const taskAssign = {
    data: new SlashCommandBuilder()
        .setName('assign-task')
        .setDescription('Assign a task to a user.')
        .addUserOption(option => 
            option.setName('assignee')
                .setDescription('The user to assign the task to.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the task.')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const assignee = interaction.options.getUser('assignee');
        const description = interaction.options.getString('description');

        try {
            const res = await pool.query(
                'INSERT INTO tasks (user_id, description, assignee) VALUES ($1, $2, $3) RETURNING *',
                [interaction.user.id, description, assignee?.id]
            );

            await interaction.reply(`Task assigned to ${assignee?.tag}: "${description}"`);
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: 'Failed to assign task.', ephemeral: true });
        }
    }
};