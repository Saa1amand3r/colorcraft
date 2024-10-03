'use client';
import { useState } from "react";

export default function Home() {
    const colors = ["#FFFF00", "#00FF00", "#FF0000", "#0000FF"];

    // Function to generate all possible unique pairs of colors
    const generateColorPairs = (colors) => {
        let pairs = [];
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                pairs.push([colors[i], colors[j]]);
            }
        }
        return pairs;
    };

    const colorPairs = generateColorPairs(colors);

    // State to store the ratings with color information
    const [ratings, setRatings] = useState([]);

    // Handle the change in rating for each color pair
    const handleRatingChange = (index, color1, color2, value) => {
        const newRating = {
            firstColor: color1,
            secondColor: color2,
            rating: value,
        };

        setRatings((prevRatings) => {
            const updatedRatings = [...prevRatings];
            updatedRatings[index] = newRating;
            return updatedRatings;
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create a FormData object
            const formData = new FormData();

            // Append each rating to formData
            ratings.forEach((rating, index) => {
                formData.append(`rating-${index}`, JSON.stringify(rating));
            });

            // Send a POST request to the API route
            const response = await fetch('/api/save-results', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log("Data saved successfully");
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
            <form onSubmit={handleSubmit}>
                {colorPairs.map((pair, index) => (
                    <div key={index} className="mb-4">
                        <h2 className="text-lg mb-2">
                            Rate how well these colors match:
                        </h2>
                        <div className="flex items-center mb-2">
                            <div
                                className="h-[50px] w-[50px] mr-4"
                                style={{ backgroundColor: pair[0] }}
                            ></div>
                            <div
                                className="h-[50px] w-[50px] mr-4"
                                style={{ backgroundColor: pair[1] }}
                            ></div>
                        </div>
                        <label htmlFor={`rating-${index}`}>
                            Rating (1-10):
                        </label>
                        <input
                            type="number"
                            id={`rating-${index}`}
                            min="1"
                            max="10"
                            value={ratings[index]?.rating || ""}
                            onChange={(e) =>
                                handleRatingChange(index, pair[0], pair[1], e.target.value)
                            }
                            className="ml-2 p-1 border rounded"
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
