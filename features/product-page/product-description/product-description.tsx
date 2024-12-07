"use client";

import { useAltImages, useImageDescription } from "../store";

export const ImageDescription = () => {
  const images = useAltImages();
  const imageDescription = useImageDescription();

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl font-medium tracking-tight">
        Product Description
      </h1>

      <div className="container mx-auto max-w-2xl flex flex-col">
        {imageDescription.description}
      </div>
    </div>
  );
};
