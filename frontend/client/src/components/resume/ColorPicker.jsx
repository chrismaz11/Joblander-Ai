import React from "react";
import { Check } from "lucide-react";

const colors = [
  { id: "blue", name: "Blue", color: "#3b82f6" },
  { id: "purple", name: "Purple", color: "#8b5cf6" },
  { id: "green", name: "Green", color: "#10b981" },
  { id: "red", name: "Red", color: "#ef4444" },
  { id: "navy", name: "Navy", color: "#1e3a8a" },
  { id: "teal", name: "Teal", color: "#14b8a6" },
];

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {colors.map((color) => (
        <button
          key={color.id}
          onClick={() => onChange(color.id)}
          className={`relative h-16 rounded-lg transition-all ${
            value === color.id ? "ring-2 ring-offset-2 ring-gray-900 scale-105" : "hover:scale-105"
          }`}
          style={{ backgroundColor: color.color }}
        >
          {value === color.id && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
          )}
          <div className="absolute bottom-1 left-0 right-0 text-center">
            <span className="text-xs font-medium text-white drop-shadow">{color.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
