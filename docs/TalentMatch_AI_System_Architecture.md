# System Architecture Document
## TalentMatch AI — Intelligent Resume & Job Description Matching System

**Document Type:** Software Architecture Specification
**Prepared By:** Principal Software Architecture

---

## 1. High-Level Architecture

TalentMatch AI follows a **three-tier architecture**: a React presentation layer, a FastAPI orchestration/API layer, and an AI processing layer that handles parsing, embedding, and scoring. A persistence layer stores structured results for retrieval.

- **Presentation Tier (React):** Resume upload, JD input, and results/report rendering.
- **Application Tier (FastAPI):** Request handling, validation, and orchestration of the AI pipeline.
- **AI Processing Tier:** LLM-based extraction (Gemini), embedding generation (Sentence Transformers), and similarity/scoring logic.
- **Data Tier (MongoDB):** Stores parsed JSON, scores, and generated explanations.

The system is stateless per request at the API layer, with all persistent state pushed to the database — enabling future horizontal scaling and batch processing.

---

## 2. Data Flow

```
1. User uploads Resume (PDF) + pastes Job Description (text)
2. Frontend sends both to backend via REST (HTTPS)
3. Backend validates input and extracts raw text
   - Resume: PyMuPDF → raw text
   - JD: direct text input
4. Backend sends raw text to Gemini for structured extraction
   - Resume → Resume JSON
   - JD → JD JSON
5. Backend generates embeddings for skills/responsibilities/projects
   via Sentence Transformers
6. Backend computes cosine similarity between Resume and JD vectors
7. Backend aggregates similarity into category scores, then a
   weighted final compatibility score
8. Backend sends extracted JSON + scores to Gemini for
   natural-language explanation + improvement suggestions
9. Backend persists results (Resume JSON, JD JSON, scores,
   explanation, suggestions) to MongoDB
10. Backend returns full report to frontend
11. Frontend renders score, missing skills, explanation, suggestions
```

---

## 3. AI Pipeline

The AI pipeline is a linear, five-stage process:

| Stage | Function | Technology |
|---|---|---|
| **1. Text Extraction** | Convert uploaded resume PDF into raw text | PyMuPDF |
| **2. Structured Extraction** | Convert raw resume/JD text into normalized JSON (skills, projects, education, requirements) | Gemini (LLM) |
| **3. Embedding Generation** | Convert extracted phrases into dense semantic vectors | Sentence Transformers |
| **4. Semantic Matching & Scoring** | Compute cosine similarity per skill/requirement; aggregate into weighted category and final scores | Cosine Similarity + Weighted Scoring Module |
| **5. Explanation & Suggestions** | Generate recruiter-facing explanation and candidate-facing improvement suggestions from extracted JSON + scores | Gemini (LLM) |

**Design principle:** Each stage consumes only the structured output of the previous stage — the explanation/suggestion stage never sees raw text, only validated JSON and computed scores. This constrains the LLM to grounded, non-fabricated output.

---

## 4. Component Diagram (ASCII)

```
                          ┌─────────────────────────────────────────┐
                          │              React Frontend              │
                          │  Resume Upload UI | JD Input | Report UI │
                          └────────────────────┬──────────────────────┘
                                               │ REST API (HTTPS)
                                               v
                          ┌─────────────────────────────────────────┐
                          │              FastAPI Backend              │
                          │  Upload Handler | Validation | Orchestrator│
                          └───────────┬──────────────────┬────────────┘
                                      │                  │
                          ┌───────────v───────┐  ┌───────v────────────┐
                          │   Resume Parser    │  │     JD Parser       │
                          │ (PyMuPDF + Gemini) │  │  (Gemini extraction)│
                          └───────────┬────────┘  └───────┬────────────┘
                                      │                   │
                          ┌───────────v────────┐  ┌───────v────────────┐
                          │    Resume JSON      │  │      JD JSON       │
                          └───────────┬────────┘  └───────┬────────────┘
                                      └────────┬───────────┘
                                               v
                          ┌─────────────────────────────────────────┐
                          │     Sentence Transformer Embedding       │
                          │                 Engine                    │
                          └────────────────────┬──────────────────────┘
                                               v
                          ┌─────────────────────────────────────────┐
                          │        Cosine Similarity Engine           │
                          └────────────────────┬──────────────────────┘
                                               v
                          ┌─────────────────────────────────────────┐
                          │        Weighted Scoring Module            │
                          └────────────────────┬──────────────────────┘
                                               v
                          ┌─────────────────────────────────────────┐
                          │   Gemini: Explanation & Suggestion Gen    │
                          └────────────────────┬──────────────────────┘
                                               v
                          ┌─────────────────────────────────────────┐
                          │       MongoDB: Persist Full Report        │
                          └─────────────────────────────────────────┘
```

