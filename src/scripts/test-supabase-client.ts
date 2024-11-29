import supabase from "../database/supabaseClient.js";

(async () => {
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
        console.error("Error fetching tasks:", error.message);
    } else {
        console.log("Tasks:", data);
    }

})

console.log("Done!");