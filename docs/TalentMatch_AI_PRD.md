# Product Requirements Document
## TalentMatch AI — Intelligent Resume & Job Description Matching System

**Document Type:** Product Requirements Document (PRD)
**Project Type:** 24-Hour AI Hackathon Project
**Prepared By:** Product Management & AI Solution Architecture
**Domains:** Artificial Intelligence · Natural Language Processing · Semantic Search · HR Technology

---

## 1. Executive Summary

TalentMatch AI is an AI-powered resume-to-job-description matching platform designed to replace brittle, keyword-driven resume screening with a context-aware, explainable evaluation pipeline. The system ingests a candidate resume and a target job description, extracts structured information from both using LLM-assisted parsing, generates vector embeddings for semantic comparison, and produces a weighted compatibility score alongside a natural-language explanation and actionable improvement recommendations.

Built as a 24-hour hackathon proof of concept, TalentMatch AI demonstrates a complete, end-to-end pipeline — from document ingestion to explainable scoring — that is technically feasible within a constrained timeframe while delivering a materially better outcome than traditional Applicant Tracking Systems (ATS). The MVP has been validated against a real resume-JD pair (an AI/ML Software Engineer Intern candidate evaluated against a matching job description), producing a reproducible compatibility score of approximately 80%, correctly identifying semantic equivalences (e.g., "Flask" satisfying a "Flask or FastAPI" requirement) that keyword-based systems would miss.

This PRD defines the product requirements to formalize TalentMatch AI from hackathon prototype into a structured product initiative, covering problem framing, target users, functional and non-functional requirements, MVP boundaries, and a roadmap for future scaling.

---

## 2. Problem Statement

Modern recruitment pipelines — particularly for high-volume internship and entry-level technical roles — are overwhelmed by application volume relative to recruiter bandwidth. This creates several compounding problems:

- **High application volume:** A single posting can attract hundreds of resumes, making manual review of every application impractical within a reasonable hiring timeline.
- **Manual screening is slow and inconsistent:** Human review is fatigue-prone and varies significantly between reviewers, especially against multi-section job descriptions with dozens of required and preferred criteria.
- **Keyword-based ATS limitations:** Traditional ATS software performs literal string matching (e.g., searching for "FastAPI"). A resume listing a functionally equivalent but differently-worded skill (e.g., "Flask") can be auto-rejected even when the job description would accept either.
- **Semantic blindness:** Keyword systems cannot recognize that differently-phrased terms (e.g., "LLM Integration" vs. "Large Language Models (LLMs)") describe the same underlying competency unless the wording is character-identical.
- **No feedback loop for candidates:** Rejected candidates typically receive no explanation, leaving them unable to identify and close relevant skill gaps.
- **Inconsistent evaluation criteria:** Without documented, fixed scoring weights, different recruiters weigh the same resume differently, introducing evaluation variance and potential unfairness.

TalentMatch AI is designed to directly address each of these pain points through a semantic, explainable, AI-driven evaluation pipeline.

---

## 3. Existing Solution Analysis

### Current Approaches

| Approach | Mechanism | Key Limitations |
|---|---|---|
| **Keyword-matching ATS** | Scans resume text for literal occurrences of JD-derived terms; scores by keyword density | No semantic understanding; penalizes valid synonyms and equivalent phrasing |
| **Boolean search** | Recruiters construct queries (e.g., "Python" AND "React" AND ("AWS" OR "Docker")) | Rigid; requires recruiters to anticipate every valid phrasing in advance |
| **Manual HR screening** | A recruiter reads and subjectively judges each resume | Slow, inconsistent across reviewers, does not scale with volume |

### Disadvantages of Existing Solutions

- No understanding of semantic equivalence between differently-worded but functionally identical skills.
- No weighting logic — a resume matching several low-importance keywords can outrank one matching fewer high-importance ones.
- No explanation generated for accept/reject decisions, creating a "black box" experience for both recruiters and candidates.
- No skill-gap or improvement guidance returned to unsuccessful candidates.
- Poor scalability against detailed, multi-project resumes and multi-section job descriptions.

