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
        { referenceColor: "#FF0000", interval: { start: "#990000", end: "#FF6666" }, name: "Pure Red" },
        { referenceColor: "#8B0000", interval: { start: "#660000", end: "#993333" }, name: "Dark Red" },
        { referenceColor: "#FFC0CB", interval: { start: "#FFB6B6", end: "#FFDDE5" }, name: "Pink" },
        { referenceColor: "#FFB6C1", interval: { start: "#FFA3A3", end: "#FFCCCC" }, name: "Light Pink" },
        { referenceColor: "#FFA500", interval: { start: "#CC6600", end: "#FFCC66" }, name: "Pure Orange" },
        { referenceColor: "#FF8C00", interval: { start: "#B35900", end: "#FFA64D" }, name: "Dark Orange" },
        { referenceColor: "#FFDAB9", interval: { start: "#FFD1A3", end: "#FFE5CC" }, name: "Peach" },
        { referenceColor: "#FFFF00", interval: { start: "#CCCC00", end: "#FFFF66" }, name: "Pure Yellow" },
        { referenceColor: "#FFD700", interval: { start: "#BFA500", end: "#FFE066" }, name: "Gold" },
        { referenceColor: "#E1AD01", interval: { start: "#B28F00", end: "#EBB933" }, name: "Mustard Yellow" },
        { referenceColor: "#00FF00", interval: { start: "#00CC00", end: "#66FF66" }, name: "Pure Green" },
        { referenceColor: "#006400", interval: { start: "#003300", end: "#339933" }, name: "Dark Green" },
        { referenceColor: "#32CD32", interval: { start: "#00A300", end: "#66E066" }, name: "Lime Green" },
        { referenceColor: "#808000", interval: { start: "#666600", end: "#999933" }, name: "Olive Green" },
        { referenceColor: "#0000FF", interval: { start: "#0000CC", end: "#6666FF" }, name: "Pure Blue" },
        { referenceColor: "#000080", interval: { start: "#000033", end: "#333399" }, name: "Navy Blue" },
        { referenceColor: "#87CEEB", interval: { start: "#66B3D9", end: "#A0E4FF" }, name: "Sky Blue" },
        { referenceColor: "#00FFFF", interval: { start: "#00CCCC", end: "#66FFFF" }, name: "Cyan" },
        { referenceColor: "#800080", interval: { start: "#660066", end: "#993399" }, name: "Pure Purple" },
        { referenceColor: "#E6E6FA", interval: { start: "#CCCCE6", end: "#F2F2FF" }, name: "Lavender" },
        { referenceColor: "#4B0082", interval: { start: "#3A0066", end: "#660099" }, name: "Dark Purple" },
        { referenceColor: "#A52A2A", interval: { start: "#662222", end: "#B35959" }, name: "Brown" },
        { referenceColor: "#D2B48C", interval: { start: "#B89975", end: "#E3C6AA" }, name: "Light Brown" },
        { referenceColor: "#808080", interval: { start: "#666666", end: "#B3B3B3" }, name: "Grey" },
        { referenceColor: "#000000", interval: { start: "#000000", end: "#333333" }, name: "Black" },
        { referenceColor: "#FFFFFF", interval: { start: "#EDEDED", end: "#FFFFFF" }, name: "White" }
    ]);

    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [inputColor, setInputColor] = useState("#FFFFFF");
    const [correspondingColor, setCorrespondingColor] = useState(colors[0]);

    // State for new color form
    const [newColor, setNewColor] = useState({
        referenceColor: "#000000",
        intervalStart: "#000000",
        intervalEnd: "#FFFFFF",
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
                interval: { start: newColor.intervalStart, end: newColor.intervalEnd },
                name: newColor.name,
            },
        ]);
        setNewColor({ referenceColor: "#000000", intervalStart: "#000000", intervalEnd: "#FFFFFF", name: "" }); // Reset form
    };

    const removeColor = (name) => {
        setColors((prev) => prev.filter((color) => color.name !== name));
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Select a Color</h1>

            <div className="flex flex-col items-center mb-4">
                <div
                    className="h-24 w-24 mb-2 rounded border border-gray-300"
                    style={{ backgroundColor: selectedColor.referenceColor }}
                ></div>
                <div
                    style={{
                        background: `linear-gradient(to right, ${selectedColor.interval.start}, ${selectedColor.interval.end})`
                    }}
                    className="h-24 w-96 rounded border border-gray-300"
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
                    <div className="w-24 h-24 mb-2 rounded border border-gray-300" style={{ backgroundColor: inputColor }}></div>
                    <h3 className="text-md font-semibold mb-1">Closest matching color ({correspondingColor.name}):</h3>
                    <div className="w-24 h-24 mb-2 rounded border border-gray-300" style={{ backgroundColor: correspondingColor.referenceColor }}></div>
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
                    <div className="mb-4">
                        <label className="block mb-1">Interval Start (HEX):</label>
                        <input
                            type="color"
                            name="intervalStart"
                            value={newColor.intervalStart}
                            onChange={handleNewColorChange}
                            required
                            className="w-full h-12 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Interval End (HEX):</label>
                        <input
                            type="color"
                            name="intervalEnd"
                            value={newColor.intervalEnd}
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
                                    style={{ backgroundColor: color.referenceColor }}
                                ></div>
                                <span>{color.name}</span>
                            </div>
                            <button onClick={() => removeColor(color.name)} className="text-red-500">Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ColorsPage;
