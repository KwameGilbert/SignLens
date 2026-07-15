# API Payload Specifications

This document outlines the JSON payload structures required by the admin dashboard. The backend team should expose these endpoints so the frontend can display dynamic data instead of the currently hardcoded information.

---

## 1. Dashboard Summary
**Endpoint:** `GET /api/dashboard/summary`

### Overall Structure

```json
{
  "success": true,
  "data": {
    "stats": { ... },
    "activity": {
      "recentUsers": [ ... ],
      "liveTranslations": [ ... ]
    },
    "chart": [ ... ],
    "metrics": { ... }
  }
}
```

### Detailed Breakdown

#### Stats Object (`data.stats`)
Provides the top-level KPI metrics for the cards at the top of the dashboard.

```json
"stats": {
  "totalUsers": {
    "value": "12,345",
    "change": "+12%",
    "changeType": "positive",
    "timeframe": "vs last month"
  },
  "lessonsAndQuizzes": {
    "value": "84 / 15",
    "change": "+3 new",
    "changeType": "positive",
    "timeframe": "this week"
  },
  "badgesAndXp": {
    "value": "6 / 1.2k XP",
    "change": "Stable",
    "changeType": "positive",
    "timeframe": "Trophy Milestones"
  },
  "translationsToday": {
    "value": "4,321",
    "change": "+18.4%",
    "changeType": "positive",
    "timeframe": "vs yesterday"
  }
}
```
*Note: `changeType` must be either `"positive"` or `"negative"`.*

#### Chart Array (`data.chart`)
Data for the "App Usage Trends" area chart (Daily Active Users & Lesson Progress). 

```json
"chart": [
  { "label": "Mon", "value": 1200, "lessons": 320 },
  { "label": "Tue", "value": 1350, "lessons": 410 },
  { "label": "Wed", "value": 1250, "lessons": 380 },
  { "label": "Thu", "value": 1420, "lessons": 490 },
  { "label": "Fri", "value": 1580, "lessons": 610 },
  { "label": "Sat", "value": 1300, "lessons": 450 },
  { "label": "Sun", "value": 1480, "lessons": 530 }
]
```

#### Metrics Object (`data.metrics`)
Drives the "Translation Quality" radial meter, breakdown, and top words list.

```json
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
```

#### Activity Object (`data.activity`)
Provides data for the recent users and live translations feeds at the bottom of the dashboard.

```json
"activity": {
  "recentUsers": [
    { 
      "name": "Emma Thompson", 
      "email": "emma@example.com", 
      "time": "2 hours ago", 
      "status": "New Sign up", 
      "detail": "Joined via Google Auth", 
      "active": true 
    },
    { 
      "name": "James Wilson", 
      "email": "james.w@example.com", 
      "time": "4 hours ago", 
      "status": "Completed Lesson 1", 
      "detail": "Alphabet Basics Quiz", 
      "active": false 
    }
  ],
  "liveTranslations": [
    { 
      "query": "Hello", 
      "mode": "Camera", 
      "confidence": "98.4%", 
      "status": "Success", 
      "alert": "success" 
    },
    { 
      "query": "Wait", 
      "mode": "Camera", 
      "confidence": "71.3%", 
      "status": "Warning", 
      "alert": "warning" 
    }
  ]
}
```
*Note for `liveTranslations`: `mode` should be "Camera" or "Voice". `alert` should be "success" or "warning". The frontend will map these fields to the correct icons and theme colors automatically.*

---

## 2. Auth Profile
**Endpoint:** `GET /api/auth/profile`

This endpoint returns the profile details of the currently authenticated admin user, which populates the Profile settings page and the main user context.

### Expected Payload

```json
{
  "success": true,
  "data": {
    "name": "Kwame Gilbert",
    "email": "kwame@signlens.com",
    "phone": "+233 24 123 4567",
    "role": "Super Admin",
    "clearanceLevel": "Level 3 Clearance",
    "preferences": {
      "emailDigest": true,
      "systemAlarms": true,
      "autoSync": false
    }
  }
}
```
*Note: The `preferences` object corresponds to the notification and background trigger toggles in the Profile settings.*
