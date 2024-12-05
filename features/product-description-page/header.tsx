"use client";
import { ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";
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
    <div className="items-center justify-center flex gap-6">
      <motion.img
        initial={{ opacity: 0, y: -10, scale: 0.8, rotate: 0 }}
        animate={{ opacity: 1, y: 0, scale: [1.5, 1], rotate: -22 }}
        transition={{ delay: 0.2 }}
        src="/icon-192x192.png"
        className="size-20 inline-block"
      />
      <div className="flex gap-3 flex-col text-balance">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 items-center col-start-2 col-span-10 text-6xl font-semibold bg-gradient-to-r from-violet-500  to-blue-500 bg-clip-text text-transparent"
        >
          <span> Focal</span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl "
        >
          Demo powered by{" "}
          <span className="font-semibold bg-gradient-to-r from-violet-500  to-blue-500 bg-clip-text text-transparent">
            Azure OpenAI
          </span>
        </motion.h1>
      </div>
    </div>
  );
};

export const Links = () => {
  const links = [
    {
      name: "Product Description",
      link: "/product-description",
    },
    {
      name: "Realtime",
      link: "/real-time",
    },
  ];

  return (
    <div className="flex gap-4 py-6">
      {links.map((link) => (
        <MotionLink
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          href={link.link}
          key={link.name}
          className="group p-2 px-4 bg-white hover:bg-violet-100 hover:text-violet-500 transition-all shadow-lg rounded-full border-violet-600/45 border-2 text-sm flex gap-2 items-center"
        >
          {link.name}
          <ArrowRight
            size={16}
            className="text-violet-600 transform group-hover:scale-125 transition-transform duration-200"
          />
        </MotionLink>
      ))}
    </div>
  );
};

const MotionLink = motion.create(Link);
