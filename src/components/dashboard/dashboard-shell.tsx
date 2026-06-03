"use client";

import Link from "next/link";
import {
  Flame,
  Calendar,
  Clock,
  Crown,
  ScrollText,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";
import type { Profile } from "@/types/profile";
import {
  computeDsaMetrics,
  computeTodayProgress,
  formatDsaAge,
  HOURS_PER_DSA_DAY,
  DSA_DAYS_PER_YEAR,
} from "@/lib/dsa-metrics";
import { LobbyProvider } from "@/contexts/lobby-realtime-context";
import { MetricCard } from "./metric-card";
import { ProgressBar } from "./progress-bar";
import { SignOutButton } from "./sign-out-button";
import { LiveUsersCounter } from "./live-users-counter";
import { CampfireChat } from "./CampfireChat";
import { FocusTimer } from "./FocusTimer";

type DashboardShellProps = {
  profile: Profile;
  todayHours: number;
};

export function DashboardShell({ profile, todayHours }: DashboardShellProps) {
  const metrics = computeDsaMetrics(profile.total_hours);
  const todayProgress = computeTodayProgress(todayHours);

  return (
    <LobbyProvider userId={profile.id} username={profile.username}>
      <div className="relative min-h-screen overflow-hidden bg-zinc-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-10">
          <LiveUsersCounter />

          <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-amber-400/80">
                <Swords className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Adventurer Profile
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {profile.username}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Vanakam DSA · Level up your grind
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Home
              </Link>
              <SignOutButton />
            </div>
          </header>

          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <MetricCard
              label="Current Streak"
              value={profile.current_streak}
              subtitle={
                profile.current_streak === 1 ? "day on fire" : "days on fire"
              }
              icon={Flame}
              accent="rose"
            />
            <MetricCard
              label="Longest Streak"
              value={profile.longest_streak}
              subtitle="personal best"
              icon={Trophy}
              accent="amber"
            />
            <MetricCard
              label="Total DSA Days"
              value={metrics.dsaDays}
              subtitle={`${HOURS_PER_DSA_DAY} focus hours = 1 day`}
              icon={Calendar}
              accent="amber"
            />
            <MetricCard
              label="DSA Age"
              value={formatDsaAge(metrics.dsaYears)}
              subtitle={`${DSA_DAYS_PER_YEAR} days = 1 year`}
              icon={Crown}
              accent="violet"
            />
            <MetricCard
              label="Focus Hours"
              value={Number(profile.total_hours).toFixed(1)}
              subtitle="lifetime logged"
              icon={Clock}
              accent="emerald"
            />
          </section>

          <section className="mb-8">
            <FocusTimer />
          </section>

          <section className="mb-8">
            <CampfireChat />
          </section>

          <section className="mb-8 grid gap-4 lg:grid-cols-2">
            <ProgressBar
              label="Progress to Next DSA Day"
              valueLabel={`${todayProgress.hoursLogged.toFixed(1)} / ${HOURS_PER_DSA_DAY} hrs today`}
              percent={todayProgress.dayProgressPercent}
              accent="amber"
            />
            <ProgressBar
              label="Progress to Next DSA Year"
              valueLabel={`${metrics.daysIntoCurrentYear} / ${DSA_DAYS_PER_YEAR} days`}
              percent={metrics.yearProgressPercent}
              accent="violet"
            />
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Quest Rules</h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-3 rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-4">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <div>
                  <p className="font-medium text-zinc-200">
                    5 Focus Hours = 1 DSA Day
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {todayProgress.goalMetToday
                      ? "You earned a fresh DSA day!"
                      : `${todayProgress.hoursUntilNextDay.toFixed(1)} hours until today's goal`}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-4">
                <Crown className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                <div>
                  <p className="font-medium text-zinc-200">
                    20 DSA Days = 1 DSA Year
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {metrics.daysUntilNextYear > 0
                      ? `${metrics.daysUntilNextYear} days until your next year`
                      : "You leveled up to a new DSA year!"}
                  </p>
                </div>
              </li>
            </ul>
          </section>

          {profile.last_active_date && (
            <p className="mt-6 text-center text-xs text-zinc-600">
              Last active:{" "}
              <span className="text-zinc-500">{profile.last_active_date}</span>
            </p>
          )}
        </div>
      </div>
    </LobbyProvider>
  );
}
