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

export const processCapture = async (capturedImageBase64: string) => {
  // Reset state and prepare for new image processing
  useAppStore.setState((state) => ({
    ...initialState,
    files: null,
    altImages: [],
    imageDescription: { ...state.imageDescription, description: "" },
  }));
  // Create new image entry for the captured image
  const capturedImageItem: ImageItemState = {
    base64: capturedImageBase64,
    url: capturedImageBase64, // Assuming the base64 string can also serve as a URL/identifier here
    isLoading: true, // Will be set to false after alt text generation (if any)
    result: "", // Placeholder for alt text
    index: 0,
  };
  updateImageByIndex(0, capturedImageItem);

  // Process the captured image (e.g., generate alt text)
  try {
    // const altResult = await generateImageAltText(capturedImageBase64);
    // capturedImageItem.result = altResult;
    capturedImageItem.isLoading = false; // Assuming direct use or alt text is handled elsewhere/skipped for now
    updateImageByIndex(0, capturedImageItem);
  } catch (error) {
    console.error("Error processing captured image for alt text:", error);
    capturedImageItem.isLoading = false;
    updateImageByIndex(0, capturedImageItem); // Ensure loading state is updated even on error
  }

  // Fetch and process the static image /ct-hotlips.jpg
  try {
    const staticImageData = await urlToBase64("/ct-hotlips.jpg");
    const staticImageItem: ImageItemState = {
      base64: staticImageData.base64,
      url: staticImageData.url,
      isLoading: false, // Static image, no async processing needed here
      result: "CT Hotlips product image", // Predefined alt text
      index: 1, // Assign a new index
    };
    updateImageByIndex(1, staticImageItem);
  } catch (error) {
    console.error("Error processing static image /ct-hotlips.jpg:", error);
    // Optionally, handle the error, e.g., by not adding the image or adding a placeholder
  }

  // Trigger product description generation
  startGeneratingDescription();
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

export const urlToBase64 = async (imageUrl: string): Promise<ImageDataEntry> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for ${imageUrl}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: imageUrl, base64: reader.result as string });
      };
      reader.onerror = (error) => {
        console.error("FileReader error in fetchAndConvertToBase64:", error);
        reject(new Error(`FileReader error for ${imageUrl}: ${error.toString()}`));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Error fetching or converting image ${imageUrl}:`, error);
    throw error; // Re-throw to be caught by the caller
  }
};
