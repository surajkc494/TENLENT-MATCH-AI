import React from 'react';

interface AIExplanationCardProps {
    explanation: string;
}

const AIExplanationCard: React.FC<AIExplanationCardProps> = ({ explanation }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">AI Explanation</h2>
            <p className="text-gray-700">{explanation}</p>
        </div>
    );
};

export default AIExplanationCard;