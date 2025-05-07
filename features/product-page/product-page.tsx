import { AltImages } from "./alt-text/alt-images";
import { HomeAppBar } from "./app-bar/app-bar";
import { ProductCamera } from "./product-camera";
import { ImageDescription } from "./product-description/product-description";
import { UploadImageLanding } from "./upload-image-landing";

export const ProductPage = async () => {
  return (
    <div className=" h-svh max-h-svh text-slate-500">
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col pb-28 pt-10 min-h-full gap-6">
        <h1 className="text-2xl font-semibold text-center text-slate-700">
          Let's start by taking a photo of your forearm<br />
          (click the image to take a photo)
        </h1>
        <div className="flex flex-col justify-center items-center w-full">
          <ProductCamera />
          <div className="mt-4">
            <UploadImageLanding />
          </div>
        </div>
        {/* <AltImages /> */}
        <ImageDescription />
      </div>
      <HomeAppBar />
    </div>
  );
};
