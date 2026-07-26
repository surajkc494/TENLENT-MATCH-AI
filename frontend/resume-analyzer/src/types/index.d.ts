interface Resume {
    id: string;
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
}

interface Experience {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface Education {
    degree: string;
    institution: string;
    graduationYear: number;
}

interface JobDescription {
    title: string;
    description: string;
    requiredSkills: string[];
}

interface AnalysisResult {
    matchScore: number;
    missingSkills: string[];
    skillComparison: SkillComparison[];
    aiExplanation: string;
    resumeSuggestions: string[];
}

interface SkillComparison {
    skill: string;
    isPresentInResume: boolean;
    isRequired: boolean;
}