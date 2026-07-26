import React from 'react';

interface SkillComparisonTableProps {
    resumeSkills: string[];
    jobDescriptionSkills: string[];
}

const SkillComparisonTable: React.FC<SkillComparisonTableProps> = ({ resumeSkills, jobDescriptionSkills }) => {
    const matchedSkills = resumeSkills.filter(skill => jobDescriptionSkills.includes(skill));
    const missingSkills = jobDescriptionSkills.filter(skill => !resumeSkills.includes(skill));

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Skill</th>
                        <th className="border border-gray-300 p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {jobDescriptionSkills.map((skill, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">{skill}</td>
                            <td className={`border border-gray-300 p-2 ${matchedSkills.includes(skill) ? 'text-green-600' : 'text-red-600'}`}>
                                {matchedSkills.includes(skill) ? 'Matched' : 'Missing'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {missingSkills.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-bold">Missing Skills:</h3>
                    <ul className="list-disc pl-5">
                        {missingSkills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SkillComparisonTable;