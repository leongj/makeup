"use client";

import { cn } from "@/features/common/util";
import { AppBarButton } from "@/features/ui/app-bar/app-bar";
import {
  VoiceIcon,
  VoiceMuteIcon,
  VoiceRobotIcon,
} from "@/features/ui/app-icons";
import { connectRealtime, disconnectRealtime } from "./realtime-client";
import { toggleMute, useRealtimeStore } from "./realtime-store";

export const RealTimeButton = () => {
  const loading = useRealtimeStore((state) => state.loading);

  const onClick = () => {
    if (loading === "connected") {
      disconnectRealtime();
    } else {
      connectRealtime();
    }
  };

  return (
    <AppBarButton
      onClick={onClick}
      type="button"
      className={cn(
        "",
        loading === "connected" &&
          "ring-green-200 ring-2 hover:bg-green-50 bg-violet-50",
        loading === "connecting" && "ring-orange-200 hover:bg-orange-50"
      )}
    >
      <VoiceRobotIcon />
    </AppBarButton>
  );
};

export const RealTimeMuteButton = () => {
  const isMuted = useRealtimeStore((state) => state.isMuted);

  const onClick = () => {
    toggleMute();
  };

  return (
    <AppBarButton onClick={onClick}>
      {isMuted ? <VoiceMuteIcon /> : <VoiceIcon />}
    </AppBarButton>
  );
};

export const RealTimePushToTalk = () => {
  const isMuted = useRealtimeStore((state) => state.isMuted);

  const onClick = () => {
    toggleMute();
  };

  return (
    <AppBarButton onClick={onClick}>
      {isMuted ? <VoiceMuteIcon /> : <VoiceIcon />}
    </AppBarButton>
  );
};
