import { motion } from "framer-motion";

export const Loading = () => {
  return (
    <motion.span className="flex gap-1 rounded-2xl bg-slate-700 place-self-start p-2">
      <LoadingItem delay={0} />
      <LoadingItem delay={0.3} />
      <LoadingItem delay={0.5} />
    </motion.span>
  );
};

export const LoadingItem = (props: { delay: number }) => {
  const { delay = 0 } = props;
  return (
    <motion.span
      animate={{ y: [0, -1.5, 0, 1.5, 0] }}
      transition={{
        repeat: Infinity,
        duration: 0.8,
        delay,
      }}
      className="size-1 bg-slate-50 rounded-full "
    ></motion.span>
  );
};
