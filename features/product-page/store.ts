import { ReactNode } from "react";
import { create } from "zustand";

import { generateImageAltText } from "./alt-text/actions-alt-text";
import { generateProductDescription } from "./product-description/actions-product-description";
import { DescriptionSystemPrompt } from "./product-description/prompt";

export type ImageItemState = {
  base64: string;
  url: string;
  isLoading: boolean;
  result: string;
  index: number;
};

export type ImageDescriptionState = {
  description: ReactNode;
  system: string;
};

type AppState = {
  uploadRef: HTMLInputElement | null;
  files: FileList | null;
  altImages: ImageItemState[];
  imageDescription: ImageDescriptionState;
};

const initialState: AppState = {
  files: null,
  uploadRef: null,
  altImages: [],
  imageDescription: {
    description: "",
    system: DescriptionSystemPrompt,
  },
};

export const useAppStore = create<AppState>(() => initialState);

export const useAltImages = () => {
  return useAppStore((state) => state.altImages);
};

export const useImageDescription = () => {
  return useAppStore((state) => state.imageDescription);
};

export const setUploadRef = (ref: HTMLInputElement) => {
  useAppStore.setState((state) => ({ ...state, uploadRef: ref }));
};

export const updateFiles = async (files: FileList) => {
  useAppStore.setState((state) => ({
    ...initialState,
    files,
    imageDescription: {
      ...state.imageDescription,
      description: "",
    },
  }));

  const items = [...files].map((file, i) => {
    return startGeneratingAltText(file, i);
  });

  await Promise.all(items);

  startGeneratingDescription();
};

export const updateSystemPrompt = (system: string) => {
  useAppStore.setState((state) => ({
    ...state,
    imageDescription: { ...state.imageDescription, system },
  }));
};

const startGeneratingDescription = async () => {
  const state = useAppStore.getState();
  const images = state.altImages.map((image) => image.base64);
  useAppStore.setState(() => ({
    ...state,
    imageDescription: { ...state.imageDescription },
  }));

  try {
    const result = await generateProductDescription({
      images,
      system: state.imageDescription.system,
    });

    useAppStore.setState(() => ({
      ...state,
      imageDescription: {
        ...state.imageDescription,
        description: result,
      },
    }));
  } catch (error) {
    console.error(error);
  }
};

const updateImageByIndex = (id: number, image: ImageItemState) => {
  const state = useAppStore.getState();
  // find the image by the id
  const index = state.altImages.findIndex((img) => img.index === id);

  if (index === -1) {
    state.altImages.push(image);
  } else {
    state.altImages[index] = image;
  }

  useAppStore.setState(() => ({ ...state, altImages: [...state.altImages] }));
};

const startGeneratingAltText = async (file: File, index: number) => {
  const imageItem: ImageItemState = {
    base64: "",
    url: "",
    isLoading: true,
    result: "",
    index,
  };

  try {
    const _file = await fileToBase64(file);
    imageItem.base64 = _file.base64;
    imageItem.url = _file.url;

    updateImageByIndex(index, imageItem);

    const _result = await generateImageAltText(_file.base64);
    imageItem.result = _result;
    imageItem.isLoading = false;
    updateImageByIndex(index, imageItem);
  } catch (error) {
    console.error(error);
  }
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
