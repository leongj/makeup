"use client";

import { exampleOccasions } from "./occasion-examples";
import { VoiceIcon } from "../ui/app-icons";
import { useState, useEffect, useRef } from "react";
import * as motion from "motion/react-client";
import { startRecognition, stopRecognition, initSpeechConfig } from "../common/speech-to-text";
import { useSpeechInput, resetSpeechInput } from "./store";

interface OccasionSelectionProps {
  onSelectOccasion: (dressType: string) => void;
}

export const OccasionSelection: React.FC<OccasionSelectionProps> = ({
  onSelectOccasion,
}) => {
  const [isPulsating, setIsPulsating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const speechInput = useSpeechInput();

  useEffect(() => {
    // Init Speech Config to make recognition a little more responsive (not sure it does a whole lot TBH)
    initSpeechConfig();
  }, []);

  // Handler for single tap to start/cancel recognition
  const handleVoiceTap = async () => {
    if (!isListening) {
      setIsListening(true);
      setIsPulsating(true);
      // resetSpeechInput();
      console.log("Starting speech recognition...");
      await startRecognition();
    } else {
      setIsListening(false);
      setIsPulsating(false);
      stopRecognition();
      // Optionally, handle the speech input here
      // if (speechInput && speechInput.length > 2) {
      //   onSelectOccasion(speechInput);
      // }
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
          className="text-2xl font-semibold text-red-600 mt-6 mb-2"
        >
          What's the occasion?
        </motion.p>
      </div>

      {(!speechInput || speechInput.trim() === "") ? (
        <div className="w-full flex flex-row flex-wrap justify-center items-stretch gap-4 mt-5">
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
        onClick={handleVoiceTap}
        style={{ cursor: 'pointer' }}
      >
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 3 }}
          className={isPulsating ? "animate-pulse flex flex-col items-center" : "flex flex-col items-center"}
          style={isPulsating ? { animationDuration: "1.0s" } : undefined}
        >
          <VoiceIcon size={150} />
          <div className="my-4 text-lg text-red-700 min-h-[2em] w-full flex justify-center text-center">
            {isPulsating ? (
              <>
                Listening... <br />
                Tap again to submit
              </>
            ) : (
              "Tap to start listening"
            )}
          </div>
        </motion.span>
      </div>
    </div>
  );
};
