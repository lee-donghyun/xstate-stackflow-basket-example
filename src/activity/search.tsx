import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";

import { useFlow } from "../stack/app";

export const Search: ActivityComponentType = () => {
  const { push } = useFlow();
  return (
    <AppScreen
      appBar={{
        renderRight: () => (
          <div className="flex flex-1 justify-end gap-4 px-2">
            <button
              onClick={() => {
                push("Basket", {});
              }}
            >
              <ShoppingBagIcon className="size-6" />
            </button>
          </div>
        ),
      }}
    >
      여기에 검색창이 등장합니다.
    </AppScreen>
  );
};
