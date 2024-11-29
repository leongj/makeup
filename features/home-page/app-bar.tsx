"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ButtonHTMLAttributes } from "react";
import { CameraIcon, SettingsIcon } from "./app-icons";
import { SettingsSection } from "./settings-section";
import { useAppStore } from "./store";
import { UploadImage } from "./upload-file";

export const AppBar = () => {
  const section = useAppStore((state) => state.section);
  return (
    <div className="fixed left-0 bottom-0 w-full flex justify-center p-3  ">
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden flex flex-col gap-2 shadow-slate-200 bg-slate-50/80 backdrop-blur-sm rounded-3xl p-2 px-3 border-2 border-slate-200"
      >
        <AnimatePresence mode="popLayout"> {section}</AnimatePresence>

        <div className="flex gap-2 items-center justify-center">
          <AppBarButton>
            <CameraIcon />
          </AppBarButton>
          <UploadImage />
          <AppBarButton
            onClick={() => {
              useAppStore.setState({ section: <SettingsSection /> });
            }}
          >
            <SettingsIcon />
          </AppBarButton>
        </div>
      </motion.div>
    </div>
  );
};

export const AppBarButton = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 45 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden group rounded-2xl hover:bg-violet-400/30 transition-all duration-500 outline-none focus:ring-2 ring-violet-500"
      {...props}
    >
      <span className="block p-3 group-hover:scale-125 transform transition-transform duration-300">
        {children}
      </span>
    </motion.button>
  );
};
