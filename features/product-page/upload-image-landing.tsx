"use client";

import { ImageIcon } from "../ui/app-icons";
import { useAppStore } from "./store";

export const UploadImageLanding = () => {
  const uploadRef = useAppStore((state) => state.uploadRef);
  const altImages = useAppStore((state) => state.altImages);

  if (altImages.length) {
    return null;
  }

  return (
    <div className="flex items-center justify-center flex-1">
      <div
        onClick={() => {
          uploadRef?.click();
        }}
        className="border border-violet-500 rounded-xl p-10 bg-violet-100 aspect-square min-w-[30%] text-violet-500 flex flex-col gap-8 justify-center items-center"
      >
        <ImageIcon size={100} />
        <span className="text-sm">Click here to upload product images</span>
      </div>
    </div>
  );
};
