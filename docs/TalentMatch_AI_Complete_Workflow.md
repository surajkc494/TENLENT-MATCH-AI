# Complete Workflow Document
## TalentMatch AI — End-to-End Application Workflow

**Document Type:** Solution Workflow Specification
**Prepared By:** Solution Architecture
**Scope:** From website open to displayed AI analysis
**Stack Context:** React frontend · Node.js/Express backend · Gemini API · pdf-parse · Sentence-Transformer-style semantic matching

---

## 1. User Workflow

Describes what the human actor does and sees, end to end.

1. **Landing:** User opens the TalentMatch AI website and lands on the Home page, which introduces the product and presents a "Get Started" call to action.
2. **Navigation to Upload:** User navigates to the Upload page.
3. **Resume Upload:** User drags/drops or browses to select a resume PDF. The UI validates file type and size client-side and shows a file preview.
4. **Job Description Entry:** User pastes the target job description text into a text area. The UI validates minimum length client-side.
5. **Submission:** User clicks "Evaluate Match." The button enters a loading state; the app navigates to the Report page.
6. **Waiting:** User sees a full-page loading indicator with status messaging while the backend pipeline executes.
7. **Result Viewing:** On completion, the user sees the full report: overall compatibility score, match band, category breakdown, skill-by-skill comparison, missing-skills panel, AI explanation, and improvement suggestions.
8. **Error Path (if applicable):** If processing fails, the user sees a clear error state with a retry option instead of a report.
9. **Follow-up Actions:** User may re-run an evaluation with a different JD, or exit with actionable feedback in hand.

---

## 2. Backend Workflow

Describes what the Express server does per request.

1. **Request Reception:** Express receives the incoming HTTP request (file upload + JD text, or a combined evaluation request).
2. **Security & Logging Middleware:** Helmet applies secure headers; CORS validates origin; Morgan logs the request.
3. **Parsing Middleware:** Multer parses the multipart resume upload into a temporary file; the JSON/body parser handles the JD text field.
4. **Validation:** Request-specific validators confirm the resume file is a valid PDF within size limits and the JD text meets length requirements. Invalid requests short-circuit with a 400 error.
5. **Controller Orchestration:** The evaluation controller invokes services in sequence: resume parsing, JD parsing, embedding/similarity, scoring, explanation generation.
6. **Service Execution:** Each service performs its isolated responsibility (see Sections 4–8) and returns plain data to the controller.
7. **Response Assembly:** The controller assembles the final report object and wraps it in a standardized success response.
8. **Cleanup:** Temporary uploaded files are deleted regardless of success or failure.
9. **Error Interception:** Any thrown error at any stage is caught by the centralized error-handling middleware and returned as a standardized error response.

---

## 3. AI Workflow

Describes how AI components are invoked across the pipeline.

1. **Structured Extraction (Gemini — Resume):** Raw resume text is sent to Gemini with an extraction prompt; Gemini returns structured JSON (skills, projects, education, certifications).
2. **Structured Extraction (Gemini — Job Description):** Raw JD text is sent to Gemini with a matching extraction prompt; Gemini returns structured JSON (required/preferred skills, responsibilities, experience, education criteria).
3. **Schema Validation:** Both JSON responses are validated against expected schemas before proceeding; malformed responses trigger a bounded retry.
4. **Embedding Generation:** Each extracted skill, responsibility, and project phrase from both documents is converted into a dense semantic vector.
5. **Semantic Similarity Computation:** Cosine similarity is computed between each JD requirement vector and the closest matching resume vector.
6. **Weighted Score Aggregation:** Similarity scores are aggregated into category scores, then combined into a final weighted percentage using fixed, documented weights.
7. **Explanation Generation (Gemini):** The final scores plus structured JSON (not raw text) are sent to Gemini to generate a recruiter-facing natural-language explanation.
8. **Suggestion Generation (Gemini):** The same grounded inputs are used to generate candidate-facing improvement suggestions (skills, projects, certifications).

**Key AI design constraint:** Gemini never sees raw, unvalidated text at the explanation/suggestion stage — only structured, schema-validated JSON and computed scores — to prevent fabricated or ungrounded output.

---

## 4. Resume Processing Workflow

