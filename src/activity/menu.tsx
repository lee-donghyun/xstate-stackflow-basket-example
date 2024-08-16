import { BottomSheet } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";
import { useState } from "react";

const CATEGORIES = [
  [
    "WOMAN",
    [
      "BEST SELLERS",
      "WARDROBE STAPLES",
      "DRESSES",
      "TOPS",
      "BOTTOMS",
      "OUTERWEAR",
      "SHOES",
      "ACCESSORIES",
    ],
  ],
  [
    "MAN",
    [
      "VIEW ALL",
      "SHIRTS",
      "T-SHIRTS",
      "JEANS",
      "PANTS",
      "OUTERWEAR",
      "SHOES",
      "ACCESSORIES",
      "LINEN",
    ],
  ],
] as const;

export const Menu: ActivityComponentType = () => {
  const [selected, setSelected] = useState(0);
  const [, subCategories] = CATEGORIES[selected];
  return (
    <BottomSheet borderRadius="0">
      <div className="p-5">
        <div>
          <div className="flex gap-5">
            {CATEGORIES.map(([category], index) => (
              <button
                className={`text-xl ${selected === index ? "font-bold" : ""} `}
                key={category}
                onClick={() => setSelected(index)}
              >
                {category}
              </button>
            ))}
          </div>
          <ul className="h-80 space-y-1 pt-6 text-sm font-light">
            {subCategories.map((subCategory) => (
              <li key={subCategory}>{subCategory}</li>
            ))}
          </ul>
        </div>
      </div>
    </BottomSheet>
  );
};
