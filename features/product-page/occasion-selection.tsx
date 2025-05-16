"use client";

import { exampleOccasions } from "./occasion-examples";
import { VoiceIcon } from "../ui/app-icons";
import React, { useState, useRef } from "react";

interface OccasionSelectionProps {
  onSelectOccasion: (dressType: string) => void;
}

export const OccasionSelection: React.FC<OccasionSelectionProps> = ({
  onSelectOccasion: onSelectOccasion,
}) => {
  // Add state for pulsate effect
  const [isPulsating, setIsPulsating] = useState(false);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handlers for tap and hold
  const handlePointerDown = () => {
    holdTimeout.current = setTimeout(() => {
      setIsPulsating(true);
    }, 300); // 300ms hold to trigger
  };

  const handlePointerUp = () => {
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
    setIsPulsating(false);
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
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        // For accessibility: also handle mouse/touch events
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
      >
        <span
          className={isPulsating ? "animate-pulse" : ""}
          style={isPulsating ? { animationDuration: "1.0s" } : undefined}
        >
          <VoiceIcon size={150} />
        </span>
      </div>
    </div>
  );
};
