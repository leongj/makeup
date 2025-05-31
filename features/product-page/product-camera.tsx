"use client";
import { XIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import Webcam from "react-webcam";
import { capture, clearScreenshot, useCameraStore } from "../real-time-page/camera/camera-store";
import { urlToBase64 } from "./store";
import { cameraClickAudio } from "../common/audio-player";

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
    // Play camera click sound
    cameraClickAudio.play();
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

  // Handler for TEST button: simulates capture using /test_selfie.jpg
  const handleTestCapture = () => {
    setFlash(true);
    cameraClickAudio.play();
    setTimeout(async () => {
      const { base64 } = await urlToBase64("/test_selfie.jpg");
      useCameraStore.setState((state) => ({
        ...state,
        screenshot: base64,
        shutterCount: state.shutterCount + 1,
      }));
      setCapturedImg(base64);
      setFlash(false);
      setTimeout(() => {
        if (onPhotoCaptured) {
          onPhotoCaptured(base64);
        }
      }, 500);
    }, 180);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative">
        {displayImg ? (
          <div className="relative">
            <img
              src={displayImg}
              alt="captured image"
              className="rounded-3xl"
              style={{ transform: "scaleX(-1)" }}
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
          <div className="relative flex flex-col items-center">
            <button
              type="button"
              className="relative cursor-pointer rounded-3xl p-0 border-0 bg-transparent focus:outline-none"
              aria-label="Activate camera"
              onClick={handleCapture}
            >
              <Webcam
                ref={webcamRef}
                className="rounded-3xl"
                style={{ transform: "scaleX(-1)" }} // mirror for selfie mode
                videoConstraints={{
                  // facingMode: facingMode,
                  facingMode: { exact: "user" },
                  // facingMode: "environment", // use for separate webcam testing
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
            </button>
            {/* TEST button below the camera */}
            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                onClick={handleTestCapture}
              >
                TEST
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
