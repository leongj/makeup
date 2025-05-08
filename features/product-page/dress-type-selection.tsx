"use client";

interface DressTypeSelectionProps {
  onSelectDressType: (dressType: string) => void;
}

const dressOptions = [
  { id: "everyday", label: "Everyday" },
  { id: "fancy_dinner", label: "Fancy Dinner" },
  { id: "date_night", label: "Date Night" },
];

export const DressTypeSelection: React.FC<DressTypeSelectionProps> = ({ onSelectDressType }) => {
  return (
    <div className="w-full flex flex-col items-center gap-4 mt-6">
      {dressOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelectDressType(option.id)}
          className="w-full max-w-md bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
