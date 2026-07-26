# Frontend Architecture Document
## TalentMatch AI — React Frontend

**Document Type:** Frontend Architecture Specification
**Prepared By:** Senior React Frontend Architecture
**Stack:** React · Tailwind CSS · Axios · React Router · Context API

---

## 1. Frontend Folder Structure

```
frontend/
├── public/
│   └── index.html
│
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── ui/                        # generic, reusable, presentation-only
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   ├── ProgressBar/
│   │   │   ├── Spinner/
│   │   │   ├── Modal/
│   │   │   ├── Toast/
│   │   │   ├── EmptyState/
│   │   │   └── ErrorState/
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   └── PageContainer/
│   │   │
│   │   ├── resume/
│   │   │   ├── ResumeDropzone/
│   │   │   ├── ResumeFilePreview/
│   │   │   └── ResumeUploadStatus/
│   │   │
│   │   ├── jobDescription/
│   │   │   ├── JDTextArea/
│   │   │   └── JDCharacterCounter/
│   │   │
│   │   └── report/
│   │       ├── ScoreSummaryCard/
│   │       ├── CategoryScoreBreakdown/
│   │       ├── SkillComparisonTable/
│   │       ├── MissingSkillsPanel/
│   │       ├── AIExplanationCard/
│   │       └── ImprovementSuggestions/
│   │
│   ├── pages/
│   │   ├── HomePage/
│   │   ├── UploadPage/
│   │   ├── ReportPage/
│   │   └── NotFoundPage/
│   │
│   ├── context/
│   │   ├── EvaluationContext.jsx
│   │   ├── UIContext.jsx
│   │   └── index.js
│   │
│   ├── api/
│   │   ├── axiosClient.js
│   │   ├── resume.api.js
│   │   ├── jobDescription.api.js
│   │   └── evaluation.api.js
│   │
│   ├── hooks/
│   │   ├── useResumeUpload.js
│   │   ├── useJobDescription.js
│   │   ├── useEvaluation.js
│   │   └── useAsync.js
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── tailwind.config.js
└── package.json
```

---

## 2. Component Hierarchy

```
App
 │
 ├── UIContextProvider
 │    └── EvaluationContextProvider
 │         │
 │         ├── Navbar
 │         │
 │         ├── AppRoutes
 │         │    │
 │         │    ├── HomePage
 │         │    │
 │         │    ├── UploadPage
 │         │    │    ├── ResumeDropzone
 │         │    │    │    ├── ResumeFilePreview
 │         │    │    │    └── ResumeUploadStatus
 │         │    │    ├── JDTextArea
 │         │    │    │    └── JDCharacterCounter
 │         │    │    ├── ErrorState (conditional)
 │         │    │    └── Button ("Evaluate Match")
 │         │    │
 │         │    ├── ReportPage
 │         │    │    ├── Spinner (conditional — loading)
 │         │    │    ├── ErrorState (conditional — failure)
 │         │    │    └── ReportDashboard
 │         │    │         ├── ScoreSummaryCard
 │         │    │         ├── CategoryScoreBreakdown
 │         │    │         │    └── ProgressBar (xN)
 │         │    │         ├── SkillComparisonTable
 │         │    │         │    └── Badge (Matched/Partial/Missing)
 │         │    │         ├── MissingSkillsPanel
 │         │    │         ├── AIExplanationCard
 │         │    │         └── ImprovementSuggestions
 │         │    │
 │         │    └── NotFoundPage
 │         │
 │         ├── Toast (global, portal-rendered)
 │         └── Footer
```

**Component classification:**
- **`ui/`** — Pure, stateless, prop-driven; no API or context awareness. Reused across pages.
- **`layout/`** — Structural shell components rendered once per app layout.
- **`resume/`, `jobDescription/`, `report/`** — Feature/domain components, may consume context or hooks, but delegate actual data fetching to the API layer via hooks.

---

## 3. Page Hierarchy

```
/                     → HomePage        (landing, product intro, CTA)
/upload               → UploadPage      (resume upload + JD input form)
/report/:evaluationId → ReportPage      (evaluation results dashboard)
*                     → NotFoundPage    (catch-all 404)
```

| Route | Purpose | Data Dependency |
|---|---|---|
| `/` | Marketing/landing entry point, explains the product, links to `/upload` | None |
| `/upload` | Collects resume file + JD text, triggers evaluation | None (writes to context on submit) |
| `/report/:evaluationId` | Displays full evaluation report | Reads from `EvaluationContext`; re-fetches by ID if context is empty (e.g., on refresh) |
| `*` | Fallback for unmatched routes | None |

Routing is managed centrally in **`routes/AppRoutes.jsx`**, keeping `App.jsx` free of route definitions.

---

## 4. State Management

TalentMatch AI uses a **hybrid model**: local component state for UI-only concerns, and **Context API** for cross-page, evaluation-related state. No external state library is required at this scale.

