import { AltImages } from "./alt-images";
import { HomeAppBar } from "./app-bar/app-bar";
import { ImageDescription } from "./product-description";
import { UploadImageLanding } from "./upload-image-landing";

export const ProductDescriptionPage = async () => {
  return (
    <div className=" h-svh max-h-svh text-slate-500">
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col pb-28  min-h-full  gap-6">
        <UploadImageLanding />
        <AltImages />
        <ImageDescription />
      </div>
      <HomeAppBar />
    </div>
  );
};
