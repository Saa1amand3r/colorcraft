import connectDB from "@/config/database";
import ColorCombination from "@/models/ColorCombination";

export const POST = async (req) => {
    try {
        // Connect to the database
        await connectDB();

        // Parse the incoming form data and get the file
        const formData = await req.formData();
        const csvFile = formData.get('file');

        if (!csvFile) {
            return new Response(
                JSON.stringify({ error: "No file uploaded" }),
                { status: 400 }
            );
        }

        // Read the file into a buffer
        const fileBuffer = await csvFile.arrayBuffer();
        const text = new TextDecoder().decode(fileBuffer);

        // Split the CSV data into lines and process each line
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

        const results = [];

        for (const line of lines) {
            const [R1, G1, B1, R2, G2, B2] = line.split(',').map(value => value.trim());

            // Ensure each value is a valid number
            if (!isNaN(R1) && !isNaN(G1) && !isNaN(B1) && !isNaN(R2) && !isNaN(G2) && !isNaN(B2)) {
                results.push({
                    R1: parseInt(R1, 10),
                    G1: parseInt(G1, 10),
                    B1: parseInt(B1, 10),
                    R2: parseInt(R2, 10),
                    G2: parseInt(G2, 10),
                    B2: parseInt(B2, 10),
                });
            } else {
                console.warn(`Skipping invalid row: ${line}`);
            }
        }

        // Update the database for each valid combination
        for (const { R1, G1, B1, R2, G2, B2 } of results) {
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