```
┌─────────────────────────────────────────────┐
│              EvaluationContext                │
│  - resumeFile                                  │
│  - jobDescriptionText                          │
│  - evaluationStatus (idle/loading/success/error)│
│  - evaluationReport (score, skills, explanation) │
│  - error                                         │
│  - actions: submitEvaluation(), resetEvaluation()│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                  UIContext                     │
│  - toastQueue                                   │
│  - activeModal                                  │
│  - actions: showToast(), openModal(), closeModal()│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│          Local Component State (useState)      │
│  - form field values before submission          │
│  - dropzone drag-over visual state               │
│  - input focus/blur states                       │
└─────────────────────────────────────────────┘
```

**State ownership principle:**
- **Context** holds state that must survive navigation (e.g., moving from `/upload` to `/report/:id`).
- **Local state** holds transient, component-scoped UI state that resets naturally on unmount.
- **Custom hooks** (`useResumeUpload`, `useEvaluation`) encapsulate the logic that mutates context state, keeping components declarative.

---

## 5. API Layer

```
components / pages
        │
        v
  custom hooks (useEvaluation, useResumeUpload)
        │
        v
  api/ layer (resume.api.js, jobDescription.api.js, evaluation.api.js)
        │
        v
  axiosClient.js (single configured Axios instance)
        │
        v
  Backend (Express API)
```

- **`axiosClient.js`** — Single Axios instance with `baseURL` (from env), default headers, request/response interceptors (auth headers if added later, global error normalization, request timing).
- **`resume.api.js`** — `uploadResume(file)` → posts multipart form data.
- **`jobDescription.api.js`** — `submitJobDescription(text)`.
- **`evaluation.api.js`** — `runEvaluation(payload)`, `getEvaluationById(id)`.
- Components and pages **never call Axios directly** — all calls go through the `api/` layer, invoked from hooks.
- Response/error normalization happens once, in the Axios interceptor, so every hook receives a consistent shape (`{ data, error }`).

---

## 6. Reusable UI Components

| Component | Purpose |
|---|---|
| **Button** | Standardized primary/secondary/disabled/loading button variants |
| **Card** | Generic container with consistent padding/shadow/radius for report sections |
| **Badge** | Small status label (Matched / Partial / Missing / Strong Match, etc.) |
| **ProgressBar** | Visualizes category and overall score percentages |
| **Spinner** | Loading indicator used during async operations |
| **Modal** | Generic overlay dialog (e.g., confirm re-upload) |
| **Toast** | Transient success/error notifications, driven by `UIContext` |
| **EmptyState** | Placeholder shown before any evaluation has been run |
| **ErrorState** | Standardized error display with retry action |

These live under `components/ui/` and accept only props — no direct API calls, no context subscriptions — to remain fully reusable and easily unit-testable.

---

## 7. Loading States

```
UploadPage
   │  user clicks "Evaluate Match"
   v
evaluationStatus = 'loading'
   │
   ├── UploadPage: Button switches to disabled/spinner state
   ├── Navigation to /report/:pendingId (optimistic route)
   v
ReportPage
   │  evaluationStatus === 'loading'
   v
   Renders: Spinner + "Analyzing resume against job description..."
   │
   v
   (on success) evaluationStatus = 'success' → ReportDashboard renders
   (on failure) evaluationStatus = 'error'   → ErrorState renders
```

- Loading state is centralized in `EvaluationContext` so both `UploadPage` (button state) and `ReportPage` (full-page loader) can react to the same status without prop drilling.
- Skeleton loaders may be used within `ReportDashboard` subsections if partial data streams in (future enhancement); MVP uses a single full-page loader.

---

## 8. Error States

| Error Source | Handling |
|---|---|
| **File validation** (wrong type, too large) | Inline error under `ResumeDropzone`, submission blocked |
| **JD validation** (too short/empty) | Inline error under `JDTextArea`, submission blocked |
| **Network/API failure** | `evaluationStatus = 'error'`; `ReportPage` renders `ErrorState` with retry button |
| **Backend validation error (400)** | Toast notification with the specific field-level message returned by the API |
| **Server error (500)** | Generic `ErrorState` with a safe, non-technical message and a "Try Again" action |
| **Route-level not found** | `NotFoundPage` for unmatched paths; `ErrorState` within `ReportPage` for a valid path with an invalid/expired `evaluationId` |

All API errors are normalized in the Axios interceptor into a consistent `{ status, message, fieldErrors }` shape before reaching components, so `ErrorState` and toast components don't need to branch on raw Axios error internals.

---

## 9. Form Validation

Validation occurs in **two layers**, both client-side (backend remains the source of truth):

1. **Inline field-level validation** (`utils/validators.js`), triggered on blur/change:
   - Resume: file present, MIME type is PDF, size under configured limit.
   - Job Description: non-empty, minimum character threshold.
