export interface Product {
  brand: string;
  productName: string;
  swatchImage: string; // Filename in /public
  shades?: Array<{
    id: string;
    name: string;
  }>;
}

export const LIPSTICK_PRODUCTS: Product[] = [
  {
    brand: "Charlotte Tilbury",
    productName: "Hot Lips",
    swatchImage: "ct-hotlips-swatch.jpg",
    shades: [
      { id: "ct-hotlips-002", name: "Carina's Love" },
      { id: "ct-hotlips-003", name: "Nude Kate" },
      { id: "ct-hotlips-004", name: "Kim KW" },
      { id: "ct-hotlips-005", name: "Super Cindy" },
      { id: "ct-hotlips-006", name: "Liv It Up" },
      { id: "ct-hotlips-007", name: "Secret Salma" },
      { id: "ct-hotlips-008", name: "Penelope Pink" },
      { id: "ct-hotlips-009", name: "Sexy Sienna" },
      { id: "ct-hotlips-010", name: "Electric Poppy" },
      { id: "ct-hotlips-011", name: "Hot Emily" },
      { id: "ct-hotlips-012", name: "Miranda May" },
      { id: "ct-hotlips-013", name: "Tell Laura" },
      { id: "ct-hotlips-015", name: "Kidman's Kiss" },
      { id: "ct-hotlips-016", name: "Very Victoria" },
    ],
  },
  {
    brand: "Maybelline",
    productName: "Color Sensational",
    swatchImage: "maybelline-sensational-swatch.webp",
    shades: [
      { id: "maybelline-sensational-mauve", name: "Mauve For Me" },
      { id: "maybelline-sensational-red", name: "Red For Me" },
      { id: "maybelline-sensational-ruby", name: "Ruby For Me" },
      { id: "maybelline-sensational-fuchsia", name: "Fuchsia For Me" },
      { id: "maybelline-sensational-plum", name: "Plum For Me" },
      { id: "maybelline-sensational-pink", name: "Pink For Me" },
    ],
  },
  {
    brand: "L'oréal",
    productName: "Color Riche",
    swatchImage: "loreal-colorriche-swatch.webp",
    shades: [
      { id: "loreal-colorriche-505", name: "505 Resilient" },
      { id: "loreal-colorriche-520", name: "520 Defiant" },
      { id: "loreal-colorriche-540", name: "540 Unstoppable" },
      { id: "loreal-colorriche-550", name: "550 Unapologetic" },
      { id: "loreal-colorriche-570", name: "570 Worth it Intense" },
      { id: "loreal-colorriche-601", name: "601 Worth It" },
    ],
  },
];
