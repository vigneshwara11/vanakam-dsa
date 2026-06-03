import { redirect } from "next/navigation";
import { Flame, Clock, Users, Trophy } from "lucide-react";
import { AuthSection } from "@/components/auth-section";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-800/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-16 px-6 py-16 lg:flex-row lg:gap-24">
        <section className="flex-1 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400">
            <Flame className="h-4 w-4" />
            Open Source · Real-Time · Gamified
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Vanakam{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              DSA
            </span>
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-relaxed text-zinc-400">
            Gamified DSA Tracking: 5 Hours = 1 DSA Day. Study together, share
            approaches, and build your streak.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <Clock className="mb-2 h-5 w-5 text-amber-400" />
              <p className="text-sm font-medium text-white">5 Hours = 1 Day</p>
              <p className="mt-1 text-xs text-zinc-500">
                Consistent effort, measured fairly
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <Users className="mb-2 h-5 w-5 text-amber-400" />
              <p className="text-sm font-medium text-white">Study Together</p>
              <p className="mt-1 text-xs text-zinc-500">
                Share approaches in real time
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <Trophy className="mb-2 h-5 w-5 text-amber-400" />
              <p className="text-sm font-medium text-white">Build Streaks</p>
              <p className="mt-1 text-xs text-zinc-500">
                Stay motivated, day by day
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-1 justify-center">
          <AuthSection />
        </section>
      </div>
    </div>
  );
}
