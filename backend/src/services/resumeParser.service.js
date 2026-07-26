/**
 * @file resumeParser.service.js
 * @description Service responsible for extracting PDF text and structuring resume content via heuristics.
 */

import { logger } from '../utils/logger.util.js';
import { removeFile } from '../utils/fileCleanup.util.js';
import { resumeExtractorService } from './resumeExtractor.service.js';
import { ApiError } from '../utils/ApiError.util.js';

const TECHNICAL_SKILLS = [
  { label: 'JavaScript', keywords: ['javascript'] },
  { label: 'Node.js', keywords: ['node.js', 'nodejs'] },
  { label: 'Express', keywords: ['express'] },
  { label: 'React', keywords: ['react'] },
  { label: 'TypeScript', keywords: ['typescript'] },
  { label: 'Python', keywords: ['python'] },
  { label: 'Java', keywords: ['java'] },
  { label: 'C#', keywords: ['c#', 'csharp'] },
  { label: 'SQL', keywords: ['sql'] },
  { label: 'PostgreSQL', keywords: ['postgresql', 'postgres'] },
  { label: 'MySQL', keywords: ['mysql'] },
  { label: 'MongoDB', keywords: ['mongodb'] },
  { label: 'Redis', keywords: ['redis'] },
  { label: 'Docker', keywords: ['docker'] },
  { label: 'Kubernetes', keywords: ['kubernetes'] },
  { label: 'AWS', keywords: ['aws'] },
  { label: 'Azure', keywords: ['azure'] },
  { label: 'GraphQL', keywords: ['graphql'] },
  { label: 'REST', keywords: ['rest'] },
  { label: 'API', keywords: ['api'] },
  { label: 'HTML', keywords: ['html'] },
  { label: 'CSS', keywords: ['css'] },
  { label: 'Tailwind', keywords: ['tailwind'] },
  { label: 'Next.js', keywords: ['next.js', 'nextjs'] },
  { label: 'Vue', keywords: ['vue'] },
  { label: 'NestJS', keywords: ['nestjs'] },
  { label: 'Django', keywords: ['django'] },
  { label: 'Flask', keywords: ['flask'] },
  { label: 'Spring', keywords: ['spring'] },
  { label: 'Linux', keywords: ['linux'] },
  { label: 'Git', keywords: ['git'] },
];

const SOFT_SKILLS = [
  { label: 'Communication', keywords: ['communication'] },
  { label: 'Leadership', keywords: ['leadership'] },
  { label: 'Teamwork', keywords: ['teamwork'] },
  { label: 'Collaboration', keywords: ['collaboration'] },
  { label: 'Problem Solving', keywords: ['problem solving','problem-solving'] },
  { label: 'Mentoring', keywords: ['mentoring'] },
  { label: 'Adaptability', keywords: ['adaptability'] },
  { label: 'Organization', keywords: ['organization'] },
  { label: 'Planning', keywords: ['planning'] },
  { label: 'Time Management', keywords: ['time management'] },
];

const findSkillMatches = (text, skills) => {
  const normalizedText = text.toLowerCase();
  return skills.filter((skill) => skill.keywords.some((keyword) => normalizedText.includes(keyword.toLowerCase()))).map((skill) => skill.label);
};

export const resumeParserService = {
  /**
   * Parses raw resume text into structured resume data using lightweight heuristics.
   * @param {string} rawText - Resume text extracted from PDF
   * @returns {Promise<Object>} Structured resume data object
   */
  async parseResumeText(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      throw ApiError.unprocessableEntity('Resume text is empty or invalid.');
    }

    const text = rawText.trim();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
    const phone = text.match(/\+?\d[\d\s().-]{7,}\d/i)?.[0] || '';
    const name = lines[0] || '';

    const lowerText = text.toLowerCase();
    const technical = findSkillMatches(lowerText, TECHNICAL_SKILLS);
    const soft = findSkillMatches(lowerText, SOFT_SKILLS);

    const experienceYears = (() => {
      const match = text.match(/(\d+)\s*(?:years?|yrs?)\b/i);
      return match ? parseInt(match[1], 10) : 0;
    })();

    const educationSection = text.split(/(?:^|\n)education\s*:?/i)[1] || '';
    const education = educationSection
      ? educationSection.split(/\n/).slice(0, 3).map((entry) => ({
          degree: entry.trim(),
          institution: '',
          year: '',
          fieldOfStudy: '',
        })).filter((entry) => entry.degree)
      : [];

    const experienceSection = text.split(/(?:^|\n)experience\s*:?/i)[1] || '';
    const experience = experienceSection
      ? experienceSection.split(/\n/).slice(0, 3).map((entry) => ({
          company: '',
          role: entry.trim(),
          duration: '',
          responsibilities: [],
        })).filter((entry) => entry.role)
      : [];

    const parsedData = {
      candidateInfo: {
        name,
        email,
        phone,
      },
      skills: {
        technical,
        soft,
        all: [...new Set([...technical, ...soft])],
      },
      education,
      experience,
      projects: [],
      certifications: [],
      achievements: [],
      experienceYears,
    };

    logger.info(`[resumeParserService] Parsed resume text into structured data (${parsedData.skills.technical.length} technical skills).`);

    return parsedData;
  },

  /**
   * Parses uploaded resume PDF file into extracted text & structured JSON.
   * @param {Object} file - Multer file object
   * @returns {Promise<Object>} Structured resume JSON with extracted text
   */
  async parseResumeFile(file) {
    logger.info(`[resumeParserService] Processing resume file: ${file.originalname}`);

    try {
      const extraction = await resumeExtractorService.extractText(file);
      const parsedData = await this.parseResumeText(extraction.text);

      return {
        filename: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        extractedText: extraction.text,
        numPages: extraction.numPages,
        parsedData,
        candidateInfo: parsedData.candidateInfo,
        skills: parsedData.skills,
        experienceYears: parsedData.experienceYears,
      };
    } finally {
      if (file && file.path) {
        await removeFile(file.path);
      }
    }
  },
};
