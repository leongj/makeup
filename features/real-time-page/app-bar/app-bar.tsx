"use client";
import { HomeButton } from "@/features/home-page/home-button";
import { AppBar } from "@/features/ui/app-bar/app-bar";
import {
  RealTimeButton,
  RealTimeMuteButton,
  ToggleCameraButton,
} from "../realtime-client/real-time-buttons";
import { useAppBardSection } from "./app-bar-store";

export const RealtimeAppBar = () => {
  const section = useAppBardSection();
  return (
    <AppBar section={section}>
      <HomeButton />
      <RealTimeButton />
      <RealTimeMuteButton />
      <ToggleCameraButton />
    </AppBar>
  );
};
