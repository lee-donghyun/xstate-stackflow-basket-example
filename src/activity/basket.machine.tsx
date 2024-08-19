import { assign, fromPromise, setup } from "xstate";

import { BasketItem, loadBasket } from "../model/basket-item";
import { createCheckout } from "../model/checkout";

export const basketMachine = setup({
  actors: {
    createCheckout: fromPromise<number, BasketItem[]>(({ input: items }) =>
      createCheckout(items),
    ),
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
      | { item: BasketItem; type: "select" }
      | { type: "checkout" },
    input: {} as { user: string },
  },
}).createMachine({
  context: (context) => ({
    items: [],
    user: context.input.user,
  }),
  id: "root",
  initial: "loading",
  states: {
    checkout: {
      type: "final",
    },
    idle: {
      on: {
        checkout: {
          target: "#loading.checkout",
        },
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
      initial: "basket",
      states: {
        basket: {
          invoke: {
            input: ({ context }) => context.user,
            onDone: {
              actions: assign({
                items: ({ event }) => event.output,
              }),
              target: "#root.idle",
            },
            onError: {
              actions: assign({
                items: [],
              }),
              target: "#loading.retry",
            },
            src: "fetchBasket",
          },
        },
        checkout: {
          invoke: {
            input: ({ context }) => context.items,
            onDone: {
              actions: ({ event }) => {
                console.log("checkout done with id", event);
              },
              target: "#root.checkout",
            },
            onError: {
              target: "#loading.retryCheckout",
            },
            src: "createCheckout",
          },
        },
        retry: {
          after: {
            5000: { target: "#loading.basket" },
          },
        },
        retryCheckout: {
          after: {
            5000: { target: "#loading.checkout" },
          },
        },
      },
    },
  },
});
