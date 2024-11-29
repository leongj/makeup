"use client";

import { Loading } from "../common/loading";
import { useAppStore } from "./store";

export const ImageDescription = () => {
  const images = useAppStore((state) => state.images);
  const imageDescription = useAppStore((state) => state.imageDescription);
  const isLoading = useAppStore((state) => state.imageDescription.isLoading);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl text-slate-200">Image Description</h1>

      <div className="container mx-auto max-w-2xl flex flex-col">
        {imageDescription.description}
        {isLoading && <Loading />}
      </div>
    </div>
  );
};
