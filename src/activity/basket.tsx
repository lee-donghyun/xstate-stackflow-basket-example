import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";
import { useMachine } from "@xstate/react";

import { basketMachine } from "./basket.machine";

export const Basket: ActivityComponentType = () => {
  const [snapshot, send] = useMachine(basketMachine, {
    input: { user: "test" },
  });
  console.log(snapshot);
  return (
    <AppScreen appBar={{}}>
      {snapshot.matches("loading") && <div>Loading...</div>}
      {snapshot.matches({ loading: "retry" }) && (
        <div>waiting for retry...</div>
      )}
      {snapshot.context.items.map((item) => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>{item.quantity}</span>
          <button
            className="p-1"
            onClick={() => send({ item, type: "dec-qty" })}
          >
            <MinusIcon className="size-4" />
          </button>
          <button
            className="p-1"
            onClick={() => send({ item, type: "inc-qty" })}
          >
            <PlusIcon className="size-4" />
          </button>
        </div>
      ))}
    </AppScreen>
  );
};
