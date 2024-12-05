"use server";

import { createStreamableUI } from "ai/rsc";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { AzureOpenAI } from "../common/azure-openai/azure";
import { Loading } from "../common/loading";
import { Markdown } from "../common/markdown";
import { AltTextSystemPrompt } from "./prompts";

export const generateImageAltText = async (base: string) => {
  try {
    const client = AzureOpenAI();

    const chatCompletion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: AltTextSystemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64 ${base}`,
              },
            },
          ],
        },
      ],
    });

    return chatCompletion.choices[0].message.content || "";
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

  const triggerAI = async () => {
    try {
      const client = AzureOpenAI();

      const messages: Array<ChatCompletionMessageParam> = images.map(
        (image) => {
          return {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64 ${image}`,
                },
              },
            ],
          };
        }
      );

      const stream = await client.chat.completions.create({
        model: "gpt-4o",
        stream: true,
        messages: [
          {
            role: "system",
            content: system,
          },
          ...messages,
        ],
      });

      let fullText = "";

      for await (const chunk of stream) {
        fullText += chunk.choices[0]?.delta?.content || "";

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
