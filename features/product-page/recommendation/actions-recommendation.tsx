"use server";

import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { AzureOpenAI } from "../../common/azure-openai/azure";
import { Loading } from "../../common/loading";
import { Markdown } from "../../common/markdown";
import { LIPSTICK_PRODUCTS, Product } from "../products";
import React from "react";
// Product component for rendering a product by id
const ProductComponent = ({ id }: { id: string }) => {
  // You can expand this to fetch more product info if needed
  return <div><strong>Product:</strong> <span>{id}</span></div>;
};
import { RecommendationSystemPrompt } from "./prompt";
import fs from "fs";
import path from "path";

interface Props {
  images: string[]; // Expects user's selfie as images[0] (as data URL string)
  occasion: string;
}

// Helper function to extract raw base64 data and MIME type from a data URL
const processDataUrl = (dataUrl: string): { base64: string; mimeType: string } => {
  const match = dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/);
  if (match && match[1] && match[2]) {
    return { mimeType: match[1], base64: match[2] };
  }
  // Fallback if it's not a valid data URL or already raw (though less likely for user image)
  console.warn("processDataUrl did not find a valid data URL prefix, assuming raw or incorrect format:", dataUrl.substring(0,50));
  return { mimeType: 'image/jpeg', base64: dataUrl }; // Default MIME type, might cause issues if incorrect
};


export const generateRecommendation = async (props: Props) => {
  const { images, occasion } = props;

  if (!images || images.length === 0) {
    return { error: "No user image provided.", recommendation: "", products: [], brand: "", productName: "" };
  }

  const userSelfieDataUrl = images[0];

  const selectedProductIndex = Math.floor(Math.random() * LIPSTICK_PRODUCTS.length);
  const selectedProduct: Product = LIPSTICK_PRODUCTS[selectedProductIndex];

  // DEBUG: Log the selected product
  console.log("==== DEBUG Selected Product:", selectedProduct);
  // DEBUG: Log the occasion
  console.log("==== DEBUG Occasion:", occasion);

  let swatchImageBase64 = "";
  let swatchMimeType = "image/jpeg"; // Default, can be refined
  try {
    const imagePath = path.join(process.cwd(), "public", selectedProduct.swatchImage);
    const imageBuffer = fs.readFileSync(imagePath);
    swatchImageBase64 = imageBuffer.toString("base64");
    // Determine swatch MIME type from file extension
    const extension = path.extname(selectedProduct.swatchImage).toLowerCase();
    if (extension === '.png') swatchMimeType = 'image/png';
    else if (extension === '.webp') swatchMimeType = 'image/webp';
    // else keep jpeg or add more types
  } catch (error) {
    console.error("Error reading swatch image:", error);
    return { error: "Error processing product image.", recommendation: "", products: [], brand: selectedProduct.brand, productName: selectedProduct.productName  };
  }

  let updatedSystemPrompt = RecommendationSystemPrompt;
  updatedSystemPrompt = updatedSystemPrompt.replace(/{brand}/g, selectedProduct.brand);
  updatedSystemPrompt = updatedSystemPrompt.replace(/{productName}/g, selectedProduct.productName);
  updatedSystemPrompt = updatedSystemPrompt.replace(/{occasion}/g, occasion);
  updatedSystemPrompt = updatedSystemPrompt.replace(
    /{shade_data}/g,
    selectedProduct.shades && selectedProduct.shades.length > 0
      ? [
          '| Product Id | Shade name |',
          '|------------|------------|',
          ...selectedProduct.shades.map(
            (shade) => `| ${shade.id} | ${shade.name} |`
          ),
        ].join('\n')
      : 'No shades available.'
  );


  try {
    const client = AzureOpenAI();

    const processedUserSelfie = processDataUrl(userSelfieDataUrl);

    const imagesForAI = [
      { type: 'selfie', base64: processedUserSelfie.base64, mimeType: processedUserSelfie.mimeType },
      { type: 'swatch', base64: swatchImageBase64, mimeType: swatchMimeType }
    ];

    const messages: Array<ChatCompletionMessageParam> = imagesForAI.map(
      (imgDetail) => {
        return {
          role: "user",
          content: [
            {
              type: "text",
              text: imgDetail.type === 'selfie' ? "This is a selfie of the user." : `This is a swatch image of lipstick shades for the ${selectedProduct.brand} lipstick \"${selectedProduct.productName}\".`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${imgDetail.mimeType};base64,${imgDetail.base64}`,
              },
            },
          ],
        };
      }
    );

      // DEBUG Log the image details
      console.log("==== DEBUG Image details:");
      imagesForAI.forEach((imgDetail, index) => {
        console.log(`Image ${index} (Type):`, imgDetail.type);
        console.log(`Image ${index} (MIME Type):`, imgDetail.mimeType);
        console.log(`Image ${index} (Base64):`, imgDetail.base64.substring(0, 50) + "...");
      });

      console.log("==== DEBUG System message:", updatedSystemPrompt);
      messages.forEach((message, index) => {
        const textContent = message.content?.[0];
        const imageContent = message.content?.[1];
        if (
          message.role === "user" &&
          typeof textContent === 'object' && textContent?.type === 'text' &&
          typeof imageContent === "object" && imageContent?.type === "image_url"
        ) {
          console.log(`User message ${index} (Text):`, textContent.text);
          console.log(`User message ${index} (Image):`, imageContent.image_url.url.substring(0, 50) + "...");
        } else {
          console.log("User message (raw):", message);
        }
      });

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      stream: false,
      messages: [
        {
          role: "system",
          content: updatedSystemPrompt,
        },
        ...messages,
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "RecommendationResponse",
          strict: true,
          schema: {
            type: "object",
            properties: {
              recommendation: { type: "string" },
              products: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    productId: { type: "string" }
                  },
                  required: ["productId"],
                  additionalProperties: false
                }
              }
            },
            required: ["recommendation", "products"],
            additionalProperties: false
          }
        }
      }
    });

    // The response should be in response.choices[0].message.content as a stringified JSON
    let resultObj = { recommendation: '', products: [], brand: selectedProduct.brand, productName: selectedProduct.productName };
    try {
      const content = response.choices[0]?.message?.content;
      if (typeof content === 'string') {
        const parsed = JSON.parse(content);
        resultObj = {
          ...resultObj,
          ...parsed,
        };
      } else if (typeof content === 'object' && content !== null) {
        resultObj = {
          ...resultObj,
          ...(content as any),
        };
      }
      console.log("==== DEBUG Recommendation resultObj:", resultObj);
    } catch (e) {
      console.error('Failed to parse recommendation response:', e);
    }
    return { error: '', ...resultObj };
  } catch (error) {
    console.error("Error generating recommendation:", error);
    let errorMessage = "Error generating recommendation.";
    if (error instanceof Error && 'message' in error) {
      errorMessage = (error as any).message;
    }
    return { error: errorMessage, recommendation: "", products: [], brand: selectedProduct.brand, productName: selectedProduct.productName  };
  }
};
