"use client";


import * as motion from "motion/react-client";
import { useState, useLayoutEffect, useEffect } from "react";
import { AltImages } from "./alt-text/alt-images";
import { HomeAppBar } from "../app-bar/app-bar";
import { ProductCamera } from "./product-camera";
import { Recommendation } from "./recommendation/recommendation";
import { UploadImageLanding } from "./upload-image-landing";
import { OccasionSelection } from "./occasion-selection";
import { generateRecommendationForOccasion, resetAppStore } from "./store";
import { resetCamera } from "../real-time-page/camera/camera-store";
import { selfieAudio, occasionAudio, } from "@/features/common/audio-player";

// Simple fade-in animation wrapper
const FadeIn: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div
    className={`opacity-0 animate-fade-in ${className ?? ""}`}
    style={{
      animation: "fadeIn 0.5s forwards",
    }}
  >
    {children}
    <style jsx global>{`
      @keyframes fadeIn {
        to {
          opacity: 1;
        }
      }
    `}</style>
  </div>
);

export const ProductPage = () => {
  // Reset store state and clear camera before first paint of the product page
  // Reset application and camera state before first paint
  useLayoutEffect(() => {
    resetAppStore();
    resetCamera();
  }, []);
  const [workflowStep, setWorkflowStep] = useState<"photo" | "occasionSelection" | "recommendation">("photo");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedoccasionSelection, setSelectedoccasionSelection] = useState<string | null>(null);

  // Play the appropriate audio when workflow step changes
  useEffect(() => {
    console.log("useEffect current workflow step:", workflowStep);
    // Stop any currently playing audio
    selfieAudio.stop();
    occasionAudio.stop();
    
    // Play the appropriate audio for the current step
    if (workflowStep === "photo") {
      selfieAudio.play();
    } else if (workflowStep === "occasionSelection") {
      occasionAudio.play();
    }
    
    // Cleanup on unmount or step change
    return () => {
      selfieAudio.stop();
      occasionAudio.stop();
    };
  }, [workflowStep]);

  const handlePhotoTaken = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setWorkflowStep("occasionSelection");
  };

  const handleOccasionSelected = async (occasionSelection: string) => {
    setSelectedoccasionSelection(occasionSelection);
    setWorkflowStep("recommendation");
    if (capturedImage) {
      await generateRecommendationForOccasion(capturedImage, occasionSelection);
    }
  };

  return (
    <div className="flex flex-col h-svh max-h-svh text-slate-500">
      <HomeAppBar />
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col pt-24 min-h-0 flex-1 gap-6">
        {workflowStep === "photo" && (
          <FadeIn>
            <>
              <div className="flex flex-col items-center justify-center text-center">
                <motion.p
                  initial={{ opacity: 1, clipPath: "inset(0 100% 0 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                  transition={{ delay: 0 }}
                  className="text-2xl font-semibold text-red-600 mt-6 mb-4"
                >
                  Take a selfie so I can see you!
                </motion.p>
                <motion.p
                  initial={{ opacity: 1, clipPath: "inset(0 100% 0 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-red-800"
                >
                  (Tap the camera to take a picture)
                </motion.p>
              </div>

              <div className="flex flex-col pt-10 justify-center items-center w-full">
                <ProductCamera onPhotoCaptured={handlePhotoTaken} />
              </div>
            </>
          </FadeIn>
        )}

        {workflowStep === "occasionSelection" && capturedImage && (
          <FadeIn className="flex-1 flex flex-col">
            <OccasionSelection onSelectOccasion={handleOccasionSelected} />
          </FadeIn>
        )}

        {workflowStep === "recommendation" && capturedImage && selectedoccasionSelection && (
          <FadeIn>
            <>
              <Recommendation imageSrc={capturedImage} occasion={selectedoccasionSelection} />
            </>
          </FadeIn>
        )}

      </div>
    </div>
  );
};
