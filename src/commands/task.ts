import { SlashCommandBuilder } from "discord.js";
import supabase from "../database/supabaseClient.js";

// let tasks: { id: number; name: string; description: string; dueDate?: string; assignee?: string }[] = [];
// let taskIdCounter = 1;

export const taskCommand = {
    data: new SlashCommandBuilder()
        .setName("task")
        .setDescription("Manage tasks")
        .addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription("Create a new task")
                .addStringOption(option => 
                    option.setName("description")
                        .setDescription("Task description")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("assignee")
                        .setDescription("The user to assign the task to")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List your created tasks")),
    async execute(interaction: any) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "create") {
            const description = interaction.options.getString("description");
            const assignee = interaction.options.getUser("assignee");
            const userId = interaction.user.id;

            // Insert task into Supabase
            const { data, error } = await supabase
                .from("tasks")
                .insert({
                    user_id: userId,
                    description: description,
                    assignee: assignee.id,
                });

            if (error) {
                console.error("Error creating task:", error.message);
                await interaction.reply({
                    content: "Failed to create task. Please try again later.",
                    ephemeral: true,
                });
                return;
            }

            await interaction.reply(`Task created and assigned to ${assignee.tag}: "${description}"`);
        } else if (subcommand === "list") {
            const userId = interaction.user.id;

            // Retrieve tasks from Supabase
            const { data: tasks, error } = await supabase
                .from("tasks")
                .select("*")
                .eq("user_id", userId);

            if (error) {
                console.error("Error retrieving tasks:", error.message);
                await interaction.reply({
                    content: "Failed to retrieve tasks. Please try again later.",
                    ephemeral: true,
                });
                return;
            }

            if (!tasks || tasks.length === 0) {
                await interaction.reply("You have no tasks.");
            } else {
                const taskList = tasks.map(task => 
                    `**${task.id}**: ${task.description} (Assigned to: <@${task.assignee}>)`).join("\n");
                
                await interaction.reply(`**Your tasks:**\n${taskList}`);
            }
        }
    },
};