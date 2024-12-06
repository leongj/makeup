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
            base.userRequest +
            " \nAccurately analyze the image and ensure to describe the scene." +
            "\n .Extract all the text from the image. \n At the end you must provide a confidence score of low, medium, or high. If you are unsure, you can ask the user to hold the camera closer or further away.",
        },
        {
          role: "user",
          content: [
            // {
            //   type: "text",
            //   text: base.userRequest,
            // },
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
    console.log(chatCompletion.choices[0].message.content);
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error", error);
    return `There was an error`;
  }
};
