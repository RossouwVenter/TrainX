---
name: ventri
description: "Build the Ventri coaching platform. Use when: creating the training app, building coach/athlete features, implementing weekly programs, session management, athlete feedback, schedule views, or any Ventri development task."
argument-hint: "Describe what you want to build or change in the Ventri app"
---

# Ventri — Coach & Athlete Training Platform

## Overview

Ventri is a modern training management platform where coaches create and upload weekly training programs for individual athletes, and athletes provide structured feedback on completed sessions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile/Web | React Native + Expo SDK 54 (Router v6, Metro bundler) |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| AI | Swappable LLM layer (OpenAI default) |
| Auth | Role-based (no login — role picker at launch) |

## Architecture

```
Ventri/
├── server/                  # Express API
│   ├── prisma/              # Schema + migrations + seed
│   └── src/
│       ├── controllers/     # Route handlers
│       ├── middleware/       # Auth, validation, error handling
│       ├── routes/          # API route definitions
│       ├── services/        # Business logic
│       │   └── llm/         # Swappable LLM provider layer
│       └── utils/           # Helpers
├── mobile/                  # Expo app (iOS, Android, Web)
│   ├── app/                 # Expo Router file-based routes
│   │   ├── index.tsx        # Role picker landing page
│   │   └── (tabs)/          # Tab navigation (schedule, athletes, profile)
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # React context (auth/role state)
│       ├── hooks/           # Custom hooks
│       ├── services/        # API client layer
│       ├── styles/          # Design tokens
│       ├── types/           # TypeScript types
│       └── utils/           # Cross-platform helpers
└── .github/                 # Skills + agents
```

## Key Features

1. **Role Picker** — No login screen. Landing page shows Coach and Athlete cards. Coach enters immediately. Athlete shows a list of athletes to pick from.
2. **Weekly Programs** — Coach uploads/creates weekly training sessions per athlete with discipline, description, duration, date, and status.
3. **Session Feedback** — Athletes submit structured feedback (RPE, notes, completion status) on each session.
4. **Schedule View** — Week-by-week calendar view of training sessions grouped by day.
5. **Athlete Management** — Coach sees all athletes, can view individual athlete profiles and their schedules.
6. **AI Week Planner** — Coach can use AI to generate a week of training sessions for an athlete based on natural language instructions.
7. **Web Support** — Runs in browser via Metro bundler with platform-aware storage and alerts.

## Multi-Agent Workflow

When building or modifying Ventri, delegate to specialized agents:

1. **@architect** — Design data models, API contracts, and system architecture decisions
2. **@backend** — Implement server-side code: routes, controllers, services, Prisma schema, migrations
3. **@frontend** — Implement UI screens, components, navigation, styling, and client-side logic
4. **@reviewer** — Review implementations for quality, security, consistency, and best practices

### Workflow Steps

1. Break the feature into architectural decisions → delegate to @architect
2. Implement server-side changes → delegate to @backend
3. Implement client-side changes → delegate to @frontend
4. Review the complete implementation → delegate to @reviewer
5. Address any review findings

## Design Principles

- **Modern, card-based UI** with custom design tokens (no external UI library)
- **Platform-aware**: Use `storage.ts` wrapper for SecureStore (native) / localStorage (web)
- **Cross-platform alerts**: Use `showAlert`/`showConfirm` wrappers instead of `Alert.alert`
- **Discipline colors**: Each training discipline (swim, bike, run, strength, etc.) has a distinct color
- **No over-engineering**: Simple, focused code. No unnecessary abstractions.

## Reference Files

- [Data Models](./references/data-models.md) — Prisma schema and TypeScript types
- [API Contracts](./references/api-contracts.md) — REST endpoint specifications
- [Design Tokens](./references/design-tokens.md) — Colors, spacing, typography
- [Platform Utilities](./references/platform-utils.md) — Cross-platform helpers
- [AI Integration](./references/ai-integration.md) — LLM provider layer and agent service
