import { assign, fromPromise, setup } from "xstate";

import { BasketItem } from "../model/basket-item";

const loadBasket = (user: string) =>
  new Promise<BasketItem[]>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve([
          {
            id: 1,
            isSelected: true,
            isSoldOut: false,
            name: `ITEM FOR USER${user}`,
            options: [
              { name: "Color", value: "BLACK" },
              { name: "Size", value: "M" },
            ],
            originalPrice: 24.99,
            price: 13.6,
            quantity: 1,
          },
          {
            id: 2,
            isSelected: true,
            isSoldOut: false,
            name: `ANOTHER ITEM FOR USER${user}`,
            options: [
              { name: "Color", value: "GRAY" },
              { name: "Size", value: "XS" },
            ],
            originalPrice: 99.99,
            price: 87.6,
            quantity: 1,
          },
        ]);
      } else {
        reject(new Error("Failed to load basket"));
      }
    }, 1000);
  });

export const basketMachine = setup({
  actors: {
    fetchBasket: fromPromise<BasketItem[], string>(({ input }) =>
      loadBasket(input),
    ),
  },
  types: {
    context: {} as {
      items: BasketItem[];
      user: string;
    },
    events: {} as
      | { item: BasketItem; type: "dec-qty" }
      | { item: BasketItem; type: "deselect" }
      | { item: BasketItem; type: "inc-qty" }
      | { item: BasketItem; type: "select" },
    input: {} as { user: string },
  },
}).createMachine({
  context: (context) => ({
    items: [],
    user: context.input.user,
  }),
  initial: "loading",
  states: {
    idle: {
      on: {
        "dec-qty": {
          actions: assign({
            items: ({ context, event }) =>
              context.items.map((item) =>
                item.id === event.item.id
                  ? { ...item, quantity: item.quantity - 1 }
                  : item,
              ),
          }),
          guard: ({ event }) => event.item.quantity > 1,
        },
        deselect: {
          actions: assign({
            items: ({ context, event }) =>
              context.items.map((item) =>
                item.id === event.item.id
                  ? { ...item, isSelected: false }
                  : item,
              ),
          }),
        },
        "inc-qty": {
          actions: assign({
            items: ({ context, event }) =>
              context.items.map((item) =>
                item.id === event.item.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
          }),
        },
        select: {
          actions: assign({
            items: ({ context, event }) =>
              context.items.map((item) =>
                item.id === event.item.id
                  ? { ...item, isSelected: true }
                  : item,
              ),
          }),
        },
      },
    },
    loading: {
      id: "loading",
      initial: "pending",
      invoke: {
        input: ({ context }) => context.user,
        onDone: {
          actions: assign({
            items: ({ event }) => event.output,
          }),
          target: "idle",
        },
        onError: {
          actions: assign({
            items: [],
          }),
          target: ".retry",
        },
        src: "fetchBasket",
      },
      states: {
        pending: {},
        retry: {
          after: {
            5000: { target: "#loading" },
          },
        },
      },
    },
  },
});
