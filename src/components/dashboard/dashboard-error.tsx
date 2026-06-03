import Link from "next/link";
import { AlertTriangle, Home } from "lucide-react";

type DashboardErrorProps = {
  message: string;
};

export function DashboardError({ message }: DashboardErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-zinc-900/80 p-8 text-center shadow-[0_0_32px_-12px_rgba(239,68,68,0.25)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-white">Profile Unavailable</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{message}</p>
        <p className="mt-2 text-xs text-zinc-600">
          If you just signed up, run{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">
            supabase_schema.sql
          </code>{" "}
          in your Supabase SQL Editor.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
