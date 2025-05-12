import { createAI } from "ai/rsc";
import { generateRecommendation } from "./recommendation/actions-recommendation";

// Create the AI provider with the initial states and allowed actions
export const AI = createAI({
  initialAIState: [],
  initialUIState: [],
  actions: {
    generateImageDescription: generateRecommendation, // is generateImageDescription used anywhere?
  },
});
