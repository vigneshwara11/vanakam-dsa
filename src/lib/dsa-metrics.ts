export const HOURS_PER_DSA_DAY = 5;
export const DSA_DAYS_PER_YEAR = 20;

export type DsaComputedMetrics = {
  dsaDays: number;
  dsaYears: number;
  hoursIntoCurrentDay: number;
  hoursUntilNextDay: number;
  dayProgressPercent: number;
  daysIntoCurrentYear: number;
  daysUntilNextYear: number;
  yearProgressPercent: number;
};

export function computeDsaMetrics(totalHours: number): DsaComputedMetrics {
  const safeHours = Math.max(0, Number(totalHours) || 0);
  const dsaDays = Math.floor(safeHours / HOURS_PER_DSA_DAY);
  const dsaYears = dsaDays / DSA_DAYS_PER_YEAR;

  const hoursIntoCurrentDay = safeHours % HOURS_PER_DSA_DAY;
  const hoursUntilNextDay =
    hoursIntoCurrentDay === 0 && safeHours > 0
      ? 0
      : HOURS_PER_DSA_DAY - hoursIntoCurrentDay;

  const dayProgressPercent =
    hoursIntoCurrentDay === 0 && safeHours > 0
      ? 100
      : (hoursIntoCurrentDay / HOURS_PER_DSA_DAY) * 100;

  const daysIntoCurrentYear = dsaDays % DSA_DAYS_PER_YEAR;
  const daysUntilNextYear =
    daysIntoCurrentYear === 0 && dsaDays > 0
      ? 0
      : DSA_DAYS_PER_YEAR - daysIntoCurrentYear;

  const yearProgressPercent =
    daysIntoCurrentYear === 0 && dsaDays > 0
      ? 100
      : (daysIntoCurrentYear / DSA_DAYS_PER_YEAR) * 100;

  return {
    dsaDays,
    dsaYears,
    hoursIntoCurrentDay,
    hoursUntilNextDay,
    dayProgressPercent,
    daysIntoCurrentYear,
    daysUntilNextYear,
    yearProgressPercent,
  };
}

export function formatDsaAge(years: number): string {
  if (years < 1) {
    return `${(years * DSA_DAYS_PER_YEAR).toFixed(0)}d`;
  }
  const whole = Math.floor(years);
  const fraction = years - whole;
  if (fraction < 0.05) {
    return `${whole}y`;
  }
  return `${years.toFixed(1)}y`;
}

export type TodayProgress = {
  hoursLogged: number;
  hoursUntilNextDay: number;
  dayProgressPercent: number;
  goalMetToday: boolean;
};

export function computeTodayProgress(todayHours: number): TodayProgress {
  const hoursLogged = Math.max(0, Number(todayHours) || 0);
  const capped = Math.min(hoursLogged, HOURS_PER_DSA_DAY);
  const goalMetToday = hoursLogged >= HOURS_PER_DSA_DAY;
  const hoursUntilNextDay = goalMetToday
    ? 0
    : HOURS_PER_DSA_DAY - hoursLogged;

  return {
    hoursLogged,
    hoursUntilNextDay,
    dayProgressPercent: (capped / HOURS_PER_DSA_DAY) * 100,
    goalMetToday,
  };
}

export function todayUtcDateString(): string {
  return new Date().toISOString().slice(0, 10);
}
