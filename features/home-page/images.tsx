"use client";

import { motion } from "framer-motion";
import { ImageItemState, useAppStore } from "./store";

export const Images = () => {
  const images = useAppStore((state) => state.images);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl text-slate-200">Images</h1>
      <h4 className="text-sm">
        Alt descriptions are generated using Azure OpenAI{" "}
        <span className="p-[2px] px-2 rounded-full bg-slate-600">GPT-4o</span>
      </h4>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {images.map((file, i) => (
          <ImageItem key={i} image={file} />
        ))}
      </div>
    </div>
  );
};

export const ImageItem = (props: { image: ImageItemState }) => {
  const { image } = props;

  return (
    <motion.div
      key={image.index}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800/40 rounded-xl p-6 text-sm flex flex-col gap-5 border border-slate-800  "
    >
      <motion.picture
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
      >
        <img className="rounded-lg" src={image.url} alt={image.base64} />
      </motion.picture>
      {image.isLoading ? (
        <Loading />
      ) : (
        <motion.p
          className="text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {image.result}
        </motion.p>
      )}
    </motion.div>
  );
};

export const Loading = () => {
  return (
    <motion.div className="flex gap-1 rounded-2xl bg-slate-700 self-start p-2">
      <LoadingItem delay={0} />
      <LoadingItem delay={0.3} />
      <LoadingItem delay={0.5} />
    </motion.div>
  );
};

const LoadingItem = (props: { delay: number }) => {
  const { delay = 0 } = props;
  return (
    <motion.span
      animate={{ y: [0, -1.5, 0, 1.5, 0] }}
      transition={{
        repeat: Infinity,
        duration: 0.8,
        delay,
      }}
      className="size-1 bg-slate-50 rounded-full"
    ></motion.span>
  );
};
