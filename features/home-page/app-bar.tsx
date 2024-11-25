"use client";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { CameraIcon, ImageIcon, SettingsIcon } from "./app-icons";

export const AppBar = () => {
  return (
    <div className="fixed left-0 bottom-0 w-full flex justify-center p-3  ">
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden flex gap-2 bg-slate-900/30 backdrop-blur-2xl rounded-3xl p-2 px-3 border border-slate-700/20 "
      >
        <AppBarButton>
          <CameraIcon />
        </AppBarButton>
        <AppBarButton>
          <ImageIcon />
        </AppBarButton>
        <AppBarButton>
          <SettingsIcon />
        </AppBarButton>
      </motion.div>
    </div>
  );
};

const AppBarButton = ({ children }: PropsWithChildren) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 45 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden group rounded-2xl hover:bg-slate-800/45 transition-all duration-500 outline-none focus:ring-2 ring-violet-500"
    >
      <span className="block p-3 group-hover:scale-125 transform transition-transform duration-300">
        {children}
      </span>
    </motion.button>
  );
};
