import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import type { Profile } from "@/types/profile";
import { todayUtcDateString } from "@/lib/dsa-metrics";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  await supabase
    .rpc("validate_streak_on_login", { user_uuid: user.id })
    .then(() => undefined, () => undefined);

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, username, total_hours, dsa_days, dsa_years, current_streak, longest_streak, last_active_date"
    )
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    const message =
      error?.code === "PGRST116"
        ? "Your profile has not been created yet. Run the database migration and sign in again."
        : error?.message?.includes("longest_streak")
          ? "Run phase3_schema.sql in Supabase to enable streak tracking."
          : (error?.message ??
            "We could not load your profile. Please try again in a moment.");

    return <DashboardError message={message} />;
  }

  const normalized: Profile = {
    id: profile.id,
    username: profile.username,
    total_hours: Number(profile.total_hours),
    dsa_days: profile.dsa_days,
    dsa_years: Number(profile.dsa_years),
    current_streak: profile.current_streak,
    longest_streak: profile.longest_streak ?? 0,
    last_active_date: profile.last_active_date,
  };

  const todayUtc = todayUtcDateString();
  const { data: todayLog } = await supabase
    .from("daily_logs")
    .select("hours_studied")
    .eq("user_id", user.id)
    .eq("log_date", todayUtc)
    .maybeSingle();

  const todayHours = Number(todayLog?.hours_studied ?? 0);

  return <DashboardShell profile={normalized} todayHours={todayHours} />;
}
