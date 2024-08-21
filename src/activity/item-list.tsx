import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";

import { useFlow } from "../stack/app";

export const ItemList: ActivityComponentType<{
  category?: string;
  itemId?: number;
}> = ({ params }) => {
  const { push } = useFlow();
  return (
    <AppScreen
      appBar={{
        renderRight: () => (
          <div className="flex flex-1 justify-end gap-4 px-2">
            <button
              onClick={() => {
                push("Search", {});
              }}
            >
              <MagnifyingGlassIcon className="size-6" />
            </button>
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
      여기에서 아이템에 관련된 리스트를 보여줍니다.
      {JSON.stringify(params)}
    </AppScreen>
  );
};
