import { createAI } from "ai/rsc";
import { generateImageDescription } from "./actions";

// Create the AI provider with the initial states and allowed actions
export const AI = createAI({
  initialAIState: [],
  initialUIState: [],
  actions: {
    generateImageDescription,
  },
});
