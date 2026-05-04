# Design Tokens

No external UI library. All styling uses these custom tokens.

## Colors

```typescript
export const colors = {
  // Core
  primary: '#0F4C81',
  primaryLight: '#E8F0FE',
  secondary: '#2D9CDB',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',

  // Discipline colors
  discipline: {
    SWIM: '#0EA5E9',
    BIKE: '#8B5CF6',
    RUN: '#F97316',
    STRENGTH: '#EF4444',
    FLEXIBILITY: '#EC4899',
    REST: '#6B7280',
    OTHER: '#14B8A6',
  },
};
```

## Spacing

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

## Typography

```typescript
export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  label: { fontSize: 14, fontWeight: '600' as const },
};
```

## Radius

```typescript
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
```

## Shadows

```typescript
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
```

## UI Patterns

- **Cards**: White surface, `radius.lg`, `shadows.md`, `spacing.md` padding
- **Discipline badges**: Rounded pill with discipline color background (0.15 opacity) and solid text
- **Section headers**: `h3` typography, `textSecondary` color, `spacing.md` bottom margin
- **List items**: Card style with left color accent bar (4px wide, discipline color)
- **FAB**: 56x56 circle, `primary` color, bottom-right positioned, `shadows.lg`
- **Empty states**: Centered icon + message, `textLight` color
