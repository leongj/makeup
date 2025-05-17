"use client";

import { exampleOccasions } from "./occasion-examples";
import { VoiceIcon } from "../ui/app-icons";
import React, { useState, useRef } from "react";
import { startRecognition, stopRecognition } from "../common/speech-to-text";
import { useSpeechInput, resetSpeechInput } from "./store";

interface OccasionSelectionProps {
  onSelectOccasion: (dressType: string) => void;
}

export const OccasionSelection: React.FC<OccasionSelectionProps> = ({
  onSelectOccasion,
}) => {
  const [isPulsating, setIsPulsating] = useState(false);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const speechInput = useSpeechInput();

  // Handlers for tap and hold
  const handlePointerDown = () => {
    console.log("pointer down");
    if (holdTimeout.current) clearTimeout(holdTimeout.current); // Prevent overlap
    holdTimeout.current = setTimeout(async () => {
      setIsPulsating(true);
      // resetSpeechInput();
      console.log("Starting speech recognition...");
      await startRecognition();
    }, 300); // hold for at least 300ms to trigger
  };

  const handlePointerUp = () => {
    console.log("pointer up");
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
    setIsPulsating(false);
    stopRecognition();
    if (speechInput && speechInput.length > 2) {
      // onSelectOccasion(speechInput);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col">
      <div className="w-full flex flex-row flex-wrap justify-center items-center gap-4 mt-20">
        {exampleOccasions.map((option) => (
          <button
            key={option.text}
            onClick={() => onSelectOccasion(option.text)}
            className="flex-1 max-w-md h-16 flex items-center justify-center bg-transparent hover:bg-red-700 text-red-900 hover:text-white py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out border border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            {option.text}
          </button>
        ))}
      </div>

      <div
        className="flex-grow w-full flex flex-col justify-center items-center mt-4"
        // onPointerDown={handlePointerDown}
        // onPointerUp={handlePointerUp}
        // onPointerLeave={handlePointerUp}
        // onPointerCancel={handlePointerUp}
        // For accessibility: also handle mouse/touch events
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        // onMouseLeave={handlePointerUp}
        // onTouchStart={handlePointerDown}
        // onTouchEnd={handlePointerUp}
        // onTouchCancel={handlePointerUp}
      >
        {/* Show speech input above the microphone */}
        <div className="mb-4 text-lg text-red-700 min-h-[2em]">
          Speech input: {speechInput}
        </div>
        <span
          className={isPulsating ? "animate-pulse" : ""}
          style={isPulsating ? { animationDuration: "1.0s" } : undefined}
          >
          <VoiceIcon size={150} />
        </span>
        {isPulsating && (
          <div className="mb-4 text-lg text-red-700 min-h-[2em]">
            "Listening..."
          </div>
        )}
      </div>
    </div>
  );
};
