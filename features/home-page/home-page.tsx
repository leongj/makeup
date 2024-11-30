import { AltImages } from "./alt-images";
import { Header, LandingPage } from "./header";
import { ImageDescription } from "./image-description";

export const HomePage = () => {
  return (
    <div className=" h-svh max-h-svh text-slate-500">
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col gap-4 py-28  min-h-full">
        <Header />
        <LandingPage />
        <AltImages />
        <ImageDescription />
      </div>
    </div>
  );
};
