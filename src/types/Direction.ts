export const DirectionElements = {
  up: 0,
  down: 1,
  left: 2,
  right: 3,
} as const;

export type Direction =
  (typeof DirectionElements)[keyof typeof DirectionElements];
