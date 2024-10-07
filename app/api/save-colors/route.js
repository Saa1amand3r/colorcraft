import { NextResponse } from 'next/server';
import Color from '@/models/Color';
import ColorCombination from '@/models/ColorCombination';
import connectDB from "@/config/database";

// Helper function to convert HEX to RGB
const hexToRGB = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
};

export async function GET() {
    await connectDB(); // Connect to the database

    try {
        const combinations = await ColorCombination.find({}).lean(); // Retrieve all color combinations
        return new Response(JSON.stringify(combinations), { status: 200 });
    } catch (error) {
        console.error('Error fetching combinations:', error);
        return new Response('Failed to fetch combinations.', { status: 500 });
    }
}

// POST /api/save-colors
export async function POST(req) {
    await connectDB(); // Connect to the database

    const { colors } = await req.json(); // Get colors array from request

    try {
        // Save individual colors to the Color model
        const colorPromises = colors.map(color => {
            const { referenceColor: hex, name } = color;
            const { r, g, b } = hexToRGB(hex); // Convert HEX to RGB

            return Color.create({ hex, r, g, b, name });
        });

        await Promise.all(colorPromises); // Save all colors to the Color model

        // Generate and save all possible color combinations
        const combinations = [];
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                const color1 = colors[i];
                const color2 = colors[j];

                const hex1 = color1.referenceColor;
                const { r: r1, g: g1, b: b1 } = hexToRGB(hex1);

                const hex2 = color2.referenceColor;
                const { r: r2, g: g2, b: b2 } = hexToRGB(hex2);

                combinations.push({ hex1, r1, g1, b1, hex2, r2, g2, b2 });
            }
        }

        const combinationPromises = combinations.map(combination =>
            ColorCombination.create(combination)
        );

        await Promise.all(combinationPromises); // Save all combinations to the ColorCombination model

        return new Response('Colors and combinations saved successfully!', { status: 201 });
    } catch (error) {
        console.error('Error saving colors:', error);
        return new Response('Failed to save colors or combinations.' , { status: 500 });
    }
}
