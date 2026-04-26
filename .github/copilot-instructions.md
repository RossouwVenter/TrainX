# TrainX Workspace Instructions

## Project Overview
TrainX is a coach/athlete training platform built with Expo SDK 54 (React Native) and Express + Prisma + PostgreSQL.

## Key Conventions

### Code Style
- TypeScript strict mode everywhere
- No external UI libraries — use design tokens in `mobile/src/styles/tokens.ts`
- Functional components with hooks (no class components)
- Named exports for components, default export for API client

### Cross-Platform
- Use `src/utils/storage.ts` instead of `expo-secure-store` directly
- Use `src/utils/alert.ts` (`showAlert`/`showConfirm`) instead of `Alert.alert`
- Always consider web compatibility (Metro bundler, not webpack)

### Server Patterns
- Controller → Service → Prisma (3-layer architecture)
- Zod validation on all request bodies
- Express error middleware for consistent error responses

### Agent Collaboration
This project uses specialized agents that collaborate on features:
- **@architect** — Design decisions, data models, API contracts
- **@backend** — Server implementation
- **@frontend** — UI implementation
- **@reviewer** — Code review and quality checks

When building a feature, the recommended flow is: architect → backend → frontend → reviewer.
