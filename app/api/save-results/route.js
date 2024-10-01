import connectDB from '@/config/database';
import Question from '@/models/Question';
import UserCounter from '@/models/UserCounter';

export const POST = async (req) => {
    await connectDB();

    try {
        // Extracting the form data
        const formData = await req.formData();
        const entries = Array.from(formData.entries()); // Convert formData to an array of entries
        const ratings = entries.map(([key, value]) => JSON.parse(value)); // Assuming the data is sent as JSON strings

        // Get the current `userId` from the UserCounter model
        let userCounter = await UserCounter.findOne({});
        if (!userCounter) {
            // Initialize if no userId exists
            userCounter = new UserCounter({ lastUserId: 0 });
        }

        const userId = userCounter.lastUserId + 1; // Increment userId for this submission

        // Save each rating in the database with the userId
        for (const entity of ratings) {
            const newQuestion = new Question({
                color1: entity.firstColor,
                color2: entity.secondColor,
                rating: entity.rating,
                userId: userId, // Attach userId to each entry
            });
            await newQuestion.save();
        }

        // Update the `userId` counter in the UserCounter collection
        userCounter.lastUserId = userId;
        await userCounter.save();

        return new Response('Data saved successfully', { status: 200 });
    } catch (error) {
        console.error('Error saving data:', error);
        return new Response('Saving failed', { status: 500 });
    }
};
