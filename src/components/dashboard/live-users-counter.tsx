"use client";

import { Users } from "lucide-react";
import { useLobbyRealtime } from "@/contexts/lobby-realtime-context";

export function LiveUsersCounter() {
  const { onlineCount, isConnecting } = useLobbyRealtime();

  return (
    <div className="relative mb-10 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 via-zinc-900/90 to-zinc-950 px-8 py-8 text-center shadow-[0_0_48px_-12px_rgba(16,185,129,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
      <div className="relative">
        <div className="mb-3 flex items-center justify-center gap-2 text-emerald-400/90">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <Users className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em]">
            Campfire Lobby
          </span>
        </div>
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Live Users Online
        </p>
        <p className="mt-2 font-mono text-6xl font-bold tabular-nums text-emerald-300 drop-shadow-[0_0_24px_rgba(52,211,153,0.5)] sm:text-7xl">
          {isConnecting ? "—" : onlineCount}
        </p>
      </div>
    </div>
  );
}
