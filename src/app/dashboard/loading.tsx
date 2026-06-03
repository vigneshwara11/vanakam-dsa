export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="mb-10">
          <div className="mb-2 h-4 w-32 rounded bg-zinc-800" />
          <div className="h-10 w-64 rounded-lg bg-zinc-800" />
          <div className="mt-2 h-4 w-48 rounded bg-zinc-800/60" />
        </div>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-zinc-800 bg-zinc-900/80"
            />
          ))}
        </div>
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <div className="h-20 rounded-xl border border-zinc-800 bg-zinc-900/60" />
          <div className="h-20 rounded-xl border border-zinc-800 bg-zinc-900/60" />
        </div>
        <div className="h-48 rounded-2xl border border-zinc-800 bg-zinc-900/50" />
      </div>
    </div>
  );
}
