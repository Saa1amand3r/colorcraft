import connectDB from '@/config/database';
import Question from '@/models/Question';
import UserCounter from '@/models/UserCounter';

export const POST = async (req) => {
    await connectDB();

    try {
        const formData = await req.formData();
        const entries = Array.from(formData.entries());

        let userCounter = await UserCounter.findOne({});
        if (!userCounter) {
            userCounter = new UserCounter({ lastUserId: 0 });
        }

        const userId = userCounter.lastUserId + 1;

        for (const [key, value] of entries) {
            const entity = JSON.parse(value);
            const newQuestion = new Question({
                r1: entity.r1,
                g1: entity.g1,
                b1: entity.b1,
                r2: entity.r2,
                g2: entity.g2,
                b2: entity.b2,
                formal: entity.formal,
                informal: entity.informal,
                basic: entity.basic,
                extravagant: entity.extravagant,
                userId: userId
            });
            await newQuestion.save();
        }

        userCounter.lastUserId = userId;
        await userCounter.save();

        return new Response('Data saved successfully', { status: 200 });
    } catch (error) {
        console.error('Error saving data:', error);
        return new Response('Saving failed', { status: 500 });
    }
};
