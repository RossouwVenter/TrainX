import { colors } from '../styles/tokens';
import type { Discipline } from '../types';

const DISCIPLINE_LABELS: Record<Discipline, string> = {
  SWIM: 'Swim',
  BIKE: 'Bike',
  RUN: 'Run',
  STRENGTH: 'Strength',
  FLEXIBILITY: 'Flexibility',
  REST: 'Rest',
  OTHER: 'Other',
};

export function getDisciplineColor(discipline: Discipline): string {
  return colors.discipline[discipline] || colors.discipline.OTHER;
}

export function getDisciplineLabel(discipline: Discipline): string {
  return DISCIPLINE_LABELS[discipline] || discipline;
}
