export type Profile = {
  id: string;
  username: string;
  total_hours: number;
  dsa_days: number;
  dsa_years: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
};
