/**
 * @file resumeUpload.test.js
 * @description Integration verification script for Resume Upload module.
 * Tests PDF file upload, 5MB size limit validation, non-PDF rejection, missing file rejection, and response structure.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('=== Starting Resume Upload Module Tests ===');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  // Helper to send multipart/form-data POST request
  function sendMultipartRequest(endpoint, fieldName, filename, mimeType, fileBuffer) {
    return new Promise((resolve, reject) => {
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
      const header = `--${boundary}\r\nContent-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`;
      const footer = `\r\n--${boundary}--\r\n`;

      const bodyBuffer = Buffer.concat([
        Buffer.from(header, 'utf8'),
        fileBuffer,
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

  try {
    // Test 1: Upload valid PDF file under 5MB
    const validPdfBuffer = Buffer.from('%PDF-1.4\n%...\n1 0 obj\n<<>>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
    const res1 = await sendMultipartRequest('/api/v1/resume/upload', 'resume', 'sample_resume.pdf', 'application/pdf', validPdfBuffer);

    assert(res1.statusCode === 200, `Valid PDF upload returns status 200 (Got ${res1.statusCode})`);
    assert(res1.body.success === true, `Response contains success: true`);
    assert(typeof res1.body.fileId === 'string' && res1.body.fileId.length > 0, `Response contains fileId (${res1.body.fileId})`);
    assert(typeof res1.body.filename === 'string' && res1.body.filename.endsWith('.pdf'), `Response contains unique filename (${res1.body.filename})`);
    assert(typeof res1.body.size === 'number' && res1.body.size > 0, `Response contains size (${res1.body.size})`);

    // Test 2: Upload non-PDF file (.txt)
    const txtBuffer = Buffer.from('This is plain text, not a PDF.');
    const res2 = await sendMultipartRequest('/api/v1/resume/upload', 'resume', 'invalid_doc.txt', 'text/plain', txtBuffer);

    assert(res2.statusCode === 400, `Non-PDF upload rejected with 400 (Got ${res2.statusCode})`);
    assert(res2.body.success === false, `Non-PDF response contains success: false`);

    // Test 3: Upload file exceeding 5MB limit
    const oversizedBuffer = Buffer.alloc(6 * 1024 * 1024); // 6 MB
    oversizedBuffer.write('%PDF-1.4', 0);
    const res3 = await sendMultipartRequest('/api/v1/resume/upload', 'resume', 'oversized_resume.pdf', 'application/pdf', oversizedBuffer);

    assert(res3.statusCode === 400, `Oversized file (>5MB) rejected with 400 (Got ${res3.statusCode})`);
    assert(res3.body.success === false, `Oversized response contains success: false`);

    // Test 4: Missing file field
    const res4 = await sendMultipartRequest('/api/v1/resume/upload', 'wrong_field', 'resume.pdf', 'application/pdf', validPdfBuffer);

    assert(res4.statusCode === 400, `Missing file rejected with 400 (Got ${res4.statusCode})`);
    assert(res4.body.success === false, `Missing file response contains success: false`);

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    console.log(`\n=== Test Results: ${passed} passed, ${failed} failed ===`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
