"use client";
import { LandingPage, Links } from "../product-page/header";
import { useRouter } from "next/navigation"; // Added import

// Ensure the app state is reset when navigating to the home page
import { useEffect } from "react";
import { resetAppStore } from "@/features/product-page/store";
import { welcomeAudio } from "@/features/common/audio-player";

export const HomePage = () => {
  const router = useRouter(); // Added router

  useEffect(() => {
    resetAppStore();

    // Play welcome audio when component mounts
    welcomeAudio.play();
    
    // Clean up audio when component unmounts
    return () => {
      welcomeAudio.stop();
    };
  }, []);

  const handleNavigation = () => {
    router.push("/product");
  };

  return (
    <div
      className="h-svh max-h-svh text-slate-500 cursor-pointer" // Added cursor-pointer
      onClick={handleNavigation} // Added onClick handler
    >
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col min-h-full items-center justify-center gap-6">
        <LandingPage />
        <Links />
      </div>
    </div>
  );
};
