import { PrismaClient, Discipline, SessionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.feedback.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password1', 10);

  // Create coach
  const coach = await prisma.user.create({
    data: {
      email: 'rossouw.venter.rv@gmail.com',
      password: hashedPassword,
      name: 'Rossouw Venter',
      role: 'COACH',
    },
  });

  // Create athletes
  const athletes = await Promise.all([
    prisma.user.create({
      data: {
        email: 'athlete1@ventri.com',
        password: hashedPassword,
        name: 'James Wilson',
        role: 'ATHLETE',
      },
    }),
    prisma.user.create({
      data: {
        email: 'athlete2@ventri.com',
        password: hashedPassword,
        name: 'Emma Davis',
        role: 'ATHLETE',
      },
    }),
    prisma.user.create({
      data: {
        email: 'athlete3@ventri.com',
        password: hashedPassword,
        name: 'Alex Thompson',
        role: 'ATHLETE',
      },
    }),
  ]);

  // Generate 2 weeks of sessions
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() + mondayOffset);
  thisMonday.setHours(0, 0, 0, 0);

  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);

  const disciplines: Discipline[] = ['SWIM', 'BIKE', 'RUN', 'STRENGTH', 'FLEXIBILITY', 'REST', 'OTHER'];

  const sessionTemplates = [
    { title: 'Morning Swim', discipline: 'SWIM' as Discipline, duration: 60, description: 'Technique drills and endurance sets' },
    { title: 'Road Bike', discipline: 'BIKE' as Discipline, duration: 90, description: 'Steady-state ride with hill intervals' },
    { title: 'Tempo Run', discipline: 'RUN' as Discipline, duration: 45, description: 'Warm up, tempo block, cool down' },
    { title: 'Strength Training', discipline: 'STRENGTH' as Discipline, duration: 60, description: 'Full body compound movements' },
    { title: 'Yoga & Mobility', discipline: 'FLEXIBILITY' as Discipline, duration: 30, description: 'Hip openers and shoulder mobility' },
    { title: 'Rest Day', discipline: 'REST' as Discipline, duration: 0, description: 'Active recovery, light walking' },
    { title: 'Open Water Swim', discipline: 'SWIM' as Discipline, duration: 45, description: 'Sighting drills and race pace efforts' },
    { title: 'Interval Run', discipline: 'RUN' as Discipline, duration: 50, description: '8x400m at 5K pace with 90s recovery' },
    { title: 'Spin Session', discipline: 'BIKE' as Discipline, duration: 60, description: 'Indoor trainer session with power intervals' },
    { title: 'Core & Stability', discipline: 'STRENGTH' as Discipline, duration: 30, description: 'Planks, dead bugs, and stability ball work' },
  ];

  const allSessions = [];

  for (const athlete of athletes) {
    // Last week sessions (completed with feedback)
    for (let day = 0; day < 6; day++) {
      const date = new Date(lastMonday);
      date.setDate(lastMonday.getDate() + day);
      const template = sessionTemplates[day % sessionTemplates.length];

      const session = await prisma.session.create({
        data: {
          title: template.title,
          description: template.description,
          discipline: template.discipline,
          date,
          duration: template.duration,
          status: day < 5 ? 'COMPLETED' : 'SKIPPED',
          order: day,
          coachId: coach.id,
          athleteId: athlete.id,
        },
      });

      // Add feedback for completed/skipped sessions
      await prisma.feedback.create({
        data: {
          rpe: Math.floor(Math.random() * 4) + 5, // 5-8
          notes: day < 5 ? 'Felt good, solid session' : 'Had to skip due to schedule conflict',
          completed: day < 5,
          sessionId: session.id,
          athleteId: athlete.id,
        },
      });

      allSessions.push(session);
    }

    // This week sessions (planned)
    for (let day = 0; day < 7; day++) {
      const date = new Date(thisMonday);
      date.setDate(thisMonday.getDate() + day);
      const template = sessionTemplates[(day + 3) % sessionTemplates.length];

      const session = await prisma.session.create({
        data: {
          title: template.title,
          description: template.description,
          discipline: template.discipline,
          date,
          duration: template.duration,
          status: 'PLANNED',
          order: day,
          coachId: coach.id,
          athleteId: athlete.id,
        },
      });

      allSessions.push(session);
    }
  }

  console.log(`Seeded: 1 coach, ${athletes.length} athletes, ${allSessions.length} sessions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
