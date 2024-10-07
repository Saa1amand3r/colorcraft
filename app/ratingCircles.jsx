const RatingCircles = ({ title, onRatingChange, ratings }) => {
    return (
        <div className="flex flex-col mb-4">
            <h3 className="text-2xl font-bold">{title}</h3>
            <div className="flex items-center">
                <span className="mr-2">1</span> {/* Left side number */}
                <div className="flex space-x-2">
                    {[...Array(10)].map((_, ratingIndex) => (
                        <div
                            key={ratingIndex}
                            onClick={() => onRatingChange(ratingIndex + 1)}
                            className={`h-8 w-8 rounded-full cursor-pointer border-2 border-black 
        ${ratings?.rating === ratingIndex + 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
                        ></div>

                    ))}
                </div>
                <span className="ml-2">10</span> {/* Right side number */}
            </div>
        </div>
    );
};

export default RatingCircles;
