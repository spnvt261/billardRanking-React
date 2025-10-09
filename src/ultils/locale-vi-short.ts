import { vi } from "date-fns/locale";

export const viShort = {
  ...vi,
  localize: {
    ...vi.localize,
    day: (n: number) => {
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return days[n];
    }
  }
};