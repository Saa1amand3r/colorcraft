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

        const headers = new Headers({
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="questions.csv"',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store',
        });

        return new Response(csvContent, {
            status: 200,
            headers: headers,
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        return new Response('Error exporting data', { status: 500 });
    }
};
