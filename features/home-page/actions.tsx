"use server";

import { CoreMessage, generateText, streamText } from "ai";
import { createStreamableUI } from "ai/rsc";
import { Loading } from "../common/loading";
import { Markdown } from "../common/markdown";
import { AzureProvider } from "./azure";

const altTextSystemPrompt = `
# **System Prompt: Alt Text Generation AI**

You are an AI system designed to generate detailed, accurate, and concise alt text for images to improve accessibility for visually impaired users. Your alt text should meet the following guidelines:

1. **Accuracy**: Describe the content of the image as precisely as possible without making assumptions about details that are unclear or subjective.
2. **Clarity**: Use simple and descriptive language that conveys the image's key visual details in just 1 sentence and maximum of 20 words.
3. **Context Sensitivity**: Adapt the description based on the likely purpose or context of the image (e.g., informative, decorative, or functional).
4. **Neutral Tone**: Avoid personal interpretations or emotional language unless explicitly required (e.g., for artistic or emotional images).

## **Key Features of Generated Alt Text**
- **Objects and Subjects**: Identify and describe prominent objects, people, animals, and landscapes.
- **Colors, Shapes, and Text**: Include significant colors, shapes, and any visible text in the image.
- **Actions and Interactions**: Explain actions taking place and relationships between objects or subjects.
- **Background and Setting**: Provide contextual information about the environment or setting if relevant.

## **Examples**
- For an image of a dog playing with a ball in a park:  
  *"A brown Labrador Retriever playing with a red ball on green grass in a sunny park."*
- For a decorative abstract pattern:  
  *"An abstract design with swirling blue and gold lines on a black background."*

`;

export const generateImageAltText = async (base: string) => {
  try {
    const azure = AzureProvider();
    const result = await generateText({
      system: altTextSystemPrompt,
      model: azure,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: `data:image/jpeg;base64 ${base}`,
            },
          ],
        },
      ],
    });

    return result.text;
  } catch (error) {
    console.error("Error", error);
    return `There was an error`;
  }
};

interface Props {
  system: string;
  images: string[];
}

export const generateImageDescription = async (props: Props) => {
  const ui = createStreamableUI(<Loading />);
  const { system, images } = props;
  const messages: Array<CoreMessage> = [
    {
      role: "user",
      content: images.map((image) => {
        return {
          type: "image",
          image: `data:image/jpeg;base64 ${image}`,
        };
      }),
    },
  ];

  const triggerAI = async () => {
    let fullText = "";
    try {
      const azure = AzureProvider();
      const result = streamText({
        system: system,
        model: azure,
        messages: messages,
      });

      for await (const textPart of result.textStream) {
        fullText += textPart;
        ui.update(
          <>
            <Markdown content={fullText} />
            <Loading />
          </>
        );
      }

      ui.done(<Markdown content={fullText} />);
    } catch (error) {
      console.error("Error", error);
      ui.done(<Markdown content={"Error"} />);
    }
  };

  triggerAI();

  return ui.value;
};
