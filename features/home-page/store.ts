import { ReactNode } from "react";
import { create } from "zustand";
import { generateImageAltText, generateImageDescription } from "./actions";
import { DescriptionSystemPrompt } from "./prompts";

export type ImageItemState = {
  base64: string;
  url: string;
  isLoading: boolean;
  result: string;
  index: number;
};

export type ImageDescriptionState = {
  isLoading: boolean;
  description: ReactNode;
  system: string;
};

type AppState = {
  files: FileList | null;
  images: ImageItemState[];
  imageDescription: ImageDescriptionState;
  loading: "idle" | "pending" | "success" | "error";
  sectionIsOpen: boolean;
  section?: ReactNode;
};

const initialState: AppState = {
  files: null,
  images: [],
  imageDescription: {
    isLoading: false,
    description: "",
    system: DescriptionSystemPrompt,
  },
  loading: "idle",
  sectionIsOpen: false,
  section: null,
};

export const useAppStore = create<AppState>(() => initialState);

export const updateFiles = async (files: FileList) => {
  useAppStore.setState((state) => ({
    ...initialState,
    files,
    imageDescription: {
      ...state.imageDescription,
      description: "",
      isLoading: true,
    },
  }));

  const items = [...files].map((file, i) => {
    return startGeneratingAltText(file, i);
  });

  await Promise.all(items);

  startGeneratingDescription();
};

export const updateLoading = (loading: AppState["loading"]) => {
  useAppStore.setState({ loading });
};

export const updateSection = (section: ReactNode) => {
  useAppStore.setState({ section });
};

export const updateSystemPrompt = (system: string) => {
  useAppStore.setState((state) => ({
    ...state,
    imageDescription: { ...state.imageDescription, system },
  }));
};

const startGeneratingDescription = async () => {
  const state = useAppStore.getState();
  const images = state.images.map((image) => image.base64);
  useAppStore.setState(() => ({
    ...state,
    imageDescription: { ...state.imageDescription, isLoading: true },
  }));

  try {
    const result = await generateImageDescription({
      images,
      system: state.imageDescription.system,
    });

    useAppStore.setState(() => ({
      ...state,
      imageDescription: {
        ...state.imageDescription,
        isLoading: false,
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
