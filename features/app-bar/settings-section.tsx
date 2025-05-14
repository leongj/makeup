"use client";
import { Eraser, Save, Undo2, X } from "lucide-react";
import { motion } from "motion/react";
import { ButtonHTMLAttributes, useState } from "react";
import { DescriptionSystemPrompt } from "../product-page/recommendation/prompt";
import { updateSystemPrompt, useImageDescription } from "../product-page/store";
import { closeAppBarSection } from "./app-bar-store";

export const SettingsSection = () => {
  const system = useImageDescription().system;
  const [localSystem, setLocalSystem] = useState(system);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 45 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        height: 0,
        width: 0,
        y: 50,
        transition: {
          type: "easeInOut",
        },
      }}
      className="flex flex-col gap-2 overflow-hidden"
    >
      <div className="flex justify-end py-2">
        <ActionButton
          onClick={() => {
            closeAppBarSection();
          }}
        >
          <X size={16} />
        </ActionButton>
      </div>

      <textarea
        rows={8}
        onChange={(e) => {
          setLocalSystem(e.target.value);
        }}
        value={localSystem}
        className="w-[80svw] md:w-[70svw] xl:w-[30svw] p-3 bg-transparent rounded-2xl text-slate-500 resize-none focus:bg-slate-100  focus:ring-0 focus:ring-slate-500 focus:outline-none"
        placeholder="System prompt.."
      />
      <div className="py-2 flex gap-2 justify-end">
        <ActionButton
          onClick={() => {
            setLocalSystem(DescriptionSystemPrompt);
          }}
        >
          <Undo2 size={16} /> <span>Restore</span>
        </ActionButton>
        <ActionButton
          onClick={() => {
            setLocalSystem("");
          }}
        >
          <Eraser size={16} /> <span>Clear</span>
        </ActionButton>
        <ActionButton
          onClick={() => {
            updateSystemPrompt(localSystem);
            closeAppBarSection();
          }}
        >
          <Save size={16} /> <span>Save</span>
        </ActionButton>
      </div>
    </motion.div>
  );
};

export const ActionButton = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="flex gap-2 text-xs items-center text-violet-500 hover:text-violet-500 border-slate-400 p-2 rounded-md border"
      {...props}
    >
      {children}
    </button>
  );
};
