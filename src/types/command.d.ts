// src/types/command.d.ts
import { CommandInteraction, Interaction } from "discord.js";

export interface Command {
    data: {
        name: string;
        description: string;
    };
    execute: (interaction: CommandInteraction) => Promise<void>;
}