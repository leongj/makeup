"use server";

import { CoreMessage, generateText, streamText } from "ai";
import { createStreamableUI } from "ai/rsc";
import { Loading } from "../common/loading";
import { Markdown } from "../common/markdown";
import { AzureProvider } from "./azure";
import { AltTextSystemPrompt } from "./prompts";

export const generateImageAltText = async (base: string) => {
  try {
    const azure = AzureProvider();
    const result = await generateText({
      system: AltTextSystemPrompt,
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
