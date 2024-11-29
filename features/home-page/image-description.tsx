"use client";

import { useAppStore } from "./store";

export const ImageDescription = () => {
  const images = useAppStore((state) => state.images);
  const imageDescription = useAppStore((state) => state.imageDescription);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl ">Image Description</h1>

      <div className="container mx-auto max-w-2xl flex flex-col">
        {imageDescription.description}
      </div>
    </div>
  );
};