### Market Gap

Existing ATS and screening tools optimize for *filtering out* volume rather than *surfacing* genuinely qualified candidates who are phrased differently from the job posting. There is a clear opportunity for a semantic, transparent, and feedback-oriented alternative.

---

## 4. Proposed Solution

TalentMatch AI replaces literal keyword filtering with a semantic, LLM-assisted pipeline that:

1. Parses both resume and job description into structured, machine-readable data using LLM-assisted extraction.
2. Converts extracted content into dense vector embeddings using a sentence-transformer model.
3. Computes semantic similarity (via cosine similarity) between resume content and JD requirements — capturing meaning rather than exact wording.
4. Aggregates per-skill similarity scores into category-level scores (Skill, Experience, Education, Projects, Certification).
5. Combines category scores into a single, weighted, interpretable compatibility percentage using a documented, fixed-weight formula.
6. Detects and surfaces missing or partially-evidenced skills.
7. Generates a natural-language explanation of the match, suitable for direct recruiter consumption.
8. Produces candidate-facing, actionable resume improvement suggestions grounded in the identified gaps.

### Why This Approach Is Better Than Traditional ATS

- **Semantic understanding:** Recognizes that differently-worded skills describing the same competency are equivalent, rather than requiring exact string matches.
- **Weighted, documented scoring:** Reflects that some categories (e.g., core skills) matter more than others (e.g., certifications), rather than treating every keyword equally.
- **Explainability:** Every score is paired with a human-readable justification, addressing the "black box" problem common to opaque ML filters.
- **Actionable feedback:** Missing-skill detection converts a rejection or partial match into constructive guidance rather than silence.

---

## 5. Vision

**To become the default intelligence layer between candidates and job descriptions — replacing opaque, keyword-driven filtering with a transparent, semantic, and fair evaluation standard that benefits recruiters, companies, job seekers, and students alike.**

TalentMatch AI envisions a hiring ecosystem where:
- Every candidate understands *why* they matched or didn't match a role.
- Every recruiter can trust and audit the reasoning behind a compatibility score.
- Skill gaps become a growth roadmap rather than a silent rejection.

---

## 6. Objectives

- Automate resume-to-job-description comparison using semantic AI rather than literal keyword matching.
- Extract structured, machine-readable data (skills, projects, education, certifications) from unstructured resume and JD text.
- Generate a transparent, weighted compatibility score with a documented, auditable formula.
- Identify missing or partially-met skills and quantify their impact on the overall score.
- Produce a natural-language explanation of the match suitable for direct display to a recruiter.
- Provide candidates with specific, actionable improvement suggestions grounded in the actual skill gap.
- Demonstrate a complete, working pipeline end-to-end within a 24-hour hackathon timeframe using real input data.
- Lay the architectural foundation for future multi-candidate ranking and recruiter-facing tooling.

---

## 7. Target Users

| User Segment | Description | Primary Need |
|---|---|---|
| **Recruiters / Talent Acquisition Teams** | HR professionals screening high volumes of applications for a single role | Fast, defensible, first-pass triage signal with traceable reasoning |
| **Hiring Managers** | Technical leads who need to sanity-check candidate fit | Quick, interpretable summary of skill alignment and gaps |
| **Job Seekers / Candidates** | Applicants applying to technical roles (interns, early-career engineers) | Understand fit before applying; get actionable feedback after rejection |
| **Students / Career Services** | University students and career counselors preparing applications | Personalized, JD-specific study/skill-building roadmap |
| **HR Technology Companies / ATS Vendors** | Organizations building or integrating screening tools | Semantic matching engine to augment existing keyword-based ATS |

---

## 8. User Personas

