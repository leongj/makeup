import { create } from "zustand";
import { generateImageAltText } from "./actions";

export type ImageItemState = {
  base64: string;
  url: string;
  isLoading: boolean;
  result: string;
  index: number;
};

type AppState = {
  files: FileList | null;
  images: ImageItemState[];
  loading: "idle" | "pending" | "success" | "error";
};

export const useAppStore = create<AppState>(() => ({
  files: null,
  loading: "idle",
  images: [],
}));

export const updateFiles = (files: FileList) => {
  useAppStore.setState((state) => ({ ...state, images: [] }));
  [...files].forEach((file, i) => {
    startGeneratingAltText(file, i);
  });
};

export const updateLoading = (loading: AppState["loading"]) => {
  useAppStore.setState({ loading });
};

const updateImageByIndex = (id: number, image: ImageItemState) => {
  const state = useAppStore.getState();
  // find the image by the id
  const index = state.images.findIndex((img) => img.index === id);

  if (index === -1) {
    state.images.push(image);
  } else {
    state.images[index] = image;
  }

  useAppStore.setState(() => ({ ...state, images: [...state.images] }));
};

const startGeneratingAltText = async (file: File, index: number) => {
  const imageItem: ImageItemState = {
    base64: "",
    url: "",
    isLoading: true,
    result: "",
    index,
  };

  const _file = await fileToBase64(file);
  imageItem.base64 = _file.base64;
  imageItem.url = _file.url;

  updateImageByIndex(index, imageItem);

  const _result = await generateImageAltText(_file.base64);
  imageItem.result = _result;
  imageItem.isLoading = false;
  updateImageByIndex(index, imageItem);
};

interface ImageDataEntry {
  url: string;
  base64: string;
}

export const fileToBase64 = (file: File): Promise<ImageDataEntry> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const url = URL.createObjectURL(file);

    reader.onload = () => resolve({ url, base64: reader.result as string });
    reader.onerror = (error) => reject(error);
  });
};
