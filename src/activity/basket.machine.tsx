import { assign, fromPromise, setup } from "xstate";

import { BasketItem } from "../model/basket-item";

const loadBasket = (user: string) =>
  new Promise<BasketItem[]>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve([
          {
            discountedPrice: 0,
            id: 1,
            name: `Test ${user}`,
            options: [],
            price: 0,
            quantity: 1,
          },
        ]);
      } else {
        reject(new Error("Failed to load basket"));
      }
    }, 3000);
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
      | { item: BasketItem; type: "inc-qty" },
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
      meta: {
        totalPrice: 0,
      },
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
          guard: ({ context, event }) =>
            context.items.every(
              (item) => item.id === event.item.id && item.quantity > 0,
            ),
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
