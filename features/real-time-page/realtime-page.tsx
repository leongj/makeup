import { Header } from "../home-page/header";
import { RealtimeAppBar } from "./app-bar/app-bar";

export const RealTimePage = () => {
  return (
    <div className=" h-svh max-h-svh text-slate-500">
      <div className="container max-w-4xl mx-auto xl:px-0 px-3 flex flex-col gap-4 pb-28  min-h-full">
        <Header />
      </div>
      <RealtimeAppBar />
    </div>
  );
};
