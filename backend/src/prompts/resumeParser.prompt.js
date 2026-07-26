/**
 * @file resumeParser.prompt.js
 * @description Isolated prompt template and instructions for Gemini AI resume parsing.
 */

/**
 * Builds the system instruction and prompt for extracting structured resume data.
 * @param {string} resumeText - Raw extracted text from resume document
 * @returns {string} Formatted prompt string for Gemini API
 */
export const buildResumeParserPrompt = (resumeText) => {
  return `You are an expert AI Resume Parser and Talent Intelligence Extractor.
Your task is to analyze the provided raw resume text and accurately extract all candidate information into a valid, strict JSON object.

Do NOT include any markdown code blocks (e.g. \`\`\`json), explanations, preambles, or conversational text. Return ONLY the raw JSON object.

### Extraction Fields Required:
1. "name": Full name of candidate (string or empty string if not found).
2. "email": Email address (string or empty string if not found).
3. "phone": Phone number (string or empty string if not found).
4. "skills": Object with "technical" (array of strings), "soft" (array of strings), and "all" (combined array of strings).
5. "education": Array of objects, each containing:
   - "degree": Degree name (e.g. "B.S. Computer Science")
   - "institution": University or College name
   - "year": Graduation year or date range
   - "fieldOfStudy": Field of study or major
6. "experience": Array of objects, each containing:
   - "company": Company or organization name
   - "role": Job title / position
   - "duration": Employment date range (e.g. "2021 - Present")
   - "responsibilities": Array of strings describing key achievements and duties
7. "projects": Array of objects, each containing:
   - "title": Project name
   - "description": Overview of project
   - "technologies": Array of strings of tech stack used
   - "link": URL link if present or empty string
8. "certifications": Array of strings or objects describing professional certifications.
9. "achievements": Array of strings describing honors, awards, or key milestones.

### Input Resume Text:
---
${resumeText}
---

Return ONLY the extracted JSON object strictly following this structure.`;
};
