import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";

export const Basket: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{}}>
      <div className="grid grid-cols-2">
        <div className="border-b border-r border-black">
          <div className="aspect-square w-full bg-gray-100"></div>
        </div>
      </div>
    </AppScreen>
  );
};
