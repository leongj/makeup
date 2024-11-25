"use client";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { CameraIcon, ImageIcon, SettingsIcon } from "./app-icons";

export const AppBar = () => {
  return (
    <div className=" absolute bottom-0 w-full flex justify-center p-3 backdrop-blur-md">
      <div className="overflow-hidden flex gap-2 bg-slate-900 rounded-3xl p-2 px-3 border border-slate-800">
        <AppBarButton>
          <CameraIcon />
        </AppBarButton>
        <AppBarButton>
          <ImageIcon />
        </AppBarButton>
        <AppBarButton>
          <SettingsIcon />
        </AppBarButton>
      </div>
    </div>
  );
};

const AppBarButton = ({ children }: PropsWithChildren) => {
  return (
    <motion.button
      initial={{ scale: 0.5, opacity: 0, y: 5 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{}}
      className="group flex items-center justify-center p-3 rounded-2xl hover:bg-slate-800/45 transition-all duration-500 outline-none focus:ring-2 ring-violet-500"
    >
      <span className="group-hover:scale-125 transform transition-transform duration-300">
        {children}
      </span>
    </motion.button>
  );
};
