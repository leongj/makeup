"use client";
import { ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAltImages } from "./store";
import { useEffect } from "react";

const TagLine = "A demo powered by Microsoft AI";

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

  return (
    <div className="items-center justify-center py-10 flex gap-0">
      <motion.img
        initial={{ opacity: 0, y: -10, scale: 0.8, rotate: 0 }}
        animate={{ opacity: 1, y: 0, scale: [1.7, 1], rotate: 20 }} // Changed rotate to 45
        transition={{ delay: 0.2 }}
        src="/icon-crop.png"
        alt="Lipstick icon"
        className="size-24 inline-block object-contain"
      />
      <div className="flex gap-3 flex-col text-balance">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 italic items-center col-start-2 col-span-10 text-6xl font-semibold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent" // Changed to red gradient
        >
          <span>Lipstick</span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl "
        >
          A demo by{" "}
          <span className="font-semibold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
            Microsoft AI
          </span>
        </motion.h1>
      </div>
    </div>
  );
};

export const Links = () => {
  const router = useRouter();

  const handleStartClick = () => {
    router.push("/product");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      <motion.p
        initial={{ opacity: 1, clipPath: "inset(0 100% 0 0)" }}
        animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
        transition={{ delay: 1 }}
        className="text-2xl font-semibold text-red-600 mt-6 mb-4"
      >
        Let's find your perfect colour
      </motion.p>
      <motion.div
        initial={{ opacity: 1, clipPath: "inset(0 100% 0 0)" }}
        animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
        transition={{ delay: 1.2 }}
      >
        <button
          onClick={handleStartClick}
          className="px-6 py-3 text-xl bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Tap to start <ArrowRight className="inline ml-2" />
        </button>
      </motion.div>
    </div>
  );
};
