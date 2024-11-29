import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { ButtonHTMLAttributes, useState } from "react";
import { updateSystemPrompt, useAppStore } from "./store";

export const SettingsSection = () => {
  const system = useAppStore((state) => state.imageDescription.system);
  const [localSystem, setLocalSystem] = useState(system);
  return (
    <motion.div
      initial={{ opacity: 0, y: 45 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
      className="flex flex-col gap-2 overflow-hidden"
    >
      <div className="flex justify-end py-2">
        <ActionButton
          onClick={() => {
            useAppStore.setState({ section: null });
          }}
        >
          <X />
        </ActionButton>
      </div>

      <textarea
        rows={8}
        onChange={(e) => {
          setLocalSystem(e.target.value);
        }}
        defaultValue={system}
        className="w-[80svw] md:w-[70svw] xl:w-[30svw] p-3 bg-transparent rounded-2xl text-slate-500 resize-none focus:bg-slate-100  focus:ring-0 focus:ring-slate-500 focus:outline-none"
        placeholder="System prompt.."
      />
      <div className="py-2">
        <ActionButton
          onClick={() => {
            updateSystemPrompt(localSystem);
            useAppStore.setState({ section: null });
          }}
        >
          <Save size={18} /> <span>Save</span>
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
      className="flex gap-2 text-slate-500 items-center hover:text-violet-500 border-slate-400 p-2 rounded-md border"
      {...props}
    >
      {children}
    </button>
  );
};
