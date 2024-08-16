import { setup } from "xstate";

import { BasketItem } from "../model/basket-item";

export const basketMachine = setup({
  actions: {
    decQty: (context) => {
      context.context.items.slice(1);
    },
  },
  types: {
    context: {} as {
      items: BasketItem[];
    },
    events: {} as { type: "dec-qty" } | { type: "inc-qty" },
  },
}).createMachine({});
