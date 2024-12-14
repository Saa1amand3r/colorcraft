import connectDB from "@/config/database";
import ColorCombination from "@/models/ColorCombination";
import csv from 'csv-parser';

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

        // Create a stream from the uploaded file and parse it using csv-parser
        const fileStream = csvFile.stream();
        const results = [];

        fileStream.pipe(csv())
            .on('data', (row) => {
                try {
                    // Ensure that each row is valid and parse the numbers
                    const { R1, G1, B1, R2, G2, B2 } = row;

                    // Convert values to integers
                    const parsedRow = {
                        R1: parseInt(R1, 10),
                        G1: parseInt(G1, 10),
                        B1: parseInt(B1, 10),
                        R2: parseInt(R2, 10),
                        G2: parseInt(G2, 10),
                        B2: parseInt(B2, 10)
                    };

                    // Only add valid rows with valid integer values
                    if (
                        !isNaN(parsedRow.R1) &&
                        !isNaN(parsedRow.G1) &&
                        !isNaN(parsedRow.B1) &&
                        !isNaN(parsedRow.R2) &&
                        !isNaN(parsedRow.G2) &&
                        !isNaN(parsedRow.B2)
                    ) {
                        results.push(parsedRow);
                    } else {
                        console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
                    }
                } catch (err) {
                    console.error(`Error processing row: ${err}`);
                }
            })
            .on('end', async () => {
                // Once the CSV is parsed, process the data
                for (const { R1, G1, B1, R2, G2, B2 } of results) {
                    try {
                        // Update the database for each valid combination
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
                    } catch (error) {
                        console.error("Error updating database:", error);
                    }
                }

                return new Response(JSON.stringify({ message: "Update successful" }), {
                    status: 200,
                });
            })
            .on('error', (error) => {
                console.error("Error parsing the CSV:", error);
                return new Response(
                    JSON.stringify({ error: "Failed to parse the CSV file" }),
                    { status: 500 }
                );
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
