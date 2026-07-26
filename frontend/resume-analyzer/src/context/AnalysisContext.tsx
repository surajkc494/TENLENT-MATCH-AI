import React, { createContext, useContext, useState } from 'react';
import { analyzeResume as requestAnalysis } from '../services/api';

interface AnalysisContextType {
  resume: File | null;
  resumeData: unknown | null;
  jobDescription: string;
  matchScore: number | null;
  loading: boolean;
  skillComparison: string[];
  missingSkills: string[];
  aiExplanation: string;
  resumeSuggestions: string[];
  setResume: (file: File | null) => void;
  setResumeData: (data: unknown | null) => void;
  setJobDescription: (description: string) => void;
  setMatchScore: (score: number | null) => void;
  setLoading: (loading: boolean) => void;
  setSkillComparison: (skills: string[]) => void;
  setMissingSkills: (skills: string[]) => void;
  setAiExplanation: (explanation: string) => void;
  setResumeSuggestions: (suggestions: string[]) => void;
  analyzeResume: (resumeData: unknown, jobDescription: string) => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resume, setResume] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<unknown | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [skillComparison, setSkillComparison] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [resumeSuggestions, setResumeSuggestions] = useState<string[]>([]);

  const analyzeResume = async (resumeData: unknown, jobDescription: string) => {
    setLoading(true);

    try {
      const apiEnvelope = await requestAnalysis(resumeData, jobDescription);
      const report = apiEnvelope || {};
      const insights = report.data?.insights || {};
      const score = report.data?.scores?.overallScore ?? 0;

      setMatchScore(score);
      setSkillComparison(insights.matchedSkills || []);
      setMissingSkills(insights.missingSkills || []);
      setAiExplanation(insights.recruiterSummary || 'Analysis completed successfully.');
      setResumeSuggestions(insights.recommendations || []);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnalysisContext.Provider
      value={{
        resume,
        resumeData,
        jobDescription,
        matchScore,
        loading,
        skillComparison,
        missingSkills,
        aiExplanation,
        resumeSuggestions,
        setResume,
        setResumeData,
        setJobDescription,
        setMatchScore,
        setLoading,
        setSkillComparison,
        setMissingSkills,
        setAiExplanation,
        setResumeSuggestions,
        analyzeResume,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
