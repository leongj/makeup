import { createAI } from "ai/rsc";
import { generateProductDescription } from "./product-description/actions-product-description";

// Create the AI provider with the initial states and allowed actions
export const AI = createAI({
  initialAIState: [],
  initialUIState: [],
  actions: {
    generateImageDescription: generateProductDescription,
  },
});
