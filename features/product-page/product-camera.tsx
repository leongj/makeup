"use client";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import Webcam from "react-webcam";
import { clearScreenshot, useCameraStore } from "../real-time-page/camera/camera-store";

export const Screenshot = () => {
  const screenshot = useCameraStore((s) => s.screenshot);
  const shutterCount = useCameraStore((s) => s.shutterCount);
  if (!screenshot) return null;

  return (
    <motion.div
      layout
      key={shutterCount}
      initial={{ width: "100%" }}
      animate={{ width: "30%" }}
      className="absolute w-[30%] left-0 bottom-0 m-2"
    >
      <img
        src={screenshot ?? ""}
        alt="screenshot"
        className="rounded-2xl w-full"
      />
      <div className="absolute top-0 right-0 p-2">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={clearScreenshot}
          className="bg-slate-50 rounded-full size-6 flex items-center justify-center"
        >
          <XIcon size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export const ProductCamera: React.FC = () => {
  const webcamRef = useCameraStore((s) => s.webcamRef);
  const facingMode = useCameraStore((s) => s.facingMode);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className="relative cursor-pointer"
        onClick={() => {
          const { capture } = require("../real-time-page/camera/camera-store");
          capture();
        }}
      >
        <Webcam
          ref={webcamRef}
          className="rounded-3xl"
          // mirrored={facingMode === "user"}
          videoConstraints={{
            facingMode: facingMode,
            aspectRatio: 11 / 16,
            height: 600,
          }}
        />
        <AnimatePresence>
          <Screenshot />
        </AnimatePresence>
      </div>
    </div>
  );
};
