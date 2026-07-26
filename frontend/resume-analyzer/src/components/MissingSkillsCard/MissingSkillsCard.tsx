import React from 'react';

interface MissingSkillsCardProps {
    missingSkills: string[];
}

const MissingSkillsCard: React.FC<MissingSkillsCardProps> = ({ missingSkills }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Missing Skills</h2>
            {missingSkills.length > 0 ? (
                <ul className="list-disc list-inside">
                    {missingSkills.map((skill, index) => (
                        <li key={index} className="text-gray-700">{skill}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No missing skills found.</p>
            )}
        </div>
    );
};

export default MissingSkillsCard;