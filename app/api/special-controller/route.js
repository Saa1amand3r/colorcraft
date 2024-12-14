import connectDB from "@/config/database";
import ColorCombination from "@/models/ColorCombination";

export const POST = async (req) => {
    try {
        // Connect to the database
        await connectDB();

        // Parse the incoming JSON data
        const body = await req.json();

        // Loop through the categories and update the ColorCombination table
        for (const item of body) {
            const { category, combinations } = item;

            // Update the database for each combination
            for (const combo of combinations) {
                const { R1, G1, B1, R2, G2, B2 } = combo;

                // Find and update the matching color combinations
                await ColorCombination.updateMany(
                    {
                        r1: R1,
                        g1: G1,
                        b1: B1,
                        r2: R2,
                        g2: G2,
                        b2: B2
                    },
                    { $set: { special: true } }
                );
            }
        }

        return new Response(JSON.stringify({ message: "Update successful" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error updating the database:", error);
        return new Response(
            JSON.stringify({ error: "Failed to update the database" }),
            { status: 500 }
        );
    }
};


export const GET = async () => {
    try {
        // Connect to the database
        await connectDB();

        // Query the database for color combinations marked as special
        const specialColorCombinations = await ColorCombination.find({ special: true });

        return new Response(JSON.stringify(specialColorCombinations), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error retrieving special color combinations:", error);
        return new Response(
            JSON.stringify({ error: "Failed to retrieve special color combinations" }),
            { status: 500 }
        );
    }
};