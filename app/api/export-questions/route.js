import connectDB from '@/config/database';
import Question from '@/models/Question';

export const GET = async (req) => {
    await connectDB();

    try {
        // Fetch all questions from the database
        const questions = await Question.find({});

        // Define CSV headers, now including userId
        const csvHeaders = 'UserId, Color 1, Color 2, Rating\n';

        // Generate CSV data
        const csvData = questions.map(q => `${q.userId}, ${q.color1}, ${q.color2}, ${q.rating}`).join('\n');

        // Combine headers and data
        const csvContent = csvHeaders + csvData;

        // Return the CSV data as a downloadable file
        return new Response(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="questions.csv"',
            },
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        return new Response('Error exporting data', { status: 500 });
    }
};
