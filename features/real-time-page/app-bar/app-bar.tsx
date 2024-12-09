"use client";
import { HomeButton } from "@/features/home-page/home-button";
import { AppBar } from "@/features/ui/app-bar/app-bar";
import { useRef } from "react";
import {
  RealTimeButton,
  RealTimeMuteButton,
  ToggleCameraButton,
} from "../realtime-client/real-time-buttons";
import { sendUserMessage } from "../realtime-client/realtime-client";
import { useAppBardSection } from "./app-bar-store";

export const RealtimeAppBar = () => {
  const section = useAppBardSection();
  return (
    <div>
      <RealtimeTextBox />
      <AppBar section={section}>
        <HomeButton />
        <RealTimeButton />
        <RealTimeMuteButton />
        <ToggleCameraButton />
      </AppBar>
    </div>
  );
};

export const RealtimeTextBox = () => {
  const ref = useRef<HTMLInputElement>(null!);

  const onSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendUserMessage(ref.current.value);
    ref.current.value = "";
  };

  return (
    <div className="fixed bottom-20 w-full flex justify-center p-4">
      <div className="flex flex-col items-center gap-6 p-3 bg-white rounded-full shadow-lg">
        <form
          className="flex gap-1 items-center justify-center relative"
          onSubmit={onSubmission}
        >
          <input
            ref={ref}
            className="w-full text-xs h-10 px-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 ring-violet-500"
            placeholder="Type something..."
          />
        </form>
      </div>
    </div>
  );
};
