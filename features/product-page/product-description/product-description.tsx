"use client";

import { useAltImages, useImageDescription } from "../store";
import { dressTypeLabels } from "../dress-types";

interface ImageDescriptionProps {
  imageSrc: string | null;
  dressType: string | null;
}

export const ImageDescription: React.FC<ImageDescriptionProps> = ({
  imageSrc,
  dressType,
}) => {
  const images = useAltImages(); // This might be for alternative images, not the main one
  const imageDescription = useImageDescription(); // This is likely where the AI description will live

  // For now, let's display the passed props and the store content if available
  // We'll need to integrate the actual recommendation fetching logic later

  if (!imageSrc && images.length === 0) {
    return (
      <div className="text-center text-slate-500">
        Waiting for image and dress type to generate recommendation...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 items-center">
      {imageSrc && (
        <div className="mb-4">
          <img
            src={imageSrc}
            alt="Captured forearm"
            className="rounded-lg shadow-md max-w-xs mx-auto"
          />
        </div>
      )}
      {dressType && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Occasion:
          </h2>
          <p className="text-lg text-slate-600 text-center">
            {dressTypeLabels[dressType] || dressType}
          </p>
        </div>
      )}

      <h2 className="text-xl font-semibold text-slate-700 mt-4 mb-2">
        AI Recommendation:
      </h2>
      {imageDescription.description ? (
        <div className="container mx-auto max-w-2xl flex flex-col bg-slate-50 p-4 rounded-lg shadow">
          {imageDescription.description}
        </div>
      ) : (
        <p className="text-slate-500">
          {imageSrc && dressType
            ? "Generating recommendation..."
            : "Please complete previous steps."}
        </p>
      )}
    </div>
  );
};
