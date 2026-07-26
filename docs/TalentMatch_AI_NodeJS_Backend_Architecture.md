# Backend Architecture Document
## TalentMatch AI — Node.js / Express Backend

**Document Type:** Backend Architecture Specification
**Prepared By:** Senior Node.js Backend Architecture
**Stack:** Node.js · Express.js · ES Modules · Multer · dotenv · Gemini API · pdf-parse · Helmet · Morgan · CORS

---

## 1. Backend Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.config.js
│   │   ├── cors.config.js
│   │   └── constants.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── resume.routes.js
│   │   ├── jobDescription.routes.js
│   │   └── evaluation.routes.js
│   │
│   ├── controllers/
│   │   ├── resume.controller.js
│   │   ├── jobDescription.controller.js
│   │   └── evaluation.controller.js
│   │
│   ├── services/
│   │   ├── resumeParser.service.js
│   │   ├── jdParser.service.js
│   │   ├── geminiClient.service.js
│   │   ├── embeddingSimilarity.service.js
│   │   ├── scoring.service.js
│   │   └── explanation.service.js
│   │
│   ├── middlewares/
│   │   ├── upload.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   ├── notFound.middleware.js
│   │   ├── requestLogger.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── validators/
│   │   ├── resume.validator.js
│   │   ├── jobDescription.validator.js
│   │   └── evaluation.validator.js
│   │
│   ├── utils/
│   │   ├── asyncHandler.util.js
│   │   ├── ApiError.util.js
│   │   ├── ApiResponse.util.js
│   │   ├── logger.util.js
│   │   └── fileCleanup.util.js
│   │
│   ├── schemas/
│   │   ├── resumeSchema.js
│   │   └── jdSchema.js
│   │
│   ├── app.js
│   └── server.js
│
├── uploads/               # temp storage for Multer (gitignored)
├── logs/                  # Morgan / app log output
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## 2. Responsibilities of Every Folder

