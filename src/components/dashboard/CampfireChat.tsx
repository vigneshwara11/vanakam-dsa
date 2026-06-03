"use client";

import { useEffect, useRef, useState } from "react";
import { Flame, Send } from "lucide-react";
import { useLobbyRealtime, type FeedItem } from "@/contexts/lobby-realtime-context";

function FeedBubble({ item }: { item: FeedItem }) {
  if (item.kind === "system") {
    return (
      <div className="flex justify-center py-1">
        <p className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-center text-xs font-medium text-amber-200/90">
          {item.content}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 px-3 py-2">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-amber-400">
          {item.username}
        </span>
        <time className="text-[10px] text-zinc-600">
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-300">
        {item.content}
      </p>
    </div>
  );
}

export function CampfireChat() {
  const { feed, sendMessage } = useLobbyRealtime();
  const [draft, setDraft] = useState("");
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feed]);

  function submitMessage() {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const id = crypto.randomUUID();
    sendMessage(trimmed, id);
    setDraft("");
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    submitMessage();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  }

  return (
    <section className="rounded-2xl border border-orange-500/20 bg-gradient-to-b from-zinc-900/90 to-zinc-950 shadow-[0_0_40px_-16px_rgba(249,115,22,0.35)]">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10">
          <Flame className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">The Campfire</h2>
          <p className="text-xs text-zinc-500">
            Ask doubts, share approaches, celebrate wins
          </p>
        </div>
      </div>

      <div className="flex h-80 flex-col gap-2 overflow-y-auto px-4 py-4">
        {feed.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-600">
            The fire is warm. Say hello to the lobby.
          </p>
        ) : (
          feed.map((item) => <FeedBubble key={item.id} item={item} />)
        )}
        <div ref={feedEndRef} />
      </div>

      <div className="border-t border-zinc-800 p-4">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Share a doubt, approach, or snippet…"
            className="min-h-[40px] min-w-0 flex-1 resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="flex shrink-0 items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-zinc-950 transition-colors hover:bg-orange-400 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
