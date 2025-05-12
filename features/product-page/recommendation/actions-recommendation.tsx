"use server";

import { createStreamableUI } from "ai/rsc";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { AzureOpenAI } from "../../common/azure-openai/azure";
import { Loading } from "../../common/loading";
import { Markdown } from "../../common/markdown";

interface Props {
  system: string;
  images: string[];
}

export const generateRecommendation = async (props: Props) => {
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

      // DEBUG log the messages to console, but don't print the base64 data
      console.log("==== DEBUG System message:", system);
      messages.forEach((message) => {
        const content = message.content?.[0];
        if (
          message.role === "user" &&
          typeof content === "object" &&
          content !== null &&
          "type" in content &&
          content.type === "image_url"
        ) {
          console.log("User message: [image_data]");
        } else {
          console.log("User message:", message);
        }
      });

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
