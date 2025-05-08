export const dressOptions = [
  { id: "everyday", label: "Everyday" },
  { id: "fancy_dinner", label: "Fancy Dinner" },
  { id: "date_night", label: "Date Night" },
];

export const dressTypeLabels: Record<string, string> = Object.fromEntries(
  dressOptions.map(option => [option.id, option.label])
);
