import { LandingPage, Links } from "../product-page/header";

export const HomePage = async () => {
  return (
    <div className=" h-svh max-h-svh text-slate-500">
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col pb-28  min-h-full items-center justify-center gap-6">
        <LandingPage />
        <Links />
      </div>
    </div>
  );
};
