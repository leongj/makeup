"use client";
import { XIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import Webcam from "react-webcam";
import { capture, clearScreenshot, useCameraStore } from "../real-time-page/camera/camera-store";

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

interface ProductCameraProps {
  onPhotoCaptured?: (imageSrc: string) => void;
}

export const ProductCamera: React.FC<ProductCameraProps> = ({ onPhotoCaptured }) => {
  const webcamRef = useCameraStore((s) => s.webcamRef);
  const facingMode = useCameraStore((s) => s.facingMode);
  const screenshot = useCameraStore((s) => s.screenshot);
  const [flash, setFlash] = useState(false);
  const [capturedImg, setCapturedImg] = useState<string | null>(null);

  const handleCapture = async () => {
    setFlash(true);
    // Step 1: Flash white, then fade out
    setTimeout(() => {
      const img = capture();
      if (img) {
        setCapturedImg(img);
      }
      setFlash(false);
      // Step 2: Pause for 0.5s before moving to next page
      setTimeout(() => {
        if (img && onPhotoCaptured) {
          onPhotoCaptured(img);
        }
      }, 500);
    }, 180); // flash duration
  };

  // Show the captured image if present, otherwise use the screenshot from store
  const displayImg = capturedImg || screenshot;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative">
        {displayImg ? (
          <div className="relative">
            <img
              src={displayImg}
              alt="captured image"
              className="rounded-3xl"
            />
            <div className="absolute top-0 right-0 p-2">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  clearScreenshot();
                  setCapturedImg(null);
                }}
                className="bg-slate-50 rounded-full size-6 flex items-center justify-center"
              >
                <XIcon size={14} />
              </motion.button>
            </div>
          </div>
        ) : (
          <div
            className="relative cursor-pointer"
            onClick={handleCapture}
          >
            <Webcam
              ref={webcamRef}
              className="rounded-3xl"
              videoConstraints={{
                facingMode: facingMode,
                // aspectRatio: 11 / 16,
                height: 600,
              }}
            />
            {/* Flash overlay */}
            {flash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.18, ease: "easeIn" }}
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: "white" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
