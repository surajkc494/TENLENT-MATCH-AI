import React from 'react';
import MatchScoreCard from '../components/MatchScoreCard/MatchScoreCard';
import SkillComparisonTable from '../components/SkillComparisonTable/SkillComparisonTable';
import MissingSkillsCard from '../components/MissingSkillsCard/MissingSkillsCard';
import AIExplanationCard from '../components/AIExplanationCard/AIExplanationCard';
import ResumeSuggestionsCard from '../components/ResumeSuggestionsCard/ResumeSuggestionsCard';
import useAnalysis from '../hooks/useAnalysis';

const AnalysisResult: React.FC = () => {
    const { matchScore, skillComparison, missingSkills, aiExplanation, resumeSuggestions, loading } = useAnalysis();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Analysis Result</h1>
            <MatchScoreCard matchScore={matchScore ?? 0} />
            <SkillComparisonTable resumeSkills={skillComparison} jobDescriptionSkills={skillComparison} />
            <MissingSkillsCard missingSkills={missingSkills} />
            <AIExplanationCard explanation={aiExplanation} />
            <ResumeSuggestionsCard suggestions={resumeSuggestions} />
        </div>
    );
};

export default AnalysisResult;