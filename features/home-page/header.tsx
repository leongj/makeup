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
    <div className="py-4 fixed w-full top-0 left-0 backdrop-blur-3xl bg-slate-100/50 shadow-2xl shadow-slate-300/25">
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-semibold"
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
      <div className="flex flex-col gap-4 container mx-auto max-w-xl ">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="self-start text-6xl font-semibold bg-gradient-to-r from-violet-500  to-blue-500 bg-clip-text text-transparent"
        >
          Focal
        </motion.h1>
        <motion.h4
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 text-balance"
        >
          {TagLine}
        </motion.h4>
      </div>
    </div>
  );
};
