"use client";

import { motion } from "framer-motion";
import { Loading } from "../common/loading";
import { ImageItemState, useAppStore } from "./store";

export const AltImages = () => {
  const images = useAppStore((state) => state.images);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="text-2xl">Images</h1>

      <motion.div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {images.map((file, i) => (
          <ImageItem key={i} image={file} />
        ))}
      </motion.div>
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
      className="bg-slate-50 rounded-xl p-6 text-sm flex flex-col gap-5 border shadow-md shadow-slate-200"
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
          className="text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {image.result}
        </motion.p>
      )}
    </motion.div>
  );
};
