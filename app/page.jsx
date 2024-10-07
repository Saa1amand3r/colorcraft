'use client';
import { useState, useEffect } from "react";
import RatingCircles from "@/app/ratingCircles";

// Helper to convert hex to RGB
const hexToRGB = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
};

export default function Home() {
    const [completed, setCompleted] = useState(false);
    const [colorPairs, setColorPairs] = useState([]);
    const [groupedColorPairs, setGroupedColorPairs] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(0);
    const [ratings, setRatings] = useState([]);

    // Function to split color pairs into 5 groups
    const splitIntoGroups = (pairs) => {
        const groupSize = Math.ceil(pairs.length / 5);  // Split into 5 groups
        const groups = [];
        for (let i = 0; i < pairs.length; i += groupSize) {
            groups.push(pairs.slice(i, i + groupSize));
        }
        return groups;
    };

    // Fetch color combinations from the database
    const fetchColorCombinations = async () => {
        try {
            const response = await fetch('/api/save-colors');
            if (!response.ok) throw new Error('Failed to fetch color combinations');
            const data = await response.json();
            const pairs = data.map(combination => [combination.hex1, combination.hex2]);
            setColorPairs(pairs);

            // Split the color pairs into groups and set them
            const groups = splitIntoGroups(pairs);
            setGroupedColorPairs(groups);
        } catch (error) {
            console.error('Error fetching combinations:', error);
        }
    };

    useEffect(() => {
        fetchColorCombinations();
    }, []);

    // Handle rating changes
    const handleRatingChange = (index, category, color1, color2, value) => {
        const newRating = {
            firstColor: color1,
            secondColor: color2,
            category: category,
            rating: value,
        };

        setRatings((prevRatings) => {
            const updatedRatings = [...prevRatings];
            updatedRatings[index] = updatedRatings[index] || {};
            updatedRatings[index][category] = newRating;
            return updatedRatings;
        });
    };

    // Handle group selection
    const handleGroupSelection = (groupIndex) => {
        setSelectedGroup(groupIndex);
        setRatings([]); // Reset ratings when switching groups
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Extract RGB values and ratings for the current group
            const currentGroup = groupedColorPairs[selectedGroup];
            currentGroup.forEach((pair, index) => {
                const rgb1 = hexToRGB(ratings[index]?.Formal?.firstColor || "");
                const rgb2 = hexToRGB(ratings[index]?.Formal?.secondColor || "");

                const combinedRating = {
                    r1: rgb1.r,
                    g1: rgb1.g,
                    b1: rgb1.b,
                    r2: rgb2.r,
                    g2: rgb2.g,
                    b2: rgb2.b,
                    formal: ratings[index]?.Formal?.rating || 0,
                    informal: ratings[index]?.Informal?.rating || 0,
                    basic: ratings[index]?.Basic?.rating || 0,
                    extravagant: ratings[index]?.Extravagant?.rating || 0,
                };

                formData.append(`rating-${index}`, JSON.stringify(combinedRating));
            });

            // POST request to save the data
            const response = await fetch('/api/save-results', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log("Data saved successfully");
                setCompleted(true);
            } else {
                console.error("Failed to save data");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl mb-4">Rate Color Combinations</h1>

            {/* Group Selection */}
            <div className="mb-4">
                <h2>Select a group to rate:</h2>
                {[...Array(5)].map((_, groupIndex) => (
                    <button
                        key={groupIndex}
                        onClick={() => handleGroupSelection(groupIndex)}
                        className={`p-2 m-2 ${selectedGroup === groupIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Group {groupIndex + 1}
                    </button>
                ))}
            </div>

            {/* Display color combinations of the selected group */}
            <form onSubmit={handleSubmit}>
                {groupedColorPairs[selectedGroup]?.map((pair, index) => (
                    <div key={index} className="mb-6">
                        <h2 className="text-lg mb-2">Rate how well these colors match:</h2>
                        <div className="flex items-center mb-2">
                            <div className="h-[50px] w-[50px] mr-4 border-2 border-black" style={{ backgroundColor: pair[0] }}></div>
                            <div className="h-[50px] w-[50px] mr-4 border-2 border-black" style={{ backgroundColor: pair[1] }}></div>
                        </div>

                        <RatingCircles
                            title="Formal"
                            ratings={ratings[index]?.Formal || 0}
                            pair={pair}
                            onRatingChange={(value) => handleRatingChange(index, "Formal", pair[0], pair[1], value)}
                        />
                        <RatingCircles
                            title="Informal"
                            ratings={ratings[index]?.Informal || 0}
                            pair={pair}
                            onRatingChange={(value) => handleRatingChange(index, "Informal", pair[0], pair[1], value)}
                        />
                        <RatingCircles
                            title="Basic"
                            ratings={ratings[index]?.Basic || 0}
                            pair={pair}
                            onRatingChange={(value) => handleRatingChange(index, "Basic", pair[0], pair[1], value)}
                        />
                        <RatingCircles
                            title="Extravagant"
                            ratings={ratings[index]?.Extravagant || 0}
                            pair={pair}
                            onRatingChange={(value) => handleRatingChange(index, "Extravagant", pair[0], pair[1], value)}
                        />
                    </div>
                ))}
                {completed && <p className="text-green-600">Thank you!</p>}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
            </form>
        </div>
    );
}
