import React from 'react';

interface MatchScoreCardProps {
    matchScore: number;
}

const MatchScoreCard: React.FC<MatchScoreCardProps> = ({ matchScore }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Match Score</h2>
            <p className="text-2xl font-bold">{matchScore}%</p>
            <p className="text-gray-600">This score indicates how well your resume matches the job description.</p>
        </div>
    );
};

export default MatchScoreCard;