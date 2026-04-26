# Data Models

## Prisma Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  coachSessions   Session[]  @relation("CoachSessions")
  athleteSessions Session[]  @relation("AthleteSessions")
  feedback        Feedback[]
}

enum Role {
  COACH
  ATHLETE
}

model Session {
  id          String         @id @default(uuid())
  title       String
  description String?
  discipline  Discipline
  date        DateTime
  duration    Int            // minutes
  status      SessionStatus  @default(PLANNED)
  order       Int            @default(0)

  coachId   String
  coach     User @relation("CoachSessions", fields: [coachId], references: [id])
  athleteId String
  athlete   User @relation("AthleteSessions", fields: [athleteId], references: [id])

  feedback  Feedback?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Discipline {
  SWIM
  BIKE
  RUN
  STRENGTH
  FLEXIBILITY
  REST
  OTHER
}

enum SessionStatus {
  PLANNED
  COMPLETED
  SKIPPED
  MODIFIED
}

model Feedback {
  id        String   @id @default(uuid())
  rpe       Int      // 1-10 Rate of Perceived Exertion
  notes     String?
  completed Boolean  @default(true)

  sessionId String   @unique
  session   Session  @relation(fields: [sessionId], references: [id])
  athleteId String
  athlete   User     @relation(fields: [athleteId], references: [id])

  createdAt DateTime @default(now())
}
```

## TypeScript Types (shared)

```typescript
export type Role = 'COACH' | 'ATHLETE';

export type Discipline = 'SWIM' | 'BIKE' | 'RUN' | 'STRENGTH' | 'FLEXIBILITY' | 'REST' | 'OTHER';

export type SessionStatus = 'PLANNED' | 'COMPLETED' | 'SKIPPED' | 'MODIFIED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  discipline: Discipline;
  date: string;
  duration: number;
  status: SessionStatus;
  order: number;
  coachId: string;
  athleteId: string;
  feedback?: Feedback;
}

export interface Feedback {
  id: string;
  rpe: number;
  notes?: string;
  completed: boolean;
  sessionId: string;
  athleteId: string;
}

export interface WeekSchedule {
  weekStart: string;
  weekEnd: string;
  days: DaySchedule[];
  totals: DisciplineTotals;
}

export interface DaySchedule {
  date: string;
  dayName: string;
  sessions: Session[];
}

export interface DisciplineTotals {
  [discipline: string]: { count: number; totalMinutes: number };
}
```
