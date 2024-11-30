"use client";
import * as motion from "motion/react-client";
import { useAltImages } from "./store";

const TagLine =
  "Generate alt text and descriptions for images using Azure OpenAI";

export const Header = () => {
  const images = useAltImages();

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="py-4 shadow-2xl shadow-slate-300/25 flex gap-6">
      <motion.img
        initial={{ opacity: 0, y: -10, scale: 0.8, rotate: 0 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: -22 }}
        src="/icon-192x192.png"
        className="size-14 inline-block"
      />
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-4xl font-semibold"
        >
          Focal
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
    <div className="flex-1 items-center justify-center flex flex-col">
      <div className="grid grid-cols-12 gap-8 container mx-auto max-w-xl ">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 items-center col-start-2 col-span-10 text-6xl bg-green-50 font-semibold bg-gradient-to-r from-violet-500  to-blue-500 bg-clip-text text-transparent"
        >
          <motion.img
            initial={{ opacity: 0, y: -10, scale: 0.8, rotate: 0 }}
            animate={{ opacity: 1, y: 0, scale: [1.5, 1], rotate: -22 }}
            transition={{ delay: 0.2 }}
            src="/icon-192x192.png"
            className="size-20 inline-block"
          />
          <span> Focal</span>
        </motion.h1>
        <motion.h4
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-start-2 col-span-10 self-start text-slate-600 text-balance"
        >
          {TagLine}
        </motion.h4>
      </div>
    </div>
  );
};
