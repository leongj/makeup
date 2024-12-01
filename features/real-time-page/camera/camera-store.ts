import { createRef } from "react";
import Webcam from "react-webcam";
import { create } from "zustand";

type CameraControlState = {
  screenshot?: string;
  shutterCount: number;
  webcamRef: React.RefObject<Webcam>;
  facingMode: "user" | "environment";
};

export const useCameraStore = create<CameraControlState>(() => ({
  facingMode: "environment",
  shutterCount: 0,
  webcamRef: createRef<Webcam>(),
}));

export const capture = () => {
  const screenshot = useCameraStore
    .getState()
    .webcamRef?.current?.getScreenshot();

  useCameraStore.setState((state) => ({
    ...state,
    screenshot: screenshot || undefined,
    shutterCount: state.shutterCount + 1,
  }));

  return screenshot;
};

export const clearScreenshot = () => {
  useCameraStore.setState((state) => ({
    ...state,
    screenshot: undefined,
  }));
};

export const toggleFacingMode = () => {
  useCameraStore.setState((state) => ({
    ...state,
    facingMode: state.facingMode === "user" ? "environment" : "user",
  }));
};

export const resetCamera = () => {
  useCameraStore.setState({ facingMode: "environment", screenshot: undefined });
  clearScreenshot();
};
