'use client';
import { useState } from "react";

// Helper function to convert HEX to RGB components
const hexToRGB = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
};

// Helper function to calculate the Euclidean distance between two colors
const colorDistance = (color1, color2) => {
    let rDiff = color1.r - color2.r;
    let gDiff = color1.g - color2.g;
    let bDiff = color1.b - color2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
};

const ColorsPage = () => {
    const [colors, setColors] = useState([
        { referenceColor: "#FF0000", name: "Pure Red" },
        { referenceColor: "#8B0000", name: "Dark Red" },
        { referenceColor: "#FFC0CB", name: "Pink" },
        { referenceColor: "#E31C79", name: "Hot Pink"},
        { referenceColor: "#FFA500", name: "Pure Orange" },
        { referenceColor: "#F95923", name: "Red Orange"},
        { referenceColor: "#F7A28B", name: "Peach" },
        { referenceColor: "#FCFCB6", name: "Light Yellow" },
        { referenceColor: "#E1AD01", name: "Mustard Yellow" },
        { referenceColor: "#006400", name: "Dark Green" },
        { referenceColor: "#aeff7a", name: "Pastel Green"},
        { referenceColor: "#32CD32", name: "Green" },
        { referenceColor: "#808000", name: "Olive Green" },
        { referenceColor: "#0000FF", name: "Pure Blue" },
        { referenceColor: "#000080", name: "Navy Blue" },
        { referenceColor: "#87CEEB", name: "Sky Blue" },
        { referenceColor: "#00FFFF", name: "Cyan" },
        { referenceColor: "#800080", name: "Pure Purple" },
        { referenceColor: "#E6E6FA", name: "Lavender" },
        { referenceColor: "#4B0082", name: "Dark Purple" },
        { referenceColor: "#7B5737", name: "Brown" },
        { referenceColor: "#C26565", name: "Dark Pink" },
        { referenceColor: "#D2B48C", name: "Light Brown" },
        { referenceColor: "#808080", name: "Grey" },
        { referenceColor: "#000000", name: "Black" },
        { referenceColor: "#FFFFFF", name: "White" }
    ]);

    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [inputColor, setInputColor] = useState("#FFFFFF");
    const [correspondingColor, setCorrespondingColor] = useState(colors[0]);

    // State for new color form
    const [newColor, setNewColor] = useState({
        referenceColor: "#000000",
        name: "",
    });

    const change = (e) => {
        const name = e.target.value;
        const selected = colors.find((color) => color.name === name);
        setSelectedColor(selected);
    };

    const getCorrespondingColor = (hex) => {
        const inputRGB = hexToRGB(hex); // Convert input hex to RGB

        let closestColor = colors[0];
        let minDistance = Number.MAX_VALUE;

        // Iterate through all colors and find the one with the smallest color distance
        colors.forEach((color) => {
            const colorRGB = hexToRGB(color.referenceColor);
            const distance = colorDistance(inputRGB, colorRGB);

            if (distance < minDistance) {
                minDistance = distance;
                closestColor = color;
            }
        });

        return closestColor;
    };

    const submitFunc = () => {
        const element = document.getElementById("colrInput");
        const hex = element.value;
        setInputColor(hex);
        const matchedColor = getCorrespondingColor(hex); // Get the closest color
        setCorrespondingColor(matchedColor); // Update the corresponding color display
    };

    const handleNewColorChange = (e) => {
        const { name, value } = e.target;
        setNewColor((prev) => ({ ...prev, [name]: value }));
    };

    const addColor = (e) => {
        e.preventDefault();
        setColors((prev) => [
            ...prev,
            {
                referenceColor: newColor.referenceColor,
                name: newColor.name,
            },
        ]);
        setNewColor({ referenceColor: "#000000", name: "" }); // Reset form
    };

    const removeColor = (name) => {
        setColors((prev) => prev.filter((color) => color.name !== name));
    };

    const saveColorsToDatabase = async () => {
        try {
            const response = await fetch('/api/save-colors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ colors }), // Send all colors
            });

            const result = await response.json();

            if (result.success) {
                console.log("Colors saved successfully!");
            } else {
                console.error("Failed to save colors:", result.message);
            }
        } catch (error) {
            console.error("Error saving colors:", error);
        }
    };


    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Select a Color</h1>

            <div className="flex flex-col items-center mb-4">
                <div
                    className="h-24 w-24 mb-2 rounded border border-gray-300"
                    style={{backgroundColor: selectedColor.referenceColor}}
                ></div>
                <select onChange={change} className="mt-4 p-2 border border-gray-300 rounded">
                    {colors.map((value, key) => (
                        <option key={key} value={value.name}>
                            {value.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mt-4 w-full max-w-md">
                <h1 className="text-xl font-bold mb-2">Input Your Color</h1>
                <div>
                    <h3 className="text-md font-semibold mb-1">Pick a color:</h3>
                    <input
                        id="colrInput"
                        type="color"
                        name="colrInput"
                        onChange={submitFunc}
                        className="w-full h-12 border border-gray-300 rounded mb-2"
                    />
                    <h3 className="text-md font-semibold mb-1">Color you picked:</h3>
                    <div className="w-24 h-24 mb-2 rounded border border-gray-300"
                         style={{backgroundColor: inputColor}}></div>
                    <h3 className="text-md font-semibold mb-1">Closest matching color ({correspondingColor.name}):</h3>
                    <div className="w-24 h-24 mb-2 rounded border border-gray-300"
                         style={{backgroundColor: correspondingColor.referenceColor}}></div>
                </div>
            </div>

            {/* New Color Form */}
            <div className="bg-white shadow-md rounded-lg p-6 mt-4 w-full max-w-md">
                <h1 className="text-xl font-bold mb-2">Add New Color</h1>
                <form onSubmit={addColor}>
                    <div className="mb-4">
                        <label className="block mb-1">Color Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={newColor.name}
                            onChange={handleNewColorChange}
                            required
                            className="w-full border border-gray-300 rounded p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Reference Color (HEX):</label>
                        <input
                            type="color"
                            name="referenceColor"
                            value={newColor.referenceColor}
                            onChange={handleNewColorChange}
                            required
                            className="w-full h-12 border border-gray-300 rounded"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Add Color</button>
                </form>
            </div>

            {/* Display Current Colors */}
            <div className="bg-white shadow-md rounded-lg p-6 mt-4 w-full max-w-md">
                <h1 className="text-xl font-bold mb-2">Current Colors</h1>
                <ul>
                    {colors.map((color) => (
                        <li key={color.name} className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <div
                                    className="h-6 w-6 rounded mr-2"
                                    style={{backgroundColor: color.referenceColor}}
                                ></div>
                                <span>{color.name}</span>
                            </div>
                            <button onClick={() => removeColor(color.name)} className="text-red-500">Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={saveColorsToDatabase}
                className="bg-green-500 text-white p-2 rounded mt-4">
                Save All Colors to Database
            </button>

        </div>
    );
};

export default ColorsPage;
