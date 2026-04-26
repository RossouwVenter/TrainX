# API Contracts

Base URL: `http://localhost:3000/api/v1`

## Auth / Users

### GET /auth/athletes
List all athletes (public, no auth required). Used by the role picker.

**Response 200:**
```json
[{ "id": "...", "name": "James Wilson", "email": "athlete1@trainx.com", "role": "ATHLETE" }]
```

### GET /auth/coach
Get the default coach profile (public). Used by the role picker.

**Response 200:**
```json
{ "id": "...", "name": "Sarah Miller", "email": "coach@trainx.com", "role": "COACH" }
```

## Sessions

### GET /sessions?athleteId=:id&weekOf=:date
Get sessions for an athlete for a specific week. Returns `WeekSchedule`.

**Query Params:**
- `athleteId` (required) — athlete user ID
- `weekOf` (optional) — ISO date string, defaults to current week

**Response 200:** `WeekSchedule` object

### POST /sessions
Create a new training session. Coach only.

**Body:**
```json
{
  "title": "Morning Swim",
  "description": "Focus on technique drills",
  "discipline": "SWIM",
  "date": "2026-04-27",
  "duration": 60,
  "athleteId": "...",
  "coachId": "..."
}
```

### PUT /sessions/:id
Update a session.

### DELETE /sessions/:id
Delete a session.

### PUT /sessions/:id/status
Update session status (athlete marks complete/skipped).

**Body:**
```json
{ "status": "COMPLETED" }
```

## Feedback

### POST /feedback
Submit feedback for a session. Athlete only.

**Body:**
```json
{
  "sessionId": "...",
  "athleteId": "...",
  "rpe": 7,
  "notes": "Felt strong on the intervals",
  "completed": true
}
```

### GET /feedback/:sessionId
Get feedback for a specific session.

## Athletes (Coach view)

### GET /athletes
List all athletes with summary stats. Coach only.

**Response 200:**
```json
[{
  "id": "...",
  "name": "James Wilson",
  "email": "athlete1@trainx.com",
  "sessionsThisWeek": 5,
  "completionRate": 80
}]
```

### GET /athletes/:id
Get detailed athlete profile.

## AI Agent

### POST /agent/plan-week
Generate a week of training sessions using AI.

**Body:**
```json
{
  "athleteId": "...",
  "coachId": "...",
  "weekOf": "2026-04-27",
  "instructions": "Focus on swim technique, 3 bike sessions, 2 runs, 1 rest day"
}
```

**Response 200:**
```json
{
  "sessions": [
    { "title": "...", "discipline": "SWIM", "date": "...", "duration": 60, "description": "..." }
  ]
}
```

## Error Response Format

```json
{
  "error": "Human-readable message",
  "details": []  // Optional validation details
}
```

All endpoints return appropriate HTTP status codes (200, 201, 400, 404, 500).
