"use client";
import { AnimatePresence, motion } from "motion/react";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../common/util";

interface Props extends PropsWithChildren {
  section?: React.ReactNode;
}

export const AppBar = (props: Props) => {
  const { section, children } = props;
  return (
    <div className="fixed left-0 bottom-0 w-full flex justify-center p-4  ">
      <motion.div
        layout
        initial={{ opacity: 0, y: 45 }}
        animate={{
          opacity: 1,
          y: 0,
          borderRadius: section ? 20 : 9000,
          transition: {
            borderRadius: {
              duration: 0.1,
            },
          },
        }}
        className={cn(
          "overflow-hidden flex-col flex items-center gap-6 px-4 py-3 bg-white rounded-full shadow-lg"
        )}
      >
        <AnimatePresence>{section}</AnimatePresence>
        <motion.div layout className="flex gap-2 items-center justify-center">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const AppBarButton = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="overflow-hidden group rounded-2xl  hover:bg-violet-400/30 transition-all duration-500 outline-none focus:ring-2 ring-violet-500"
      {...props}
    >
      <span className="block p-3 group-hover:scale-125 transform transition-transform duration-300">
        {children}
      </span>
    </button>
  );
};
