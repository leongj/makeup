"use client";
import { ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added import
import { useAltImages } from "./store";

const TagLine = "Demo powered by Microsoft AI";

export const Header = () => {
  const images = useAltImages();

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="py-4 shadow-2xl shadow-slate-300/25 flex gap-6">
      <motion.img
        initial={{ opacity: 0, y: -10, scale: 0.8, rotate: 0 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 45 }} // Changed rotate to 45
        src="/icon-192x192.png"
        className="size-14 inline-block"
      />
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-4xl font-semibold"
        >
          <span> Lipstick</span>
        </motion.h1>
        <motion.h4
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-slate-600"
        >
          {TagLine}
        </motion.h4>
      </div>
    </div>
  );
};

export const LandingPage = () => {
  const images = useAltImages();

  if (images.length !== 0) {
    return null;
  }

  return (
    <div className="items-center justify-center flex gap-0">
      <motion.img
        initial={{ opacity: 0, y: -10, scale: 0.8, rotate: 0 }}
        animate={{ opacity: 1, y: 0, scale: [1.7, 1], rotate: 20 }} // Changed rotate to 45
        transition={{ delay: 0.2 }}
        src="/icon-crop.png"
        className="size-24 inline-block object-contain"
      />
      <div className="flex gap-3 flex-col text-balance">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 items-center col-start-2 col-span-10 text-6xl font-semibold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent" // Changed to red gradient
        >
          <span>Lipstick</span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl "
        >
          Powered by{" "}
          <span className="font-semibold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
            Microsoft AI
          </span>
        </motion.h1>
      </div>
    </div>
  );
};

export const Links = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      <p className="text-2xl font-semibold text-red-600 mt-6 mb-4">Let's find your perfect colour</p>
      <p className="text-xl text-red-800">Tap anywhere to start</p>
    </div>
  );
};
