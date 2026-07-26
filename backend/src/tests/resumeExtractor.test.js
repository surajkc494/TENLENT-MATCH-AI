/**
 * @file resumeExtractor.test.js
 * @description Integration and unit verification test suite for Resume Text Extraction module.
 */

import http from 'http';
import app from '../app.js';
import { cleanExtractedText } from '../utils/textSanitizer.util.js';
import { resumeExtractorService } from '../services/resumeExtractor.service.js';

async function runExtractorTests() {
  console.log('=== Starting Resume Text Extraction Module Tests ===');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // Unit Test 1: textSanitizer.util.js
  console.log('\n--- Unit Test: textSanitizer.util.js ---');
  const dirtyText = "   John   Doe   \r\n\r\n   Software   Engineer   \n\n\n\n   Experience:   \r   5   Years   \n\n";
  const cleaned = cleanExtractedText(dirtyText);
  const expectedClean = "John Doe\n\nSoftware Engineer\n\nExperience:\n5 Years";

  assert(cleaned === expectedClean, `Whitespace removed and paragraph structure preserved.`);

  // Integration Test 2: HTTP Endpoint POST /api/v1/resume/extract-text
  console.log('\n--- Integration Test: HTTP POST /api/v1/resume/extract-text ---');
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  function sendMultipartPdf(endpoint, pdfBuffer) {
    return new Promise((resolve, reject) => {
      const boundary = '----WebKitFormBoundaryTextExtract' + Math.random().toString(36).substring(2);
      const header = `--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="resume_sample.pdf"\r\nContent-Type: application/pdf\r\n\r\n`;
      const footer = `\r\n--${boundary}--\r\n`;

      const bodyBuffer = Buffer.concat([
        Buffer.from(header, 'utf8'),
        pdfBuffer,
        Buffer.from(footer, 'utf8'),
      ]);

      const urlObj = new URL(`${baseUrl}${endpoint}`);
      const req = http.request(
        {
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.pathname,
          method: 'POST',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': bodyBuffer.length,
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
            } catch (err) {
              resolve({ statusCode: res.statusCode, body: data });
            }
          });
        }
      );

      req.on('error', reject);
      req.write(bodyBuffer);
      req.end();
    });
  }

  try {
    // Standard minimal PDF with text content
    const samplePdfBuffer = Buffer.from(
      '%PDF-1.4\n' +
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n' +
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n' +
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n' +
      '4 0 obj << /Length 73 >> stream\n' +
      'BT\n' +
      '/F1 12 Tf\n' +
      '100 700 Td\n' +
      '(John Doe - Senior Software Engineer) Tj\n' +
      'ET\n' +
      'endstream endobj\n' +
      '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n' +
      'xref\n' +
      '0 6\n' +
      '0000000000 65535 f \n' +
      '0000000010 00000 n \n' +
      '0000000060 00000 n \n' +
      '0000000120 00000 n \n' +
      '0000000248 00000 n \n' +
      '0000000371 00000 n \n' +
      'trailer << /Size 6 /Root 1 0 R >>\n' +
      'startxref\n' +
      '440\n' +
      '%%EOF'
    );

    const res = await sendMultipartPdf('/api/v1/resume/extract-text', samplePdfBuffer);

    assert(res.statusCode === 200, `HTTP status code is 200 (Got ${res.statusCode})`);
    assert(res.body.success === true, `Response success is true`);
    assert(typeof res.body.text === 'string', `Output JSON contains "text" property`);
    assert(res.body.text.includes('John Doe - Senior Software Engineer'), `Extracted text matches PDF content`);

  } catch (err) {
    console.error('Test error:', err);
    failed++;
  } finally {
    server.close();
    console.log(`\n=== Extractor Test Results: ${passed} passed, ${failed} failed ===`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runExtractorTests();
