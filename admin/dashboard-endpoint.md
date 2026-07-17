# Dashboard Endpoint — API Documentation

## Overview

The Dashboard endpoint provides a consolidated summary of platform-wide metrics for the SignLens admin dashboard. It aggregates data from users, lessons, quizzes, badges, and translation logs into a single response payload.

---

## Endpoint

| Property     | Value                          |
| ------------ | ------------------------------ |
| **Method**   | `GET`                          |
| **Path**     | `/api/dashboard/summary`       |
| **Auth**     | Required — Bearer Token (JWT)  |
| **Middleware**| `requireAuth`                 |

### Base URL

```
{{BASE_URL}}/api/dashboard/summary
```

---

## Authentication

This endpoint requires a valid JWT Bearer token in the `Authorization` header.

```
Authorization: Bearer <your_jwt_token>
```

### Error Responses

| Status | Code           | Condition                                    |
| ------ | -------------- | -------------------------------------------- |
| `401`  | `UNAUTHORIZED` | Missing/invalid/expired token                |
| `403`  | `FORBIDDEN`    | User account is inactive or deactivated      |

---

## Success Response

**Status:** `200 OK`

### Envelope

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": { ... }
}
```

### `data` Schema

The `data` object contains four top-level sections:

| Key        | Type     | Description                                                |
| ---------- | -------- | ---------------------------------------------------------- |
| `stats`    | `object` | High-level KPI cards (users, lessons, badges, translations)|
| `chart`    | `array`  | Weekly app usage trend data points                         |
| `metrics`  | `object` | Translation quality breakdown and top signs                |
| `activity` | `object` | Recent user signups and live translation feed               |

---

## Response Sections

### 1. `stats` — KPI Cards

Each stat entry follows this structure:

```json
{
  "value": "string",
  "change": "string",
  "changeType": "positive" | "negative",
  "timeframe": "string"
}
```

| Stat Key             | Source Table       | Description                            |
| -------------------- | ------------------ | -------------------------------------- |
| `totalUsers`         | `users`            | Total registered user count            |
| `lessonsAndQuizzes`  | `lessons`, `quizzes`| Combined lesson / quiz count          |
| `badgesAndXp`        | `badges`           | Total badges and aggregated XP         |
| `translationsToday`  | `translationLogs`  | Translations performed today           |

#### Example

```json
{
  "stats": {
    "totalUsers": {
      "value": "1,234",
      "change": "+12%",
      "changeType": "positive",
      "timeframe": "vs last month"
    },
    "lessonsAndQuizzes": {
      "value": "45 / 30",
      "change": "+3 new",
      "changeType": "positive",
      "timeframe": "this week"
    },
    "badgesAndXp": {
      "value": "12 / 1.2k XP",
      "change": "Stable",
      "changeType": "positive",
      "timeframe": "Trophy Milestones"
    },
    "translationsToday": {
      "value": "256",
      "change": "+18.4%",
      "changeType": "positive",
      "timeframe": "vs yesterday"
    }
  }
}
```

> **Note:** `change` and `timeframe` values are currently hardcoded and not dynamically calculated.

---

### 2. `chart` — App Usage Trends

A static weekly dataset for rendering an area chart. Each data point represents one day of the week.

```json
{
  "label": "string",   // Day of the week abbreviation
  "value": "number",   // Total app usage metric
  "lessons": "number"  // Lessons-specific usage metric
}
```

#### Example

```json
{
  "chart": [
    { "label": "Mon", "value": 1200, "lessons": 320 },
    { "label": "Tue", "value": 1350, "lessons": 410 },
    { "label": "Wed", "value": 1250, "lessons": 380 },
    { "label": "Thu", "value": 1420, "lessons": 490 },
    { "label": "Fri", "value": 1580, "lessons": 610 },
    { "label": "Sat", "value": 1300, "lessons": 450 },
    { "label": "Sun", "value": 1480, "lessons": 530 }
  ]
}
```

> **Note:** This data is currently mocked/static and not queried from the database.

---

### 3. `metrics` — Translation Quality

Aggregated translation accuracy metrics sourced from the `translationLogs` table.

```json
{
  "accuracy": "number",       // Overall accuracy percentage (e.g. 94.6)
  "breakdown": {
    "successful": "number",   // Count of 'success' translations
    "lowConfidence": "number",// Count of 'warning' translations
    "failed": "number"        // Count of 'failed' translations
  },
  "topSigns": [
    {
      "word": "string",       // Predicted sign word
      "count": "number",      // Total occurrences
      "accuracy": "number"    // Average confidence (rounded integer)
    }
  ]
}
```

#### Data Sources

| Field          | Table              | Column / Condition                        |
| -------------- | ------------------ | ----------------------------------------- |
| `accuracy`     | `translationLogs`  | `resolutionStatus = 'success'` / total    |
| `breakdown`    | `translationLogs`  | Grouped by `resolutionStatus`             |
| `topSigns`     | `translationLogs`  | `GROUP BY prediction`, top 4 by count     |

#### Example

```json
{
  "metrics": {
    "accuracy": 94.6,
    "breakdown": {
      "successful": 4100,
      "lowConfidence": 189,
      "failed": 32
    },
    "topSigns": [
      { "word": "Hello", "count": 489, "accuracy": 98 },
      { "word": "Thank You", "count": 356, "accuracy": 96 },
      { "word": "Help", "count": 212, "accuracy": 91 },
      { "word": "Sign Language", "count": 184, "accuracy": 89 }
    ]
  }
}
```

> **Note:** Fallback data is returned if the database has no translation records.

---

### 4. `activity` — Recent Activity Feed

#### `recentUsers`

The 5 most recently registered users.

```json
{
  "name": "string",     // Full name (firstName + lastName)
  "email": "string",    // User email
  "time": "string",     // Relative timestamp label
  "status": "string",   // "Active User" or "Inactive"
  "detail": "string",   // Additional context
  "active": "boolean"   // Whether the user is currently active
}
```

**Source:** `users` table — ordered by `createdAt DESC`, limited to 5.

#### `liveTranslations`

The 5 most recent translation attempts.

```json
{
  "query": "string",       // Predicted sign / word
  "mode": "string",        // "Voice" or "Camera"
  "confidence": "string",  // Confidence percentage (e.g. "98.4%")
  "status": "string",      // "Success", "Warning", or "Failed"
  "alert": "string"        // Alert level: "success" or "warning"
}
```

**Source:** `translationLogs` table — ordered by `createdAt DESC`, limited to 5.

#### Example

```json
{
  "activity": {
    "recentUsers": [
      {
        "name": "Emma Thompson",
        "email": "emma@example.com",
        "time": "Recently",
        "status": "Active User",
        "detail": "Joined recently",
        "active": true
      }
    ],
    "liveTranslations": [
      {
        "query": "Hello",
        "mode": "Camera",
        "confidence": "98.4%",
        "status": "Success",
        "alert": "success"
      }
    ]
  }
}
```

> **Note:** Fallback mock data is returned when the database has no records.

---

## Error Response

**Status:** `500 Internal Server Error`

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Failed to fetch dashboard summary"
  }
}
```

