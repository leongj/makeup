"use server";

export const callAisleInformation = async (product: string) => {
  const random = Math.floor(Math.random() * 10);
  return `The product ${product} is located in aisle ${random}`;
};
