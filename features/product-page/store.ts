import { ReactNode } from "react";
import { create } from "zustand";

import { generateImageAltText } from "./alt-text/actions-alt-text";
import { generateRecommendation } from "./recommendation/actions-recommendation";
import { RecommendationSystemPrompt } from "./recommendation/prompt";
import { Loading } from "../common/loading";

export type ImageItemState = {
  base64: string;
  url: string;
  isLoading: boolean;
  result: string;
  index: number;
};

export type ImageDescriptionState = {
  text: ReactNode;
  system: string;
  isLoading: boolean; // Added isLoading
};

type AppState = {
  uploadRef: HTMLInputElement | null;
  files: FileList | null;
  altImages: ImageItemState[];
  recommendation: ImageDescriptionState;
  speechInput: string;
};

const initialState: AppState = {
  files: null,
  uploadRef: null,
  altImages: [],
  recommendation: {
    text: "",
    system: RecommendationSystemPrompt,
    isLoading: false, // Initialized isLoading
  },
  speechInput: "",
};

export const useAppStore = create<AppState>(() => initialState);

export const useAltImages = () => {
  return useAppStore((state) => state.altImages);
};

export const useRecommendation = () => {
  return useAppStore((state) => state.recommendation);
};

export const useSpeechInput = () => useAppStore((state) => state.speechInput);

export const setSpeechInput = (input: string) => {
  useAppStore.setState((state) => ({ ...state, speechInput: input }));
};

export const resetSpeechInput = () => {
  useAppStore.setState((state) => ({ ...state, speechInput: "" }));
};

export const setUploadRef = (ref: HTMLInputElement) => {
  useAppStore.setState((state) => ({ ...state, uploadRef: ref }));
};

export const updateFiles = async (files: FileList) => {
  useAppStore.setState((state) => ({
    ...initialState,
    files,
    recommendation: {
      ...state.recommendation,
      text: "",
    },
  }));

  const items = [...files].map((file, i) => {
    return startGeneratingAltText(file, i);
  });

  await Promise.all(items);

  startGeneratingRecommendation();
};

export const updateSystemPrompt = (system: string) => {
  useAppStore.setState((state) => ({
    ...state,
    recommendation: { ...state.recommendation, system },
  }));
};

// Reset the app state to its initial values (useful when navigating home)
export const resetAppStore = () => {
  useAppStore.setState(() => initialState);
};

// New function to generate recommendation based on image and occasion
export const generateRecommendationForOccasion = async (base64Image: string, occasion: string) => {
  // Reset state and prepare for new image processing
  useAppStore.setState((state) => ({
    ...initialState,
    files: null,
    altImages: [],
    recommendation: {
      ...state.recommendation,
      text: "", // Clear previous description
      isLoading: true,
    },
  }));

  // Create new image entry for the captured forearm image
  const capturedImageItem: ImageItemState = {
    base64: base64Image,
    url: base64Image,
    isLoading: false,
    result: "Forearm image for skin tone analysis",
    index: 0,
  };
  updateImageByIndex(0, capturedImageItem);

  // Fetch and process the static swatch image, just like in processCapture
  try {
    const staticImageData = await urlToBase64("/ct-hotlips-swatch.jpg");
    const staticImageItem: ImageItemState = {
      base64: staticImageData.base64,
      url: staticImageData.url,
      isLoading: false,
      result: "Product swatch image",
      index: 1,
    };
    updateImageByIndex(1, staticImageItem);
  } catch (error) {
    console.error("Error processing swatch image: ", error);
  }

  try {
    // Now we get both images from the altImages state
    const images = useAppStore.getState().altImages.map(image => image.base64);
    
    const result = await generateRecommendation({
      images: images, // Send both the forearm image and swatch product image
      occasion: occasion,
    });

    useAppStore.setState((state) => ({
      ...state,
      recommendation: {
        ...state.recommendation,
        text: result, // This is the streamable UI
        isLoading: false, // Set to false as the stream itself will complete
      },
    }));
  } catch (error) {
    console.error("Error generating recommendation:", error);
    useAppStore.setState((state) => ({
      ...state,
      recommendation: {
        ...state.recommendation,
        text: "Failed to generate recommendation.", // Show error message
        isLoading: false,
      },
    }));
  }
};

export const processCapture = async (capturedImageBase64: string) => {
  // Reset state and prepare for new image processing
  useAppStore.setState((state) => ({
    ...initialState,
    files: null,
    altImages: [],
    recommendation: { ...state.recommendation, text: "" },
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

  // Fetch and process the swatch image
  try {
    const staticImageData = await urlToBase64("/ct-hotlips-swatch.jpg");
    const staticImageItem: ImageItemState = {
      base64: staticImageData.base64,
      url: staticImageData.url,
      isLoading: false, // Static image, no async processing needed here
      result: "Product swatch image", // Predefined alt text
      index: 1, // Assign a new index
    };
    updateImageByIndex(1, staticImageItem);
  } catch (error) {
    console.error("Error processing swatch image:", error);
    // Optionally, handle the error, e.g., by not adding the image or adding a placeholder
  }

  // Trigger product description generation
  // startGeneratingDescription(); // We will call generateRecommendationForOccasion from ProductPage instead
};

const startGeneratingRecommendation = async () => {
  // This function might need to be re-evaluated or deprecated if
  // generateRecommendationForOccasion is the primary way to get descriptions.
  // For now, let's assume it might still be used by updateFiles flow.
  const state = useAppStore.getState();
  if (state.altImages.length === 0) {
    console.warn("startGeneratingRecommendation called with no images in altImages.");
    return;
  }
  useAppStore.setState((state) => ({
    ...state,
    recommendation: { ...state.recommendation, isLoading: true, text: "" },
  }));

  const images = state.altImages.map((image) => image.base64);

  try {
    const result = await generateRecommendation({
      images,
      // TODO: Decide how to handle 'occasion' for this flow or deprecate this function
      occasion: "general use", // Added a default occasion, this needs review
    });

    useAppStore.setState((state) => ({
      ...state,
      recommendation: {
        ...state.recommendation,
        text: result,
        isLoading: false,
      },
    }));
  } catch (error) {
    console.error(error);
    useAppStore.setState((state) => ({
      ...state,
      recommendation: {
        ...state.recommendation,
        text: "Failed to generate description.",
        isLoading: false,
      },
    }));
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
