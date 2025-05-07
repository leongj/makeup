"use client";

import { UploadIcon } from "../ui/app-icons";
import { useAppStore } from "./store";
import { useCameraStore } from "../real-time-page/camera/camera-store";

export const UploadImageLanding = () => {
  const uploadRef = useAppStore((state) => state.uploadRef);
  const altImages = useAppStore((state) => state.altImages);
  const screenshot = useCameraStore((s) => s.screenshot);

  if (altImages.length || screenshot) {
    return null;
  }

  return (
    <div className="flex items-center justify-center flex-1">
      <div
        onClick={() => {
          uploadRef?.click();
        }}
        className="border border-violet-500 rounded-xl p-4 bg-violet-100 min-w-[30%] text-violet-500 flex flex-row gap-4 justify-center items-center"
      >
        <UploadIcon size={24} />
        <span className="text-sm">Upload image</span>
      </div>
    </div>
  );
};
