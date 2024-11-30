"use client";

import { cn } from "@/features/common/util";
import { AudioLines, Mic, MicOff, Square } from "lucide-react";
import { ReactNode } from "react";
import { connectRealtime, disconnectRealtime } from "./realtime-client";
import { toggleMute, useRealtimeStore } from "./realtime-store";

export const RealTimeButton = () => {
  const loading = useRealtimeStore((state) => state.loading);
  let buttonIcon: ReactNode = <AudioLines />;

  if (loading === "connected") {
    buttonIcon = <Square />;
  }

  if (loading === "connecting") {
    buttonIcon = <AudioLines className="animate-pulse" />;
  }

  const onClick = () => {
    if (loading === "connected") {
      disconnectRealtime();
    } else {
      connectRealtime();
    }
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        loading === "connected" && "bg-green-500 hover:bg-green-600",
        loading === "connecting" && "bg-yellow-500 hover:bg-yellow-600"
      )}
    >
      {buttonIcon}
    </button>
  );
};

export const RealTimeMuteButton = () => {
  const isMuted = useRealtimeStore((state) => state.isMuted);

  const onClick = () => {
    toggleMute();
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(isMuted && "bg-red-500 hover:bg-red-600")}
    >
      {isMuted ? <MicOff /> : <Mic />}
    </button>
  );
};
