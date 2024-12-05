"use server";

import { AzureOpenAI } from "../common/azure-openai/azure";

interface Props {
  image: string;
  userRequest: string;
}

export const realTimeImageDescription = async (base: Props) => {
  try {
    const client = AzureOpenAI();

    const chatCompletion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Use this to analyze the image based on the user request: " +
            base.userRequest,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: base.userRequest,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64 ${base.image}`,
              },
            },
          ],
        },
      ],
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error", error);
    return `There was an error`;
  }
};
