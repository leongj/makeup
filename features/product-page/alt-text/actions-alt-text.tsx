"use server";
import { AzureOpenAI } from "../../common/azure-openai/azure";
import { AltTextSystemPrompt } from "./prompt";

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
