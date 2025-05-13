export interface Product {
  brand: string;
  productName: string;
  swatchImage: string; // Filename in /public
  collectionName: string;
}

export const LIPSTICK_PRODUCTS: Product[] = [
  {
    brand: "Charlotte Tilbury",
    productName: "Hot Lips",
    swatchImage: "ct-hotlips-swatch.jpg",
    collectionName: "Hot Lips",
  },
  {
    brand: "Maybelline",
    productName: "Color Sensational",
    swatchImage: "maybelline-sensational-swatch.webp",
    collectionName: "Color Sensational",
  },
  {
    brand: "Loreal",
    productName: "Color Riche",
    swatchImage: "loreal-colorriche-swatch.webp",
    collectionName: "Color Riche",
  },
];
