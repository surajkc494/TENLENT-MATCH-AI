/**
 * @file resumeSchema.js
 * @description JSON Schema definition & output validation for structured Resume extraction.
 */

export const RESUME_JSON_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    skills: {
      type: 'object',
      properties: {
        technical: { type: 'array', items: { type: 'string' } },
        soft: { type: 'array', items: { type: 'string' } },
        all: { type: 'array', items: { type: 'string' } },
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          degree: { type: 'string' },
          institution: { type: 'string' },
          year: { type: 'string' },
          fieldOfStudy: { type: 'string' },
        },
      },
    },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          company: { type: 'string' },
          role: { type: 'string' },
          duration: { type: 'string' },
          responsibilities: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    projects: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          technologies: { type: 'array', items: { type: 'string' } },
          link: { type: 'string' },
        },
      },
    },
    certifications: { type: 'array', items: { type: 'string' } },
    achievements: { type: 'array', items: { type: 'string' } },
  },
  required: ['name', 'email', 'phone', 'skills', 'education', 'experience', 'projects', 'certifications', 'achievements'],
};

/**
 * Validates that parsed Gemini output matches required schema structure.
 * @param {Object} data - Parsed JSON object from Gemini
 * @returns {{ isValid: boolean, errors: string[] }} Validation result and list of error messages
 */
export const validateResumeOutput = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { isValid: false, errors: ['Output must be a non-null JSON object'] };
  }

  // Ensure top-level required fields exist
  const requiredKeys = ['name', 'email', 'phone', 'skills', 'education', 'experience', 'projects', 'certifications', 'achievements'];

  for (const key of requiredKeys) {
    if (!(key in data)) {
      errors.push(`Missing required top-level property: '${key}'`);
    }
  }

  // Ensure array fields are arrays if defined
  const arrayKeys = ['education', 'experience', 'projects', 'certifications', 'achievements'];
  for (const key of arrayKeys) {
    if (data[key] !== undefined && !Array.isArray(data[key])) {
      errors.push(`Property '${key}' must be an array`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