### Persona 1: Ananya — Talent Acquisition Recruiter
- **Role:** Recruiter at a mid-sized tech company
- **Goals:** Reduce time spent on first-pass resume screening; ensure no qualified candidate is missed due to wording differences
- **Frustrations:** Overwhelmed by hundreds of applications per posting; existing ATS produces false negatives on strong candidates
- **How TalentMatch AI Helps:** Provides a single, weighted, explainable compatibility score with traceability to specific skills and projects, reducing manual read-through time

### Persona 2: Suraj — Final-Year Computer Science Student
- **Role:** Job seeker applying for AI/ML internships
- **Goals:** Understand how well his resume matches a specific job posting before applying; know what to improve
- **Frustrations:** Rejections with no explanation; uncertainty about which skills to prioritize learning
- **How TalentMatch AI Helps:** Provides a transparent score plus specific, JD-grounded recommendations on skills, projects, and certifications to pursue

### Persona 3: Rahul — Engineering Hiring Manager
- **Role:** Technical lead responsible for final hiring decisions
- **Goals:** Quickly validate whether a recruiter-shortlisted candidate is technically well-suited
- **Frustrations:** Recruiter shortlists sometimes lack technical nuance; wants a second, AI-assisted technical opinion
- **How TalentMatch AI Helps:** Skill-by-skill comparison table and AI-generated explanation give a fast, technically grounded second opinion

### Persona 4: Priya — University Career Services Counselor
- **Role:** Advises students on job readiness
- **Goals:** Give students concrete, individualized guidance rather than generic resume advice
- **Frustrations:** Limited bandwidth to review every student's resume against every role they're targeting
- **How TalentMatch AI Helps:** Generates a personalized gap-analysis "study plan" per student per target role, reducing counselor workload

---

## 9. User Stories

**Recruiter**
- As a recruiter, I want to upload a candidate's resume and paste a job description so that I can receive an objective compatibility score.
- As a recruiter, I want to see which required and preferred skills are missing from a resume so that I know what to probe in an interview.
- As a recruiter, I want a plain-language explanation of the score so that I can justify my screening decision to stakeholders.
- As a recruiter, I want consistent, documented scoring weights so that different reviewers evaluate candidates against the same standard.

**Candidate**
- As a candidate, I want to see my compatibility score against a target job description so that I can gauge my fit before applying.
- As a candidate, I want to know which skills, projects, or certifications would most improve my match so that I can act on concrete next steps.
- As a candidate, I want the system to recognize equivalent skills I already have (e.g., Flask vs. FastAPI) so that I'm not penalized for reasonable wording differences.

**Hiring Manager**
- As a hiring manager, I want a skill-by-skill comparison table so that I can quickly audit the reasoning behind a compatibility score.
- As a hiring manager, I want a qualitative recommendation band (e.g., "Strong Match") so that I can quickly triage without reading a full report.

**Career Counselor**
- As a career counselor, I want to run a student's resume against multiple target job descriptions so that I can generate individualized study plans at scale.

**System Administrator**
- As a system administrator, I want resume and JD data to be handled confidentially so that personal data (email, phone) is not exposed to unauthorized parties.

---

## 10. Functional Requirements

| ID | Module | Description |
|---|---|---|
| FR-1 | Resume Upload | Accept a resume file (PDF) from the user for processing. |
| FR-2 | Resume Parsing | Extract raw text and identify sections such as Skills, Projects, Education, and Certifications. |
| FR-3 | Job Description Parsing | Extract raw text from the JD and identify required skills, preferred skills, responsibilities, and experience requirements. |
| FR-4 | Skill Extraction | Produce a normalized list of skills from both resume and JD for comparison. |
| FR-5 | Semantic Matching | Compute embedding-based similarity between resume skills/experience and JD requirements. |
| FR-6 | Candidate Evaluation | Assess the candidate across Skill, Experience, Education, Project, and Certification dimensions. |
| FR-7 | Match Score Calculation | Combine dimension-level scores into a single weighted compatibility percentage using documented weights. |
| FR-8 | Missing Skills Detection | List required or preferred JD skills absent or only partially evidenced in the resume. |
| FR-9 | Qualitative Recommendation Band | Map the final score to a qualitative band (e.g., Excellent / Strong / Moderate / Weak Match) with a suggested action. |
| FR-10 | AI Explanation Generation | Generate a recruiter-facing natural-language summary of the match. |
| FR-11 | Resume Improvement Suggestions | Generate candidate-facing recommendations (skills to learn, projects to add, certifications to pursue) to close identified gaps. |
| FR-12 | Skill-by-Skill Comparison View | Display a detailed table of each JD requirement, the matched resume skill (if any), similarity score, and match reasoning. |
| FR-13 | Data Persistence | Store parsed JSON, computed scores, and generated text for later retrieval. |

