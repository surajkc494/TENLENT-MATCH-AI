import React, { useState } from 'react';
import JobDescriptionForm from '../components/JobDescriptionForm/JobDescriptionForm';
import AnalyzeButton from '../components/AnalyzeButton/AnalyzeButton';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import useAnalysis from '../hooks/useAnalysis';

const JobDescriptionInput = () => {
    const { analyzeResume, loading, resumeData, setJobDescription: saveJobDescription } = useAnalysis();
    const [jobDescription, setJobDescription] = useState('');

    const handleJobDescriptionChange = (description: string) => {
        setJobDescription(description);
        saveJobDescription(description);
    };

    const handleAnalyze = () => {
        if (!jobDescription.trim() || !resumeData) {
            return;
        }
        analyzeResume(resumeData, jobDescription);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Job Description Input</h1>
            <JobDescriptionForm onSubmit={handleJobDescriptionChange} />
            <AnalyzeButton onClick={handleAnalyze} loading={loading} />
            {!resumeData && <p className="mt-4 text-sm text-red-600">Upload a resume before running the analysis.</p>}
            {loading && <LoadingScreen />}
        </div>
    );
};

export default JobDescriptionInput;
