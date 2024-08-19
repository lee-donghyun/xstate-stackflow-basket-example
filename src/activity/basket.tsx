import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";
import { useMachine } from "@xstate/react";

import { basketMachine } from "./basket.machine";

export const Basket: ActivityComponentType = () => {
  const [snapshot, send] = useMachine(basketMachine, { input: { user: "" } });

  const totalPrice = snapshot.context.items
    .filter((item) => item.isSelected)
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AppScreen appBar={{}}>
      {snapshot.matches("loading") && <div>Loading...</div>}
      {snapshot.matches({ loading: "retry" }) && (
        <div>waiting for retry...</div>
      )}
      {snapshot.context.items.map((item) => (
        <div className="mb-5 flex items-center gap-5 px-5" key={item.id}>
          <button
            className="border border-black p-0.5"
            onClick={() =>
              item.isSelected
                ? send({ item, type: "deselect" })
                : send({ item, type: "select" })
            }
          >
            <div
              className={`size-4 ${item.isSelected ? "bg-black" : "bg-white"}`}
            ></div>
          </button>
          <div className="flex flex-col gap-1 p-3">
            <p className="font-bold">{item.name}</p>
            <div className="flex items-center gap-2">
              <p>${item.price}</p>
              {item.originalPrice && (
                <p className="text-sm text-zinc-500 line-through">
                  ${item.originalPrice}
                </p>
              )}
            </div>
            <p className="text-sm font-light">
              {item.options.map((option) => option.value).join(" | ")}
            </p>
            <div className="flex">
              <button
                className="border border-black p-1 disabled:opacity-50"
                disabled={item.quantity === 1}
                onClick={() => send({ item, type: "dec-qty" })}
              >
                <MinusIcon className="size-4" />
              </button>
              <p className="p-3 text-center font-medium">{item.quantity}</p>
              <button
                className="border border-black p-1"
                onClick={() => send({ item, type: "inc-qty" })}
              >
                <PlusIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-10 flex justify-end border-t border-black p-5">
        <p className="font-medium">Total: ${totalPrice.toFixed(2)}</p>
      </div>
    </AppScreen>
  );
};