---

## 11. Non-functional Requirements

| Attribute | Requirement |
|---|---|
| **Performance** | Resume-to-JD evaluation should complete within a few seconds per candidate to support interactive use. |
| **Security** | Resume and JD content, including personal data (email, phone number), must be handled confidentially and not exposed to unauthorized parties. |
| **Scalability** | The parsing and embedding pipeline should be extendable from single-resume evaluation to batch processing of many resumes. |
| **Reliability** | The system should degrade gracefully and clearly report when expected fields (e.g., a required JD field) are absent rather than fabricating data. |
| **Usability** | Output (score, explanation, suggestions) should be presented in plain, non-technical language for both recruiters and candidates. |
| **Availability** | The web application should remain accessible and responsive for demonstration, evaluation, and (post-hackathon) production use. |
| **Explainability** | Every generated score must be traceable to specific extracted data points; no unexplained or opaque scoring outputs. |
| **Data Integrity** | The system must not fabricate resume or JD content; where a field is absent from source material, this must be explicitly stated rather than inferred. |
| **Maintainability** | Structured JSON schemas for resume and JD extraction should remain stable and versioned to support downstream integrations. |

---

## 12. MVP Scope

The MVP, as demonstrated in the 24-hour hackathon build, includes:

- Single-resume, single-job-description evaluation per run (one-to-one matching).
- PDF resume upload and text extraction.
- Pasted job description text input and parsing.
- LLM-assisted structured extraction of both resume and JD into normalized JSON schemas.
- Sentence-transformer embedding generation for skills, responsibilities, and project descriptions.
- Cosine-similarity-based semantic matching between resume and JD content.
- Weighted compatibility scoring across five evaluation categories (Skill, Experience, Education, Projects, Certification).
- Missing-skill detection, distinguishing fully missing, partially evidenced, and fully matched skills.
- Qualitative match-band mapping (e.g., Excellent / Strong / Moderate / Weak Match) with a suggested recruiter action.
- AI-generated natural-language explanation of the match.
- AI-generated, candidate-facing resume improvement suggestions (skills to learn, projects to add, certifications to pursue).
- Skill-by-skill comparison table with similarity scores and match reasoning.
- Basic data persistence of parsed results and scores.

---

## 13. Out of Scope

The following are explicitly excluded from the current (hackathon MVP) scope:

- Automated interview scheduling or direct communication with candidates.
- Bulk or batch ranking of multiple resumes against a single job description.
- Verification of claims made in the resume (e.g., confirming CGPA, certification authenticity, or reported project metrics).
- Integration with external HRMS/ATS platforms.
- Multi-language resume or job description support.
- Recruiter dashboards, filtering, or shortlist export functionality.
- Bias detection or fairness auditing of the scoring pipeline.
- User authentication, role-based access control, or multi-tenant account management.
- Mobile-native applications (web-only for MVP).

---

## 14. Success Metrics

