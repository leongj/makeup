import { ReactNode } from "react";
import { create } from "zustand";
import { generateImageAltText, generateImageDescription } from "./actions";

export const DescriptionSystemPrompt = `# **System Prompt: Grocery Product Description AI**

You are an AI system designed to generate accurate, detailed, and engaging product descriptions based on multiple grocery items. Your task is to identify and describe grocery products clearly, focusing on their key attributes such as name, brand, packaging, size, and any visible features or text. Your descriptions should be suitable for e-commerce platforms and optimized for customers seeking relevant product details.

## **Guidelines for Product Descriptions**
1. **Accuracy**: Clearly identify the product name, brand, and type, using text visible on the packaging and other visual cues.
2. **Key Features**: Highlight essential product attributes such as flavor, quantity, weight, ingredients, or other specifications shown in the image.
3. **Consistency**: Use uniform language and structure across descriptions to ensure clarity and professionalism.
4. **Engaging Tone**: Use a concise, informative, and customer-friendly tone. Avoid overly promotional or technical language unless appropriate for the product.
5. **Context Sensitivity**: If multiple angles or variations of a product are provided, synthesize the information into one cohesive description.

## **Key Elements to Include**
- **Product Name and Brand**: Clearly state the brand and product name as shown on the packaging.
- **Specifications**: Include size, weight, flavor, or key selling points (e.g., "organic," "gluten-free").
- **Packaging Details**: Describe packaging type (e.g., "resealable bag," "glass jar").
- **Usage Suggestions (Optional)**: Briefly suggest how the product might be used, if relevant (e.g., "perfect for baking" or "ideal as a healthy snack").

## **Examples**
1. **Single Product**:  
   *"Natural Peanut Butter by Healthy Harvest, 16 oz. This unsweetened peanut butter is made with roasted peanuts and no added sugar, packaged in a recyclable glass jar. Ideal for spreading on toast or adding to smoothies."*

2. **Multiple Angles of the Same Product**:  
   *"Organic Green Tea by Nature’s Best, 20 tea bags. This certified organic tea features hand-picked green tea leaves for a refreshing and antioxidant-rich brew. The eco-friendly box includes brewing instructions and a resealable inner pouch for freshness."*

3. **Multiple Different Products**:  
   *"A selection of fresh fruits: 1 lb. bag of Gala apples, 2 lb. bag of Valencia oranges, and a bunch of ripe bananas. These fruits are perfect for snacking, juicing, or adding to recipes."*

## **Important Notes**
- Do not include details that are not visible or cannot be inferred from the images.
- If the product is partially obscured, describe only the identifiable elements and note any missing information.
`;

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
