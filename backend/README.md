# TalentMatch AI — Node.js Backend

Production-ready backend API service for **TalentMatch AI** built with Node.js, Express.js, and ES Modules following Clean Architecture principles.

---

## 🚀 Features

- **ES Modules**: Modern JavaScript `import`/`export` syntax (`type: "module"`).
- **Security First**: Configured with `helmet` and custom `CORS` whitelist protection.
- **Robust Error Handling**: Centralized operational `ApiError` class, `asyncHandler` wrapper, and global error middleware.
- **Logging & Telemetry**: Combined Morgan access logging and application file streaming logger (`logs/`).
- **File Uploads**: Ephemeral `multer` disk storage with strict PDF MIME-type verification and auto-cleanup.
- **Validation**: Strict schema-based input validation powered by `express-validator`.
- **API Versioning**: Scalable route design mounted under `/api/v1/`.

---

## 🛠️ Requirements & Installation

1. **Node.js**: `v18.0.0` or higher
2. **Install Dependencies**:

```bash
cd backend
npm install
```

3. **Configure Environment Variables**:
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

---

## 🚦 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/` | Root API status endpoint |
| **GET** | `/api/v1/health` | System health, uptime & environment telemetry |
| **POST** | `/api/v1/resume/upload` | Multipart upload resume PDF (5MB max) and return file metadata |
| **POST** | `/api/v1/resume/extract-text` | Multipart upload resume PDF and extract clean readable text |
| **POST** | `/api/v1/resume/parse` | Multipart upload and parse resume PDF |
| **POST** | `/api/v1/job-description/parse` | Parse raw Job Description text |
| **POST** | `/api/v1/evaluation/process` | Trigger full Resume-JD evaluation pipeline |

---

## 🏗️ Architecture Layering

```
Routes -> Middlewares -> Validators -> Controllers -> Services -> Response / Error Utils
```

- **Routes**: Wiring endpoints to controllers.
- **Middlewares**: Helmet, CORS, Morgan, Multer, validator output processor, 404, Error handling.
- **Validators**: `express-validator` rules per resource.
- **Controllers**: Thin HTTP request/response orchestrators (no direct business logic).
- **Services**: Pure business logic (parsing, Gemini integration, similarity calculation, scoring).
- **Utils**: Stateless helpers (`ApiError`, `ApiResponse`, `asyncHandler`, `logger`, `fileCleanup`).