| Metric Category | Metric | Target / Indicator |
|---|---|---|
| **Accuracy** | Alignment between AI-computed score and human-recruiter judgment on the same resume-JD pair | High qualitative agreement on match band |
| **Explainability** | Percentage of scoring decisions traceable to a specific extracted data point | 100% (no unexplained scores) |
| **Performance** | End-to-end evaluation time per resume-JD pair | Within a few seconds |
| **Adoption (post-MVP)** | Number of resume-JD evaluations run by pilot recruiters | Defined during pilot phase |
| **Candidate Value** | Percentage of candidates who report the improvement suggestions as actionable/useful | Qualitative pilot feedback |
| **Data Integrity** | Rate of fabricated or hallucinated fields in extracted JSON | 0% (strict "state absence explicitly" policy) |
| **Semantic Accuracy** | Correct identification of known semantic-equivalence cases (e.g., Flask ↔ FastAPI) in test set | High recall on curated equivalence test cases |

---

## 15. Risks

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| **LLM extraction errors** | Incorrect structured data propagates into scoring, producing an inaccurate final score | Medium | Validate extraction against known test resumes/JDs; add confidence flags for ambiguous fields |
| **Hallucinated data** | AI fabricates skills, experience, or explanations not present in source documents | Medium–High | Strict prompting to state explicit absence rather than infer; post-generation validation checks |
| **Scoring weight bias** | Fixed category weights (e.g., 50/20/15/10/5) may not generalize across all role types or industries | Medium | Document weights as a configurable, auditable design choice; plan for per-role tuning in future iterations |
| **Sensitive data exposure** | Resume PII (email, phone) mishandled or exposed | High | Enforce confidentiality controls, secure storage, and access restrictions from day one |
| **Over-reliance on AI score** | Recruiters treat the score as a final decision rather than a first-pass signal | Medium | Clearly frame output as a triage aid; retain qualitative bands with "review flagged gaps" language rather than auto-reject/accept |
| **Scalability limits** | Current single-resume pipeline may not scale efficiently to batch processing without re-architecture | Medium | Design embedding and scoring modules to be stateless and horizontally scalable from the outset |
| **Model/API dependency** | Reliance on third-party LLM and embedding APIs introduces cost, latency, and availability risk | Medium | Abstract model calls behind an internal interface to allow provider swapping |

---

## 16. Assumptions

- Users will provide resumes in PDF format and job descriptions as plain text (pasted or uploaded).
- One resume is evaluated against one job description per run in the MVP; multi-candidate ranking is a future capability.
- The scoring weights (Skill 50%, Experience 20%, Projects 15%, Education 10%, Certification 5%) represent a reasonable default for entry-level technical roles and are not yet tuned per industry or company.
- Source documents (resume and JD) are assumed to be truthful; the system does not independently verify claims.
- Users have basic digital literacy sufficient to upload files and paste text into a web application.
- The underlying LLM and embedding models have sufficient domain coverage to reasonably interpret technical resumes and job descriptions in English.
- Hackathon infrastructure (cloud LLM APIs, hosting) will remain available and stable throughout the demonstration window.

---

## 17. Future Scope

- **Multi-resume ranking:** Extend the pipeline to score and rank a batch of resumes against a single job description.
- **Recruiter dashboard:** A UI for browsing ranked candidates, filtering by skill, and exporting shortlists.
- **ATS compatibility scoring:** A separate score estimating how a resume would perform against traditional keyword-based ATS filters.
- **Interview question generation:** Auto-generate role-specific interview questions targeting identified candidate gaps.
- **Multi-language support:** Parse and evaluate resumes and job descriptions in languages beyond English.
- **Learning-to-Rank models:** Replace fixed category weights with a model trained on historical hiring outcomes.
- **Fine-tuned domain LLM:** Fine-tune the extraction/explanation model on domain-specific resume and JD data for higher extraction accuracy.
- **Cloud-native production deployment:** Containerize and deploy the system on a scalable cloud platform for production availability.
- **Bias detection and fairness auditing:** Audit the scoring pipeline for demographic or institutional bias and add fairness safeguards.
- **Retrieval-Augmented Generation (RAG):** Incorporate a company's historical hiring data to contextualize scoring and explanations.
- **HRMS/ATS integrations:** Native integrations with existing recruiting platforms to embed TalentMatch AI into existing workflows.

---

*End of Document*