1. **File Receipt:** Multer saves the uploaded PDF to a temporary uploads directory.
2. **Text Extraction:** pdf-parse reads the PDF and extracts raw text, including multi-section content (Skills, Projects, Education, Certifications).
3. **Pre-processing:** Raw text is cleaned (whitespace normalization, artifact removal) before being sent to Gemini.
4. **LLM Structuring:** Gemini converts the cleaned raw text into a normalized Resume JSON schema (contact info, skills by category, projects, education, certifications, soft skills).
5. **Schema Validation:** The returned JSON is checked against the expected Resume schema; missing fields are explicitly marked as absent rather than inferred.
6. **Temporary File Cleanup:** The original PDF is deleted from disk once text extraction and structuring are complete.
7. **Output:** A validated Resume JSON object is passed downstream to the matching stage.

---

## 5. Job Description Processing Workflow

1. **Text Receipt:** JD text submitted via the form is received as part of the request body.
2. **Validation:** Backend validator confirms non-empty content and a minimum character threshold.
3. **Pre-processing:** Text is trimmed and normalized.
4. **LLM Structuring:** Gemini converts the JD text into a normalized JD JSON schema (job role, company, required skills by category, preferred skills, responsibilities, experience requirement, education requirement, preferred project types, soft skills).
5. **Schema Validation:** The returned JSON is checked against the expected JD schema.
6. **Output:** A validated JD JSON object is passed downstream to the matching stage, alongside the Resume JSON.

---

## 6. Matching Workflow

1. **Input:** Validated Resume JSON and JD JSON.
2. **Phrase Extraction:** Each individual skill, responsibility, and project descriptor from both documents is treated as a discrete comparison unit.
3. **Embedding:** Each unit is embedded into a dense vector representation capturing semantic meaning.
4. **Pairwise Comparison:** For each JD requirement, cosine similarity is computed against all candidate resume vectors; the highest-scoring match is selected.
5. **Match Classification:** Each JD requirement is classified as Full Match, Partial Match, or No Match based on similarity thresholds.
6. **Category Grouping:** Matches are grouped into five evaluation categories: Skill, Experience, Education, Projects, Certification.
7. **Output:** A skill-by-skill comparison table with similarity scores, match status, and reasoning, ready for score aggregation.

---

## 7. Score Generation Workflow

1. **Category Scoring:** Within each category, individual match scores are aggregated into a single category percentage (e.g., Skill Match = weighted blend of required-skill and preferred-skill sub-scores).
2. **Weight Application:** Fixed, documented category weights are applied (e.g., Skill 50%, Experience 20%, Projects 15%, Education 10%, Certification 5%).
3. **Final Score Calculation:** Weighted category contributions are summed into a single final compatibility percentage.
4. **Band Mapping:** The final percentage is mapped to a qualitative match band (Excellent / Strong / Moderate / Weak Match) with a suggested recruiter action.
5. **Output:** Final score, category breakdown, and match band, passed to the explanation stage.

---

## 8. AI Explanation Workflow

