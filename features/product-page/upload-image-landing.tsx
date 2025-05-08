"use client";

import { UploadIcon } from "../ui/app-icons";
import { useAppStore, setUploadRef } from "./store"; // Added setUploadRef import
import { useCameraStore } from "../real-time-page/camera/camera-store";
import React from "react"; // Import React for FileChangeEventHandler

interface UploadImageLandingProps {
  onImageUploaded?: (imageSrc: string) => void; // Added prop
}

export const UploadImageLanding: React.FC<UploadImageLandingProps> = ({ onImageUploaded }) => {
  const uploadRef = useAppStore((state) => state.uploadRef);
  const altImages = useAppStore((state) => state.altImages);
  const screenshot = useCameraStore((s) => s.screenshot);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        if (onImageUploaded) {
          onImageUploaded(base64Image);
        }
        // Optionally, you might want to call updateFiles from store here as well
        // if the existing updateFiles logic is still relevant for uploads.
        // For now, just passing to ProductPage.
      };
      reader.readAsDataURL(file);
    }
  };

  if (altImages.length || screenshot) {
    return null;
  }

  return (
    <div className="flex items-center justify-center flex-1">
      <input
        type="file"
        ref={(node) => {
          if (node) setUploadRef(node); // Assuming setUploadRef is still needed from your store
        }}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange} // Call handler on change
      />
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
