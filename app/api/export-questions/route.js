import connectDB from '@/config/database';
import Question from '@/models/Question';

export const GET = async (req) => {
    await connectDB();

    try {
        const questions = await Question.find({});

        const csvHeaders = 'UserId, R1, G1, B1, R2, G2, B2, Formal, Informal, Basic, Extravagant\n';
        const csvData = questions.map(q =>
            `${q.userId}, ${q.r1}, ${q.g1}, ${q.b1}, ${q.r2}, ${q.g2}, ${q.b2}, ${q.formal}, ${q.informal}, ${q.basic}, ${q.extravagant}`
        ).join('\n');

        const csvContent = csvHeaders + csvData;

        const headers = new Headers({
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="color_ratings.csv"',
        });

        return new Response(csvContent, { status: 200, headers });
    } catch (error) {
        console.error('Error exporting data:', error);
        return new Response('Error exporting data', { status: 500 });
    }
};
