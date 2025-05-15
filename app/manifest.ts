import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lipstick",
    short_name: "Lipstick",
    description:
      "Generate alt text and descriptions for images using Azure OpenAI",
    start_url: "/",
    display: "standalone",
    background_color: "#f1f5f9",
    theme_color: "#f1f5f9",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
