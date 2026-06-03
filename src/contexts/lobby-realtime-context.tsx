"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export type FeedItem =
  | {
      id: string;
      kind: "message";
      username: string;
      content: string;
      timestamp: string;
    }
  | {
      id: string;
      kind: "system";
      content: string;
      timestamp: string;
    };

type LobbyRealtimeContextValue = {
  onlineCount: number;
  feed: FeedItem[];
  sendMessage: (content: string, id: string) => void;
  logStudyHours: (hours: number) => Promise<{ error?: string; goalJustMet?: boolean }>;
  isConnecting: boolean;
};

const LobbyRealtimeContext = createContext<LobbyRealtimeContextValue | null>(
  null
);

const LOBBY_CHANNEL = "vanakam_lobby";

type LobbyProviderProps = {
  userId: string;
  username: string;
  children: React.ReactNode;
};

export function LobbyProvider({ userId, username, children }: LobbyProviderProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);

  const appendFeedIfNew = useCallback((item: FeedItem) => {
    setFeed((prev) => {
      if (prev.some((msg) => msg.id === item.id)) return prev;
      return [...prev, item].slice(-200);
    });
  }, []);

  const syncPresenceCount = useCallback((channel: RealtimeChannel) => {
    const state = channel.presenceState();
    setOnlineCount(Object.keys(state).length);
  }, []);

  useEffect(() => {
    const channel = supabase.channel(LOBBY_CHANNEL, {
      config: {
        presence: { key: userId },
        broadcast: { self: true },
      },
    });

    channelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => syncPresenceCount(channel))
      .on("presence", { event: "join" }, () => syncPresenceCount(channel))
      .on("presence", { event: "leave" }, () => syncPresenceCount(channel))
      .on(
        "broadcast",
        { event: "message" },
        ({ payload }: { payload: Record<string, string> }) => {
          if (!payload?.id || !payload?.content || !payload?.username) return;
          appendFeedIfNew({
            id: payload.id,
            kind: "message",
            username: payload.username,
            content: payload.content,
            timestamp: payload.timestamp ?? new Date().toISOString(),
          });
        }
      )
      .on(
        "broadcast",
        { event: "goal_complete" },
        ({ payload }: { payload: Record<string, string> }) => {
          if (!payload?.id || !payload?.username) return;
          appendFeedIfNew({
            id: payload.id,
            kind: "system",
            content: `🔥 ${payload.username} just completed their 5 hours for the day!`,
            timestamp: payload.timestamp ?? new Date().toISOString(),
          });
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnecting(false);
          await channel.track({
            user_id: userId,
            username,
            online_at: new Date().toISOString(),
          });
          syncPresenceCount(channel);
        }
      });

    return () => {
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, username, appendFeedIfNew, syncPresenceCount]);

  const sendMessage = useCallback((content: string, id: string) => {
    const trimmed = content.trim();
    if (!trimmed || !channelRef.current) return;

    channelRef.current.send({
      type: "broadcast",
      event: "message",
      payload: {
        id,
        username,
        content: trimmed,
        timestamp: new Date().toISOString(),
      },
    });
  }, [username]);

  const logStudyHours = useCallback(
    async (hours: number) => {
      const { data, error } = await supabase.rpc("update_daily_progress", {
        user_uuid: userId,
        added_hours: hours,
      });

      if (error) {
        return { error: error.message };
      }

      const result = data as {
        goal_just_met?: boolean;
      } | null;

      if (result?.goal_just_met && channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "goal_complete",
          payload: {
            id: crypto.randomUUID(),
            username,
            timestamp: new Date().toISOString(),
          },
        });
      }

      router.refresh();
      return { goalJustMet: Boolean(result?.goal_just_met) };
    },
    [supabase, userId, username, router]
  );

  const value = useMemo(
    () => ({
      onlineCount,
      feed,
      sendMessage,
      logStudyHours,
      isConnecting,
    }),
    [onlineCount, feed, sendMessage, logStudyHours, isConnecting]
  );

  return (
    <LobbyRealtimeContext.Provider value={value}>
      {children}
    </LobbyRealtimeContext.Provider>
  );
}

export function useLobbyRealtime() {
  const ctx = useContext(LobbyRealtimeContext);
  if (!ctx) {
    throw new Error("useLobbyRealtime must be used within LobbyProvider");
  }
  return ctx;
}
