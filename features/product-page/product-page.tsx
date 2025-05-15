"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { AltImages } from "./alt-text/alt-images";
import { HomeAppBar } from "../app-bar/app-bar";
import { ProductCamera } from "./product-camera";
import { Recommendation } from "./recommendation/recommendation";
import { UploadImageLanding } from "./upload-image-landing";
import { DressTypeSelection } from "./dress-type-selection";
import { generateRecommendationForOccasion, useRecommendation, resetAppStore } from "./store";
import { resetCamera } from "../real-time-page/camera/camera-store";
import { selfieAudio, occasionAudio } from "@/features/common/audio-player";

// Simple fade-in animation wrapper
const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="opacity-0 animate-fade-in"
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
  const [workflowStep, setWorkflowStep] = useState<"photo" | "dressType" | "recommendation">("photo");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedDressType, setSelectedDressType] = useState<string | null>(null);
  // const { isLoading: isRecommendationLoading } = useImageDescription(); // Get loading state

  // Play the appropriate audio when workflow step changes
  useEffect(() => {
    // Stop any currently playing audio
    selfieAudio.stop();
    occasionAudio.stop();
    
    // Play the appropriate audio for the current step
    if (workflowStep === "photo") {
      selfieAudio.play();
    } else if (workflowStep === "dressType") {
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
    setWorkflowStep("dressType");
  };

  const handleDressTypeSelected = async (dressType: string) => {
    setSelectedDressType(dressType);
    setWorkflowStep("recommendation");
    if (capturedImage) {
      await generateRecommendationForOccasion(capturedImage, dressType);
    }
  };

  return (
    <div className=" h-svh max-h-svh text-slate-500">
      <HomeAppBar />
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col pt-36 min-h-full gap-6">
        {workflowStep === "photo" && (
          <FadeIn>
            <>
              <h1 className="text-2xl font-semibold text-center text-slate-700">
                Start by taking a selfie<br />
                (click anywhere to take a photo)
              </h1>
              <div className="flex flex-col pt-10 justify-center items-center w-full">
                {/* Pass handlePhotoTaken to ProductCamera */}
                <ProductCamera onPhotoCaptured={handlePhotoTaken} />
                {/* <div className="mt-4"> */}
                  {/* Pass handlePhotoTaken to UploadImageLanding if it also handles image capture */}
                  {/* <UploadImageLanding onImageUploaded={handlePhotoTaken} /> */}
                {/* </div> */}
              </div>
            </>
          </FadeIn>
        )}

        {workflowStep === "dressType" && capturedImage && (
          <FadeIn>
            <>
              <h1 className="text-2xl font-semibold text-center text-slate-700">
                Great! Now, what's the occasion?
              </h1>
              {/* Optionally display the captured image */}
              {/* <img src={capturedImage} alt="Captured forearm" className="mx-auto my-4 max-w-xs rounded-lg shadow-md" /> */}
              <DressTypeSelection onSelectDressType={handleDressTypeSelected} />
            </>
          </FadeIn>
        )}

        {workflowStep === "recommendation" && capturedImage && selectedDressType && (
          <FadeIn>
            <>
              {/* Pass capturedImage and selectedDressType to ImageDescription */}
              <Recommendation imageSrc={capturedImage} dressType={selectedDressType} />
            </>
          </FadeIn>
        )}

      </div>
      {/* <HomeAppBar /> */}
    </div>
  );
};
