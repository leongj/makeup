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
    <div className="fixed left-0 top-0 w-full flex justify-center p-4 z-50 ">
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
        <motion.div
          layout
          className="flex gap-1 items-center justify-center relative"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const AppBarButton = ({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "select-none overflow-hidden group rounded-full items-center justify-center flex  hover:bg-red-400/30 transition-all duration-500 outline-none focus:ring-2 ring-red-500",
        className
      )}
      {...props}
    >
      <span className="flex gap-2 p-1 text-xs items-center text-red-400 hover:text-red-700">
        {children}
      </span>
    </button>
  );
};