1. **Context Assembly:** The system assembles a context payload containing the Resume JSON, JD JSON, category scores, final score, and match band — no raw text.
2. **Prompt Construction:** A structured prompt instructs Gemini to generate a recruiter-facing explanation strictly from the provided context, with no fabrication.
3. **Explanation Generation:** Gemini returns a natural-language paragraph summarizing strengths, relevant experience, and key gaps.
4. **Grounding Check:** The explanation is checked for consistency against the extracted data (e.g., no skill mentioned that isn't present in the JSON).
5. **Output:** A validated, recruiter-facing explanation string included in the final report.

---

## 9. Resume Recommendation (Improvement Suggestion) Workflow

1. **Gap Identification:** Missing and partially-evidenced skills identified in the Matching Workflow are compiled into a structured gap list.
2. **Prioritization:** Gaps are prioritized by category weight and impact on the final score (e.g., a missing required skill outweighs a missing preferred skill).
3. **Suggestion Prompt Construction:** Gemini is prompted with the gap list and JD context to generate concrete, actionable recommendations.
4. **Categorized Output Generation:** Gemini returns suggestions grouped into: Skills to Learn, Projects to Add, Certifications to Pursue, and ATS/Resume Compatibility Tips.
5. **Grounding Check:** Suggestions are verified to reference only gaps that were actually identified — no invented or irrelevant recommendations.
6. **Output:** A structured suggestions object included in the final report and rendered in the Improvement Suggestions panel.

---

## 10. Error Handling Workflow

1. **Client-Side Validation Errors:** Invalid file type/size or insufficient JD length are caught before submission; inline errors are shown, and no request is sent.
2. **Request-Level Validation Errors (Backend):** Malformed or incomplete requests are rejected with a 400 response and field-level error messages, surfaced as toast notifications.
3. **File Processing Errors:** Corrupted or unreadable PDFs cause pdf-parse to fail; the resume service throws a descriptive `ApiError`, cleanup still runs, and the client receives a clear "could not read resume" message.
4. **AI Service Errors:** Gemini API failures (timeout, rate limit, malformed response) trigger a bounded retry; on repeated failure, a controlled `ApiError` is thrown rather than allowing an unhandled exception.
5. **Schema Validation Failures:** If Gemini's structured output doesn't match the expected schema after retries, the pipeline halts with an explicit error rather than passing malformed data downstream.
6. **Unexpected Server Errors:** Any uncaught exception is captured by the centralized error-handling middleware, logged with full detail server-side, and returned to the client as a generic, safe error message.
7. **Frontend Error Display:** All error types are normalized into a consistent shape by the Axios interceptor and rendered via the shared `ErrorState` component with a retry action.
8. **Process-Level Safety:** Unhandled promise rejections or exceptions at the process level are logged and trigger a graceful shutdown rather than a silent crash.

---

## 11. Activity Diagram

```
        [Start: User Opens Website]
                    │
                    v
          [View Home Page]
                    │
                    v
        [Navigate to Upload Page]
                    │
                    v
        [Select Resume PDF] ──> [Client Validation] ──(invalid)──> [Show Inline Error] ──┐
                    │ (valid)                                                            │
                    v                                                                    │
        [Paste Job Description] ──> [Client Validation] ──(invalid)──> [Show Inline Error]│
                    │ (valid)                                                             │
                    v                                                                     │
          [Click "Evaluate Match"] <──────────────────────────────────────────────────────┘
                    │
                    v
        [Frontend: Show Loading State]
                    │
                    v
        [Backend: Receive Request]
                    │
                    v
        [Middleware: Security, Parse, Validate] ──(invalid)──> [Return 400 Error]
                    │ (valid)
                    v
        [Resume Processing: Extract + Structure]
                    │
                    v
        [JD Processing: Structure]
                    │
                    v
        [Matching: Embed + Compare]
                    │
                    v
        [Score Generation: Aggregate + Weight]
                    │
                    v
        [AI Explanation Generation]
                    │
                    v
        [AI Recommendation Generation]
                    │
                    v
        [Assemble Final Report]
                    │
                    v
        [Return Report to Frontend]
                    │
                    v
        [Frontend: Render Report Dashboard]
                    │
                    v
            [End: User Views Analysis]

        (Any failure branch) ──> [Error Middleware] ──> [Return Error Response]
                                          │
                                          v
                              [Frontend: Show Error State + Retry]
```

---

## 12. Sequence Diagram

```
User          Frontend (React)      Backend (Express)      Gemini API      Embedding/Scoring
 │                   │                      │                    │                  │
 │  Open website      │                      │                    │                  │
 │──────────────────>│                      │                    │                  │
 │                   │  Render Home Page      │                    │                  │
 │<──────────────────│                      │                    │                  │
 │                   │                      │                    │                  │
 │  Upload resume +   │                      │                    │                  │
 │  paste JD + submit │                      │                    │                  │
 │──────────────────>│                      │                    │                  │
 │                   │  POST /api/evaluate    │                    │                  │
 │                   │  (multipart + JSON)     │                    │                  │
 │                   │─────────────────────>│                    │                  │
 │                   │                      │  Validate + parse    │                  │
 │                   │                      │  resume (pdf-parse)   │                  │
 │                   │                      │                    │                  │
 │                   │                      │  Structure resume     │                  │
 │                   │                      │─────────────────────>│                  │
 │                   │                      │                    │  Resume JSON       │
 │                   │                      │<─────────────────────│                  │
 │                   │                      │                    │                  │
 │                   │                      │  Structure JD          │                  │
 │                   │                      │─────────────────────>│                  │
 │                   │                      │                    │  JD JSON           │
 │                   │                      │<─────────────────────│                  │
 │                   │                      │                    │                  │
 │                   │                      │  Generate embeddings & compute similarity │
 │                   │                      │──────────────────────────────────────────>│
 │                   │                      │                    │        Similarity/    │
 │                   │                      │                    │        Category scores │
 │                   │                      │<──────────────────────────────────────────│
 │                   │                      │                    │                  │
 │                   │                      │  Generate explanation │                  │
 │                   │                      │─────────────────────>│                  │
 │                   │                      │                    │  Explanation text  │
 │                   │                      │<─────────────────────│                  │
 │                   │                      │                    │                  │
 │                   │                      │  Generate suggestions │                  │
 │                   │                      │─────────────────────>│                  │
 │                   │                      │                    │  Suggestions       │
 │                   │                      │<─────────────────────│                  │
 │                   │                      │                    │                  │
 │                   │                      │  Assemble final report │                │
 │                   │  200 OK + Report JSON  │                    │                  │
 │                   │<─────────────────────│                    │                  │
 │  View report        │                      │                    │                  │
 │<──────────────────│                      │                    │                  │
```

---

## 13. Data Flow Diagram

```
 ┌───────────┐     Resume PDF, JD Text     ┌──────────────┐
 │   User     │ ───────────────────────────>│  React Client │
 └───────────┘                             └──────┬───────┘
                                                   │ multipart/JSON (HTTPS)
                                                   v
                                          ┌──────────────────┐
                                          │  Express Backend   │
                                          └───────┬──────────┘
                                                   │
                        ┌──────────────────────────┼──────────────────────────┐
                        v                          v                          v
               ┌──────────────┐          ┌──────────────┐          ┌──────────────────┐
               │ pdf-parse      │          │  Gemini API    │          │ Embedding/Scoring  │
               │ (raw text)      │          │ (structuring,   │          │ Engine               │
               │                 │          │  explanation,    │          │ (similarity, weights) │
               │                 │          │  suggestions)     │          │                      │
               └──────┬───────┘          └──────┬───────┘          └────────┬─────────┘
                      │                          │                           │
                      └────────────┬─────────────┴─────────────┬────────────┘
                                   v                           v
                          ┌──────────────────────────────────────┐
                          │      Assembled Evaluation Report        │
                          │  (score, breakdown, explanation, tips)   │
                          └──────────────────┬──────────────────┘
                                             v
                                   ┌──────────────────┐
                                   │  Express Backend   │
                                   └──────┬───────────┘
                                          │ JSON response (HTTPS)
                                          v
                                   ┌──────────────┐
                                   │  React Client  │
                                   └──────┬───────┘
                                          │ Rendered UI
                                          v
                                   ┌───────────┐
                                   │   User     │
                                   └───────────┘
```

---

## 14. Request Flow Diagram

```
Client Request (POST /api/evaluate)
        │
        v
┌─────────────────┐
│   Helmet          │  → security headers
└────────┬─────────┘
         v
┌─────────────────┐
│   CORS            │  → origin check
└────────┬─────────┘
         v
┌─────────────────┐
│   Morgan          │  → request logging
└────────┬─────────┘
         v
┌─────────────────┐
│  Multer (file)     │  → parses resume PDF
└────────┬─────────┘
         v
┌─────────────────┐
│  Validation         │  → checks file + JD text
└────────┬─────────┘
         │(invalid)──────────────> [400 Error Response]
         v(valid)
┌─────────────────┐
│  Evaluation          │
│  Controller           │
└────────┬─────────┘
         v
┌─────────────────┐
│  Resume Service       │──> pdf-parse ──> Gemini (structure)
└────────┬─────────┘
         v
┌─────────────────┐
│  JD Service            │──> Gemini (structure)
└────────┬─────────┘
         v
┌─────────────────┐
│  Similarity Service     │──> Embeddings ──> Cosine similarity
└────────┬─────────┘
         v
┌─────────────────┐
│  Scoring Service          │──> Category + final weighted score
└────────┬─────────┘
         v
┌─────────────────┐
│  Explanation Service        │──> Gemini (explanation + suggestions)
└────────┬─────────┘
         v
┌─────────────────┐
│  Response Assembly            │
└────────┬─────────┘
         │(error at any stage)──> [Error Handler Middleware] ──> [Error Response]
         v(success)
┌─────────────────┐
│  200 OK + Report Payload         │
└──────────────────┘
```

---

*End of Document*
