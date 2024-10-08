'use client';

export const fetchCache = 'force-no-store';

export default function ExportPage() {
    // Function to handle downloading the CSV file
    const handleDownloadCSV = async () => {
        try {
            // Fetch CSV with timestamp query parameter to force cache invalidation
            const response = await fetch(`/api/export-questions?ts=${Date.now()}`, {
                cache: 'no-store',  // Make sure to disable browser caching as well
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                // Trigger download of the file
                const a = document.createElement('a');
                a.href = url;
                a.download = 'questions.csv';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error('Failed to download CSV');
            }
        } catch (error) {
            console.error('Error downloading CSV:', error);
        }
    };


    return (
        <div className="p-4">
            <h1 className="text-xl mb-4">Rate Color Combinations</h1>
            {/* Other UI elements (form, ratings) */}

            {/* Download CSV Button */}
            <button
                onClick={handleDownloadCSV}
                className="bg-green-500 text-white p-2 rounded"
            >
                Download CSV
            </button>
        </div>
    );
}
