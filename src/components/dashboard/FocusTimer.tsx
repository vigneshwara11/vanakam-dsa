"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, Timer, CheckCircle2 } from "lucide-react";
import { useLobbyRealtime } from "@/contexts/lobby-realtime-context";

function formatElapsed(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function FocusTimer() {
  const { logStudyHours } = useLobbyRealtime();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const carryRef = useRef(0);

  const tick = useCallback(() => {
    const running =
      carryRef.current +
      (startedAtRef.current !== null
        ? Math.floor((Date.now() - startedAtRef.current) / 1000)
        : 0);
    setElapsedSeconds(running);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  function handleStart() {
    setError(null);
    startedAtRef.current = Date.now();
    setIsRunning(true);
  }

  function handlePause() {
    if (startedAtRef.current !== null) {
      carryRef.current += Math.floor(
        (Date.now() - startedAtRef.current) / 1000
      );
      startedAtRef.current = null;
    }
    setElapsedSeconds(carryRef.current);
    setIsRunning(false);
  }

  function resetTimer() {
    startedAtRef.current = null;
    carryRef.current = 0;
    setElapsedSeconds(0);
    setIsRunning(false);
  }

  async function handleFinish() {
    if (isRunning) {
      if (startedAtRef.current !== null) {
        carryRef.current += Math.floor(
          (Date.now() - startedAtRef.current) / 1000
        );
        startedAtRef.current = null;
      }
      setIsRunning(false);
    }

    const secondsToSave = carryRef.current;
    if (secondsToSave < 1) {
      setError("Session too short to save. Study for at least 1 second.");
      return;
    }

    const decimalHours =
      Math.round((secondsToSave / 3600) * 10000) / 10000;

    setSaving(true);
    setError(null);

    const result = await logStudyHours(decimalHours);

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    resetTimer();
    setSaving(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  }

  const isActive = isRunning || elapsedSeconds > 0;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-950/40 via-zinc-900/90 to-zinc-950 p-8 shadow-[0_0_48px_-12px_rgba(34,211,238,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12),transparent_65%)]" />
      <div className="relative">
        <div className="mb-6 flex items-center justify-center gap-2 text-cyan-400/90">
          <Timer className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em]">
            Focus Session
          </span>
        </div>

        <p
          className={`text-center font-mono text-6xl font-bold tabular-nums tracking-wider sm:text-7xl ${
            isRunning
              ? "text-cyan-300 drop-shadow-[0_0_32px_rgba(34,211,238,0.55)]"
              : "text-cyan-200/90"
          }`}
        >
          {formatElapsed(elapsedSeconds)}
        </p>

        <p className="mt-3 text-center text-sm text-zinc-500">
          {isRunning
            ? "Deep work in progress…"
            : isActive
              ? "Paused — resume or save your session"
              : "Start the stopwatch when you begin studying"}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {!isRunning ? (
            <button
              type="button"
              onClick={handleStart}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              Start
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20"
            >
              <Pause className="h-4 w-4" />
              Pause
            </button>
          )}

          <button
            type="button"
            onClick={handleFinish}
            disabled={saving || elapsedSeconds < 1}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Finish &amp; Save Session
          </button>
        </div>

        {savedFlash && (
          <p className="mt-4 text-center text-sm font-medium text-emerald-400">
            Session saved! Your daily progress has been updated.
          </p>
        )}

        {error && (
          <p className="mt-4 text-center text-sm text-red-400">{error}</p>
        )}
      </div>
    </section>
  );
}
