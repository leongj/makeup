"use client";

import { exampleOccasions } from "./occasion-examples";
import { VoiceIcon } from "../ui/app-icons";
import React, { useState, useRef } from "react";
import * as motion from "motion/react-client";
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
      {/* Animated prompt text */}
      <div className="flex flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 1, clipPath: "inset(0 100% 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
          transition={{ delay: 0 }}
          className="text-2xl font-semibold text-red-600 mt-6 mb-4"
        >
          Great! Now tell me about the occasion
        </motion.p>
        <motion.p
          initial={{ opacity: 1, clipPath: "inset(0 100% 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
          transition={{ delay: 0.5 }}
          className="text-lg text-red-800"
        >
          (Tap and hold to talk, or choose an example)
        </motion.p>
      </div>

      {(!speechInput || speechInput.trim() === "") ? (
        <div className="w-full flex flex-row flex-wrap justify-center items-stretch gap-4 mt-20">
          {exampleOccasions.map((option, idx) => (
            <motion.button
              key={option.text}
              initial={{ opacity: 1, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
              transition={{ delay: 1 + idx * 0.05 }}
              onClick={() => onSelectOccasion(option.text)}
              className="flex-1 max-w-md min-h-16 h-full flex items-center justify-center bg-transparent hover:bg-red-700 text-red-900 hover:text-white py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out border border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              {option.text}
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-row flex-wrap justify-center items-center gap-4 mt-20">
          <div className="text-2xl text-center text-red-900 font-semibold">"{speechInput}"</div>
        </div>
      )}

      <div
        className="flex-grow w-full flex flex-col justify-center items-center mt-4"
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
      >
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 3 }}
          className={isPulsating ? "animate-pulse" : ""}
          style={isPulsating ? { animationDuration: "1.0s" } : undefined}
        >
          <VoiceIcon size={150} />
        </motion.span>
        <div className="mb-4 text-lg text-red-700 min-h-[2em]">
          {isPulsating && (
            "Listening..."
          )}
        </div>
      </div>
    </div>
  );
};
