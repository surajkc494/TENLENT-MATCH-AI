import React from 'react';

const ResumeSuggestionsCard: React.FC<{ suggestions: string[] }> = ({ suggestions }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Resume Improvement Suggestions</h2>
            <ul className="list-disc list-inside">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700">{suggestion}</li>
                ))}
            </ul>
        </div>
    );
};

export default ResumeSuggestionsCard;