import { RealtimeAppBar } from "./app-bar/app-bar";
import { Camera } from "./camera/camera";

export const RealTimePage = () => {
  return (
    <div className=" h-svh max-h-svh text-slate-500">
      <Camera />
      <RealtimeAppBar />
    </div>
  );
};
