export const exampleOccasions = [
  { text: "everyday wear, with a variety of colours", label: "Everyday" },
  { text: "fancy dinner in a black dress", label: "Fancy Dinner" },
  { text: "date night, with something red", label: "Date Night" },
];

export const exampleOccasionLabels: Record<string, string> = Object.fromEntries(
  exampleOccasions.map(option => [option.text, option.label])
);