In development mode (`NODE_ENV=development`), the error stack trace is included in `error.details`.

---

## Frontend Integration Guide

### cURL Example

```bash
curl -X GET {{BASE_URL}}/api/dashboard/summary \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json"
```

### JavaScript (Fetch)

```javascript
const response = await fetch('/api/dashboard/summary', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

const { success, data } = await response.json();

if (success) {
  const { stats, chart, metrics, activity } = data;
  // Render dashboard widgets...
}
```

### Axios

```javascript
import axios from 'axios';

const { data: result } = await axios.get('/api/dashboard/summary', {
  headers: { Authorization: `Bearer ${token}` },
});

const { stats, chart, metrics, activity } = result.data;
```

---

## Architecture

```
Route                     Middleware         Controller
──────────────────────    ───────────────    ─────────────────────────
GET /api/dashboard  ──►   index.route.js
    └─ /summary     ──►   requireAuth   ──► dashboard.controller.js
                                               ├─ DB: users
                                               ├─ DB: lessons
                                               ├─ DB: quizzes
                                               ├─ DB: badges
                                               └─ DB: translationLogs
```

### Related Files

| File | Description |
| ---- | ----------- |
| `src/routes/dashboard.route.js` | Route definition |
| `src/routes/index.route.js` | Route registration (`/dashboard` prefix) |
| `src/controller/dashboard.controller.js` | Business logic and DB queries |
| `src/middleware/auth.middleware.js` | JWT authentication guard |
| `src/utils/response.js` | Standardized response helpers |

---

## Known Limitations & TODOs

- [ ] **Static chart data** — The `chart` section returns hardcoded values, not real usage data.
- [ ] **Hardcoded change metrics** — `stats.*.change` and `stats.*.timeframe` are static strings.
- [ ] **Fallback mock data** — `metrics.topSigns`, `activity.recentUsers`, and `activity.liveTranslations` use fallback data when DB is empty.
- [ ] **No pagination** — Activity feeds are fixed at 5 items with no pagination support.
- [ ] **No date filtering** — No query parameters for custom date ranges.
- [ ] **No role-based access** — Endpoint requires authentication but not admin role; consider adding `requireAdmin` middleware for production.
