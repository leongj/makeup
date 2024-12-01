"use server";
import { generateText } from "ai";
import { AzureProvider } from "../home-page/azure";

interface Props {
  image: string;
  userRequest: string;
}

export const generateImageDescription = async (base: Props) => {
  console.log(base);
  try {
    const azure = AzureProvider();
    const result = await generateText({
      system:
        "Use this to analyze the image based on the user request: " +
        base.userRequest,
      model: azure,
      messages: [
        {
          role: "user",

          content: [
            {
              type: "text",
              text: base.userRequest,
            },
            {
              type: "image",
              image: `data:image/jpeg;base64 ${base.image}`,
            },
          ],
        },
      ],
    });
    console.log(result.text);
    return result.text;
  } catch (error) {
    console.error("Error", error);
    return `There was an error`;
  }
};
