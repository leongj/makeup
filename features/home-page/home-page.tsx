import { AltImages } from "./alt-images";
import { ImageDescription } from "./image-description";

export const HomePage = () => {
  return (
    <div className=" h-svh max-h-svh">
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col gap-4 pb-40">
        <div className="py-8">
          <h1 className="text-4xl font-semibold">Focal</h1>
          <h4 className="text-sm">
            Generating alt text and descriptions for images using Azure OpenAI
          </h4>
        </div>
        <AltImages />
        <ImageDescription />
      </div>
    </div>
  );
};
