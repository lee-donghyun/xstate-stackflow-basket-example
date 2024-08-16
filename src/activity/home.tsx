import {
  Bars2Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";

export const Home: ActivityComponentType = () => {
  return (
    <AppScreen>
      <div className="fixed inset-x-0 top-0 flex items-start gap-2 px-4">
        <button className="mt-4">
          <Bars2Icon className="size-6" />
        </button>
        <div>
          <span className="mt-1 inline-block text-8xl font-medium leading-none tracking-tighter">
            SxSS
          </span>
          <p className="ml-1 mt-1 text-sm font-light">Stackflow XState Shop</p>
        </div>
        <div className="mt-4 flex flex-1 justify-end gap-4">
          <button>
            <MagnifyingGlassIcon className="size-6" />
          </button>
          <button>
            <ShoppingBagIcon className="size-6" />
          </button>
        </div>
      </div>
    </AppScreen>
  );
};