| Folder | Responsibility |
|---|---|
| **config/** | Centralizes environment loading, CORS policy, and shared constants — no business logic |
| **routes/** | Defines URL paths and maps them to controllers; no logic beyond wiring |
| **controllers/** | Handles HTTP request/response cycle; delegates work to services; contains no business/AI logic |
| **services/** | Contains all business logic — parsing, AI calls, scoring, similarity computation |
| **middlewares/** | Cross-cutting request-processing logic: uploads, validation, logging, error handling |
| **validators/** | Defines input validation rules per route, consumed by the validation middleware |
| **utils/** | Reusable, stateless helpers: error classes, response formatting, async wrapping, logging setup |
| **schemas/** | Defines the expected structured JSON shape for Resume/JD extraction output |
| **uploads/** | Ephemeral storage for incoming PDF files before/after processing |
| **logs/** | Persisted request and application logs |

---

## 3. Responsibilities of Every File

### config/
- **env.config.js** — Loads and validates `.env` variables via dotenv; exports a single typed config object.
- **cors.config.js** — Defines allowed origins, methods, and headers for the CORS middleware.
- **constants.js** — Shared constants (file size limits, allowed MIME types, scoring weights).

### routes/
- **index.js** — Aggregates and mounts all route modules onto the Express app.
- **resume.routes.js** — Routes for resume upload and parsing.
- **jobDescription.routes.js** — Routes for JD submission and parsing.
- **evaluation.routes.js** — Routes for triggering the full resume-JD evaluation pipeline.

### controllers/
- **resume.controller.js** — Receives uploaded resume, invokes parsing service, returns Resume JSON.
- **jobDescription.controller.js** — Receives JD text, invokes JD parsing service, returns JD JSON.
- **evaluation.controller.js** — Orchestrates the full pipeline call and returns the final report.

### services/
- **resumeParser.service.js** — Extracts raw text via pdf-parse, then structures it via Gemini.
- **jdParser.service.js** — Structures raw JD text into normalized JSON via Gemini.
- **geminiClient.service.js** — Single, reusable wrapper around all Gemini API calls (prompting, retries, response parsing).
- **embeddingSimilarity.service.js** — Generates/consumes embeddings and computes similarity scores.
- **scoring.service.js** — Aggregates similarity scores into category and final weighted scores.
- **explanation.service.js** — Generates recruiter-facing explanation and candidate-facing suggestions via Gemini.

### middlewares/
- **upload.middleware.js** — Configures Multer (storage location, file size limit, MIME-type filter).
- **errorHandler.middleware.js** — Centralized error-to-response translator; final middleware in the chain.
- **notFound.middleware.js** — Catches unmatched routes and forwards a 404 `ApiError`.
- **requestLogger.middleware.js** — Wraps Morgan with a custom format piped to the logger.
- **validate.middleware.js** — Executes a given validator schema against `req.body`/`req.file` and forwards errors.

### validators/
- **resume.validator.js** — Ensures uploaded file exists, is a PDF, and is within size limits.
- **jobDescription.validator.js** — Ensures JD text is present and meets minimum length.
- **evaluation.validator.js** — Ensures both resume and JD identifiers/payloads are present before pipeline execution.

### utils/
- **asyncHandler.util.js** — Wraps async controller functions to forward rejected promises to error middleware.
- **ApiError.util.js** — Custom error class carrying HTTP status, message, and optional details.
- **ApiResponse.util.js** — Standardized success-response formatter (status, data, message).
- **logger.util.js** — Configures the application-wide logger (console + file transport).
- **fileCleanup.util.js** — Deletes temporary uploaded files after processing completes or fails.

### Root
- **app.js** — Constructs the Express app: applies Helmet, CORS, Morgan, JSON parsing, routes, and error middleware.
- **server.js** — Loads config, starts the HTTP server, handles graceful shutdown.

---

## 4. Request Lifecycle

```
Client Request
      │
      v
┌─────────────────┐
│   Helmet         │  → sets secure HTTP headers
└────────┬─────────┘
         v
┌─────────────────┐
│   CORS           │  → validates request origin
└────────┬─────────┘
         v
┌─────────────────┐
│   Morgan         │  → logs incoming request
└────────┬─────────┘
         v
┌─────────────────┐
│  Body/JSON Parser│  → parses request body
└────────┬─────────┘
         v
┌─────────────────┐
│  Multer (if      │  → parses multipart/form-data,
│  file route)     │     saves file to /uploads
└────────┬─────────┘
         v
┌─────────────────┐
│  Route Matching  │  → maps URL + method to controller
└────────┬─────────┘
         v
┌─────────────────┐
│  Validation      │  → validates payload/file against schema
│  Middleware      │
└────────┬─────────┘
         v
┌─────────────────┐
│   Controller     │  → orchestrates service calls
└────────┬─────────┘
         v
┌─────────────────┐
│    Service(s)    │  → business logic, Gemini calls, scoring
└────────┬─────────┘
         v
┌─────────────────┐
│  ApiResponse     │  → formats success payload
└────────┬─────────┘
         v
┌─────────────────┐
│  Client Response │
└──────────────────┘

         (at any stage)
              │
              v
     ┌──────────────────┐
     │  errorHandler      │  → catches thrown/forwarded errors,
     │  middleware         │     formats standardized error response
     └──────────────────┘
```

---

## 5. Middleware Flow

```
app.js
  │
  ├── helmet()                     → security headers
  ├── cors(corsConfig)             → origin control
  ├── morgan('combined')           → request logging
  ├── express.json()               → JSON body parsing
  ├── express.urlencoded()         → form body parsing
  │
  ├── /api/resume
  │     └── upload.middleware      → Multer file intake
  │     └── validate.middleware    → resume.validator
  │     └── resume.routes → controller
  │
  ├── /api/job-description
  │     └── validate.middleware    → jobDescription.validator
  │     └── jobDescription.routes → controller
  │
  ├── /api/evaluate
  │     └── validate.middleware    → evaluation.validator
  │     └── evaluation.routes → controller
  │
  ├── notFound.middleware          → unmatched routes → 404
  └── errorHandler.middleware      → final error formatter
```

**Ordering principle:** Global security/logging middleware first → body/file parsing → route-specific validation → controller → error handlers last (Express requires error-handling middleware to be registered after all routes).

---

## 6. Controller → Service → Utility Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Controller   │ ───> │   Service     │ ───> │   Utility     │
│               │      │               │      │               │
│ - Parses req  │      │ - Business    │      │ - Stateless   │
│ - Calls       │      │   logic       │      │   helpers     │
│   service(s)  │      │ - Gemini /    │      │ - ApiError    │
│ - Formats     │      │   pdf-parse   │      │ - ApiResponse │
│   ApiResponse │      │   calls       │      │ - Logger      │
│ - No business │      │ - Returns     │      │               │
│   logic       │      │   plain data  │      │               │
└──────────────┘      └──────────────┘      └──────────────┘
```

**Rules of separation:**
- **Controllers** never call Gemini, pdf-parse, or perform scoring math directly — they only call services.
- **Services** never touch `req`/`res` — they accept plain arguments and return plain data or throw `ApiError`.
- **Utilities** are pure, stateless, and reusable across services and controllers.
- Each service owns a single responsibility (parsing, similarity, scoring, explanation) to keep the pipeline composable and testable in isolation.

---

## 7. Error Handling Strategy

- **Custom `ApiError` class** carries `statusCode`, `message`, and optional `details`; thrown from services/controllers instead of raw `Error` objects.
- **`asyncHandler` wrapper** eliminates repetitive try/catch in controllers by forwarding rejected promises to `next(error)`.
- **Centralized `errorHandler` middleware** (registered last) is the single place that:
  - Distinguishes operational errors (`ApiError`) from programming errors (unexpected exceptions).
  - Formats a consistent JSON error response: `{ success: false, message, details }`.
  - Logs the full stack trace via the logger utility (never exposed to the client in production).
- **Gemini/pdf-parse failures** are caught at the service layer and re-thrown as `ApiError` with a descriptive, user-safe message (e.g., "Failed to parse resume — file may be corrupted or unsupported").
- **Uncaught exceptions / unhandled rejections** are caught at the process level in `server.js` to log and gracefully shut down rather than crash silently.

---

## 8. Validation Strategy

- Validation is isolated into a `validators/` folder — one schema per route/resource — kept separate from controllers.
- A single `validate.middleware.js` executes the relevant schema and short-circuits the request with a `400 ApiError` on failure, before any controller or service code runs.
- **Resume validation:** file presence, MIME type (`application/pdf`), and file size ceiling (enforced twice — once by Multer's file filter, once by the validator for defense-in-depth).
- **JD validation:** text presence, minimum/maximum length, and basic sanitization against injection into downstream prompts.
- **Evaluation validation:** confirms both resume and JD references/payloads exist before the pipeline is triggered, avoiding wasted Gemini calls on incomplete input.
- Validation failures return structured, field-level error messages to support frontend form feedback.

---

## 9. Logging Strategy

- **Morgan** handles HTTP access logging (method, URL, status, response time) in `combined` format, piped through the custom logger rather than directly to stdout.
- **logger.util.js** provides a single logging interface with severity levels (`info`, `warn`, `error`, `debug`), writing to console in development and to `logs/` (rotated) in production.
- **Structured logging:** each log entry includes a timestamp, request ID (where applicable), and module origin (e.g., `[geminiClient]`, `[resumeParser]`) to aid debugging across the async pipeline.
- **Sensitive-data redaction:** resume PII (email, phone) is never logged in full; logs reference resource IDs, not raw content.
- **AI call logging:** Gemini request/response metadata (latency, token usage, success/failure) is logged separately to support cost and performance monitoring.

---

## 10. Environment Configuration

- **dotenv** loads variables from `.env` at startup via `config/env.config.js`, which validates presence of required keys and exports a single frozen config object — no raw `process.env` access elsewhere in the codebase.
- **`.env.example`** is committed to document required variables without exposing secrets:
  - `PORT`
  - `NODE_ENV`
  - `GEMINI_API_KEY`
  - `CORS_ORIGIN`
  - `MAX_UPLOAD_SIZE_MB`
  - `LOG_LEVEL`
- **Environment-specific behavior:** `NODE_ENV` gates verbose error responses (development) vs. sanitized error responses (production), and controls logger verbosity/transport.
- Secrets are never committed; `.env` is gitignored.

---

## 11. File Upload Workflow

```
Client (multipart/form-data)
        │
        v
┌─────────────────────┐
│  upload.middleware    │
│  (Multer)              │
│  - disk storage         │
│  - MIME filter (PDF)    │
│  - size limit            │
└──────────┬───────────┘
           v
┌─────────────────────┐
│  validate.middleware  │  → double-checks file metadata
└──────────┬───────────┘
           v
┌─────────────────────┐
│  resume.controller     │  → passes file path to service
└──────────┬───────────┘
           v
┌─────────────────────┐
│  resumeParser.service  │
│  - pdf-parse: raw text  │
│  - Gemini: structure it │
└──────────┬───────────┘
           v
┌─────────────────────┐
│  fileCleanup.util      │  → deletes temp file from /uploads
│  (success or failure)   │     regardless of outcome
└──────────┬───────────┘
           v
      Resume JSON returned to client
```

**Key principle:** Uploaded files are treated as transient — parsed immediately and deleted afterward; only the extracted structured JSON is persisted, never the raw file.

---

## 12. AI Service Workflow

```
resumeParser.service / jdParser.service
        │
        v
┌─────────────────────────┐
│  geminiClient.service     │
│  - builds structured        │
│    extraction prompt         │
│  - calls Gemini API           │
│  - parses/validates JSON       │
│    response against schema      │
│  - retries on transient failure  │
└────────────┬─────────────┘
             v
      Resume JSON / JD JSON
             │
             v
┌─────────────────────────┐
│  embeddingSimilarity.service│
│  - computes similarity        │
│    per skill/requirement        │
└────────────┬─────────────┘
             v
┌─────────────────────────┐
│  scoring.service            │
│  - aggregates category scores  │
│  - computes final weighted     │
│    percentage                   │
└────────────┬─────────────┘
             v
┌─────────────────────────┐
│  explanation.service        │
│  - geminiClient call with     │
│    JSON + scores as context     │
│  - generates explanation +      │
│    suggestions                   │
└────────────┬─────────────┘
             v
      Final Evaluation Report
```

**Design constraints:**
- All Gemini calls are routed through the single `geminiClient.service` — no direct SDK calls elsewhere — to centralize prompt versioning, retry logic, and error handling.
- The explanation/suggestion stage only receives structured JSON and computed scores, never raw resume/JD text, keeping generated narrative grounded and auditable.
- Schema validation (`schemas/`) is applied to every Gemini JSON response before it proceeds down the pipeline; malformed responses trigger a bounded retry, then a controlled `ApiError`.

---

## 13. Best Practices

- **Strict layering:** routes → controllers → services → utils; no layer reaches "backward" or skips a layer.
- **ES Modules throughout** (`import`/`export`), with a consistent `type: "module"` configuration.
- **Single Gemini client** to avoid duplicated API configuration and inconsistent prompt handling.
- **Fail fast on config:** the app should refuse to start if required environment variables are missing.
- **Idempotent file handling:** every upload path guarantees cleanup (success or failure) via `finally`-style cleanup logic.
- **Consistent response envelope:** all success responses use `ApiResponse`; all errors use `ApiError` — no ad hoc `res.json()` calls in controllers.
- **No business logic in controllers or routes** — keeps the HTTP layer thin and the logic layer independently testable.
- **Defense-in-depth validation:** both Multer-level and validator-level checks on uploads.
- **Least-privilege CORS:** explicit origin allow-list rather than a wildcard, even during the hackathon.
- **Helmet by default:** secure headers applied unconditionally, not just in production.

---

## 14. Future Scalability

- **Queue-based processing:** introduce a job queue (e.g., BullMQ/Redis) between upload and AI processing to support batch resume evaluation without blocking the request thread.
- **Horizontal scaling:** since services are stateless and files are transient, additional API instances can be added behind a load balancer without shared-state concerns.
- **Caching layer:** cache Gemini responses for identical/near-identical JD text to reduce redundant API calls and cost.
- **Rate limiting & throttling:** add middleware (e.g., `express-rate-limit`) to protect the Gemini integration from abuse as usage grows.
- **Database layer:** introduce a persistence service (MongoDB/PostgreSQL) behind a repository pattern to store evaluation history, enabling future ranking and analytics features.
- **Microservice extraction:** the AI pipeline (parsing, embedding, scoring, explanation) can be extracted into an independent service if load or team structure warrants it, communicating with the API layer over an internal contract.
- **Observability:** integrate structured logging with a centralized log aggregator and add request tracing (correlation IDs) as the system grows beyond a single-instance hackathon deployment.
- **API versioning:** introduce `/api/v1/` prefixing early to avoid breaking changes as the contract evolves.

---

*End of Document*