2. **Submit-time validation gate:** the "Evaluate Match" button remains disabled (or triggers a blocking inline error) until both fields pass validation — preventing an avoidable round-trip to the backend.

```
User Input
   │
   v
onChange/onBlur → validators.js → field-level error state (local)
   │
   v
Submit clicked
   │
   v
Final validation pass → if invalid: show ErrorState, block submit
                       → if valid:   call useEvaluation().submitEvaluation()
```

Validation logic is centralized in `utils/validators.js` so both `ResumeDropzone` and `JDTextArea` (and any future form) share identical rules rather than duplicating them.

---

## 10. File Upload Flow

```
ResumeDropzone (drag/drop or click-to-browse)
        │
        v
Client-side validation (type, size) — utils/validators.js
        │
        ├── invalid → ResumeUploadStatus shows error, stops here
        v
   valid file staged in local state → preview via ResumeFilePreview
        │
        v
User clicks "Evaluate Match"
        │
        v
useResumeUpload hook → resume.api.js → axiosClient
        │  (multipart/form-data POST)
        v
Backend processes file (Express/Multer/pdf-parse/Gemini)
        │
        v
EvaluationContext updated with resumeFile status + returned resumeId
        │
        v
Proceeds to evaluation trigger (Section 12)
```

- File is held in memory/local state only until submission; no premature upload on file selection (upload is bundled with the evaluation submission call to avoid orphaned uploads).
- `ResumeUploadStatus` reflects idle → uploading → success/error, driven by the hook's async state.

---

## 11. Result Dashboard Flow

```
ReportPage mounts (evaluationId from route params)
        │
        v
useEvaluation hook checks EvaluationContext
        │
        ├── report already in context (same session) → render immediately
        │
        └── context empty (e.g., page refresh)
                 │
                 v
        evaluation.api.js → getEvaluationById(evaluationId)
                 │
                 v
        evaluationStatus: loading → success/error
        │
        v
ReportDashboard renders, composed of:
        │
        ├── ScoreSummaryCard          → overall %, match band, badge color
        ├── CategoryScoreBreakdown    → per-category progress bars
        ├── SkillComparisonTable      → required/preferred vs. matched, similarity, badge
        ├── MissingSkillsPanel        → grouped fully-missing vs. partially-evidenced
        ├── AIExplanationCard         → recruiter-facing narrative
        └── ImprovementSuggestions    → skills/projects/certifications to pursue
```

Each dashboard subcomponent receives its slice of the report via props from `ReportDashboard`, not via independent context reads — keeping data flow unidirectional and the dashboard easy to reason about or snapshot-test.

---

## 12. API Communication

```
┌───────────────────────────────────────────────────────┐
│                     Axios Client                         │
│  baseURL: process.env.VITE_API_BASE_URL                    │
│  timeout: configured global timeout                          │
│  interceptors:                                                  │
│    request  → attach headers, start request timer                │
│    response → normalize success payload                            │
│    error    → normalize error shape, map status → message           │
└───────────────────────────────────────────────────────┘

Endpoints consumed:
  POST /api/resume            → resume.api.js
  POST /api/job-description   → jobDescription.api.js
  POST /api/evaluate          → evaluation.api.js
  GET  /api/evaluate/:id      → evaluation.api.js
```

- Base URL and any public config values are environment-driven (`.env`), never hardcoded.
- All request/response typing (expected report shape) is documented alongside `api/evaluation.api.js` so hooks and components can rely on a stable contract with the backend.

---

## 13. Future Scalability

- **State library migration path:** if cross-cutting state grows beyond evaluation + UI concerns (e.g., auth, multi-candidate ranking, saved history), Context API can be replaced or supplemented with a dedicated state library (e.g., Zustand/Redux Toolkit) without restructuring the component tree, since components already consume state via hooks rather than `useContext` directly.
- **Multi-resume ranking UI:** the `ReportDashboard` component structure extends naturally to a `RankingDashboard` that renders a list of `ScoreSummaryCard`s, reusing existing report subcomponents.
- **Authentication:** an `AuthContext` and protected-route wrapper can be added to `routes/AppRoutes.jsx` without disrupting existing page structure.
- **Design system growth:** `components/ui/` is structured to become a standalone, versioned internal component library if the product expands (e.g., recruiter dashboard, admin panel).
- **Code splitting:** route-level lazy loading (`React.lazy` + `Suspense`) can be introduced per page as the bundle grows, especially for `ReportPage`'s heavier visualization components.
- **API layer resilience:** the centralized `axiosClient` interceptor pattern makes it straightforward to add retry logic, request caching, or offline queuing later without touching individual components.
- **Internationalization:** because all user-facing copy is rendered through components rather than inlined ad hoc, an i18n library can be layered in without major refactors.

---

*End of Document*