---

## 5. Folder Structure

```
talentmatch-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResumeUpload/
│   │   │   ├── JobDescriptionInput/
│   │   │   ├── ReportView/
│   │   │   │   ├── ScoreSummary/
│   │   │   │   ├── SkillComparisonTable/
│   │   │   │   ├── MissingSkills/
│   │   │   │   └── Suggestions/
│   │   │   └── shared/
│   │   ├── pages/
│   │   ├── services/          # API client layer
│   │   ├── hooks/
│   │   ├── styles/
│   │   └── App.jsx
│   └── public/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── resume.py
│   │   │   │   ├── job_description.py
│   │   │   │   └── evaluation.py
│   │   │   └── dependencies.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── parsers/
│   │   │   ├── resume_parser.py       # PyMuPDF + Gemini
│   │   │   └── jd_parser.py           # Gemini extraction
│   │   ├── embeddings/
│   │   │   └── embedding_engine.py    # Sentence Transformers
│   │   ├── scoring/
│   │   │   ├── similarity_engine.py   # Cosine similarity
│   │   │   └── weighted_scorer.py     # Category + final scoring
│   │   ├── ai/
│   │   │   ├── explanation_generator.py
│   │   │   └── suggestion_generator.py
│   │   ├── models/
│   │   │   ├── resume_schema.py
│   │   │   ├── jd_schema.py
│   │   │   └── report_schema.py
│   │   ├── db/
│   │   │   ├── mongo_client.py
│   │   │   └── repositories/
│   │   ├── orchestration/
│   │   │   └── evaluation_pipeline.py # End-to-end pipeline coordinator
│   │   └── main.py
│   └── tests/
│
├── docs/
│   ├── PRD.md
│   └── architecture.md
│
└── README.md
```

---

## 6. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | **React** | Component-based UI for upload, input, and report rendering |
| Styling | Tailwind CSS | Rapid, consistent UI styling |
| Backend/API | **FastAPI** | Async REST API, request validation, orchestration |
| PDF Text Extraction | **PyMuPDF** | Reliable text extraction from resume PDFs, including multi-column layouts |
| LLM (Extraction & Generation) | **Gemini** | Structured JSON extraction; explanation and suggestion generation |
| Embeddings | **Sentence Transformers** | Dense vector representation of skills, responsibilities, projects |
| Similarity Computation | Cosine Similarity | Quantifies semantic closeness between resume and JD vectors |
| Database | MongoDB | Document store for parsed JSON, scores, and generated text |
| Language | Python (backend), JavaScript (frontend) | Core implementation languages |

---

## 7. Module Overview

| Module | Responsibility |
|---|---|
| **Upload Handler** | Accepts resume PDF uploads; validates file type/size |
| **Orchestration Layer** | Coordinates the end-to-end pipeline: parsing → embedding → scoring → explanation |
| **Resume Parser** | Extracts raw text (PyMuPDF) and structures it into Resume JSON (Gemini) |
| **JD Parser** | Structures pasted JD text into JD JSON (Gemini) |
| **Embedding Engine** | Converts structured text segments into semantic vectors |
| **Similarity Engine** | Computes per-skill cosine similarity between resume and JD vectors |
| **Weighted Scoring Module** | Aggregates similarity scores into category scores and a final weighted compatibility percentage |
| **Explanation/Suggestion Generator** | Produces recruiter-facing narrative and candidate-facing improvement recommendations, grounded strictly in extracted JSON and computed scores |
| **Persistence Layer** | Stores and retrieves parsed JSON, scores, and generated text in MongoDB |
| **Report View (Frontend)** | Renders score, skill-by-skill comparison, missing skills, explanation, and suggestions to the user |

---

*End of Document*
