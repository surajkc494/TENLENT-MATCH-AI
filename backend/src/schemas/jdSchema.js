/**
 * @file jdSchema.js
 * @description JSON Schema definition for normalized structured Job Description output.
 */

export const JD_JSON_SCHEMA = {
  type: 'object',
  properties: {
    jobTitle: { type: 'string' },
    department: { type: 'string' },
    requiredSkills: {
      type: 'object',
      properties: {
        mustHave: { type: 'array', items: { type: 'string' } },
        niceToHave: { type: 'array', items: { type: 'string' } },
      },
    },
    minimumExperienceYears: { type: 'number' },
    educationRequirements: { type: 'array', items: { type: 'string' } },
    responsibilities: { type: 'array', items: { type: 'string' } },
  },
};
