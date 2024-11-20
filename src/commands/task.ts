import { SlashCommandBuilder } from "discord.js";

let tasks: { id: number; name: string; description: string; dueDate?: string; assignee?: string }[] = [];
let taskIdCounter = 1;

export const taskCommand = {
    data: new SlashCommandBuilder()
        .setName("task")
        .setDescription("Manage tasks")
        .addSubcommand(subcommand => 
            subcommand
                .setName("create")
                .setDescription("Create a new task")
                .addStringOption(option => 
                    option.setName("name").setDescription("Task name").setRequired(true))
                .addStringOption(option =>
                    option.setName("description").setDescription("Task description").setRequired(true))
                .addStringOption(option =>
                    option.setName("due_date").setDescription("Task due date (optional)").setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List all tasks")),
    async execute(interaction: any) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "create") {
            const name = interaction.options.getString("name");
            const description = interaction.options.getString("description");
            const dueDate = interaction.options.getString("due_date");

            tasks.push({
                id: taskIdCounter++,
                name,
                description,
                dueDate,
            });

            await interaction.reply(`Task "${name}" created successfully.`);
        } else if (subcommand === "list") {
            if (tasks.length === 0) {
                await interaction.reply("No tasks available.");
            } else {
                const taskList = tasks.map(task => 
                    `**${task.id}**: ${task.name} - ${task.description} ${task.dueDate ? `(Due: ${task.dueDate})` : ""}`).join("\n");

                await interaction.reply(`**Tasks:**\n${taskList}`);
            }
        }
    },
};