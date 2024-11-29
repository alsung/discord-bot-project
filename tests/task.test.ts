import supabase from "../src/database/supabaseClient";
import dotenv from "dotenv";

dotenv.config();

interface Task {
    id: number;
    user_id: string;
    description: string;
    assignee: string;
    created_at: string;
}

describe('Task Creation and Retrieval', () => {
    let createdTaskId: number | undefined;

    // Test Task Creation
    it('should create a new task in the database', async () => {
        const { data, error } = await supabase
            .from('tasks')
            .insert([
                {
                    user_id: process.env.TEST_USER_ID,
                    description: 'Test Task Creation',
                    assignee: process.env.TEST_USER_ID,
                },
            ])
            .select('*')
            .single();

        if (error) {
            throw new Error(`Error creating task: ${error.message}`);
        }

        expect(data).toHaveProperty('id');
        expect(data.description).toBe('Test Task Creation');
        createdTaskId = data.id;
    });

    // Test Task Retrieval
    it('should retrieve the task from the database', async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', createdTaskId)
            .single();

        if (error) {
            throw new Error(`Error fetching task: ${error.message}`);
        }

        expect(data).toHaveProperty('id', createdTaskId);
        expect(data.description).toBe('Test Task Creation');
    });

    // Cleanup after each test
    afterAll(async () => {
        if (createdTaskId !== undefined) {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', createdTaskId);

            if (error) {
                throw new Error(`Error cleaning up task: ${error.message}`);
            }

            createdTaskId = undefined; // Reset for future tests
        }
    })
});