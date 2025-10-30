import React from "react";
import { Button } from "@/components/ui/button";

const fonts = [
  { id: "inter", name: "Inter", preview: "The quick brown fox" },
  { id: "roboto", name: "Roboto", preview: "The quick brown fox" },
  { id: "lato", name: "Lato", preview: "The quick brown fox" },
  { id: "opensans", name: "Open Sans", preview: "The quick brown fox" },
  { id: "montserrat", name: "Montserrat", preview: "The quick brown fox" },
];

export default function FontSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      {fonts.map((font) => (
        <Button
          key={font.id}
          variant={value === font.id ? "default" : "outline"}
          onClick={() => onChange(font.id)}
          className="w-full justify-start text-left h-auto py-3"
        >
          <div>
            <div className="font-semibold">{font.name}</div>
            <div
              className="text-sm text-gray-500"
              style={{ fontFamily: `'${font.name}', sans-serif` }}
            >
              {font.preview}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}
