import assert from 'assert';
import { resumeParserService } from '../services/resumeParser.service.js';

async function runResumeParserTests() {
  console.log('=== Starting Resume Parser Tests ===');

  const sampleText = `
John Doe
Senior Software Engineer
johndoe@example.com
(555) 123-4567

Skills
JavaScript, Node.js, Express, PostgreSQL

Experience
5 years of web application development and backend API design.

Education
B.S. Computer Science, State University
`;

  const result = await resumeParserService.parseResumeText(sampleText);

  assert.strictEqual(result.candidateInfo.name, 'John Doe');
  assert.strictEqual(result.candidateInfo.email, 'johndoe@example.com');
  assert.ok(result.skills.technical.includes('JavaScript'));
  assert.ok(result.skills.technical.includes('Node.js'));
  assert.strictEqual(result.experienceYears, 5);

  console.log('Resume parser test passed');
}

runResumeParserTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
