"use client";

import { useEffect } from "react";
import { useAltImages, useRecommendation } from "../store";
import { dressTypeLabels } from "../dress-types";
import { speakText } from "../../common/speech";

interface RecommendationProps {
  imageSrc: string | null;
  dressType: string | null;
}

export const Recommendation: React.FC<RecommendationProps> = ({
  imageSrc,
  dressType,
}) => {
  const images = useAltImages(); // This might be for alternative images, not the main one
  const recommendation = useRecommendation(); // This is likely where the AI description will live

  useEffect(() => {
    speakText("here's your recommendation");
  }, []);

  // log the image description as it is being generated
  useEffect(() => {
    if (recommendation.text) {
      console.log("Image description:", recommendation.text);
    }
  }, [recommendation.text]);

  // For now, let's display the passed props and the store content if available
  // We'll need to integrate the actual recommendation fetching logic later

  if (!imageSrc && images.length === 0) {
    return (
      <div className="text-center text-slate-500">
        Generating AI recommendation...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 items-center">
      {/* {imageSrc && (
        <div className="mb-4">
          <img
            src={imageSrc}
            alt="Captured selfie"
            className="rounded-lg shadow-md max-w-xs mx-auto"
          />
        </div>
      )} */}
      {/* {dressType && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Occasion:
          </h2>
          <p className="text-lg text-slate-600 text-center">
            {dressTypeLabels[dressType] || dressType}
          </p>
        </div>
      )} */}

      {/* Display chosen product here */}

      {/* AI Recommendation: */}
      <h2 className="text-2xl font-semibold text-red-700">
        AI Recommendation:
      </h2>
      {recommendation.text ? (
        <div className="container mx-auto max-w-xl flex flex-col px-4 rounded-lg">
          {recommendation.text}
        </div>
      ) : (
        <p className="text-slate-900">
          {imageSrc && dressType
            ? "Generating recommendation..."
            : "Please complete previous steps."}
        </p>
      )}
    </div>
  );
};
