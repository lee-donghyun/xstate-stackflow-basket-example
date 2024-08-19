import { assign, fromPromise, setup } from "xstate";

import { BasketItem, loadBasket, syncBasket } from "../model/basket-item";
import { createCheckout } from "../model/checkout";

const RETRY_DELAY = 1000;

export const basketMachine = setup({
  actors: {
    createCheckout: fromPromise<number, BasketItem[]>(({ input: items }) =>
      createCheckout(items),
    ),
    fetchBasket: fromPromise<BasketItem[], string>(({ input }) =>
      loadBasket(input),
    ),
    syncBasket: fromPromise<BasketItem[], BasketItem[]>(({ input: items }) =>
      syncBasket(items),
    ),
  },
  types: {
    context: {} as {
      error: { id: number; message: string }[];
      items: BasketItem[];
      onCheckout: (checkoutId: number) => void;
      user: string;
    },
    events: {} as
      | { id: number; type: "remove-error" }
      | { item: BasketItem; type: "dec-qty" }
      | { item: BasketItem; type: "deselect" }
      | { item: BasketItem; type: "inc-qty" }
      | { item: BasketItem; type: "select" }
      | { type: "checkout" },
    input: {} as { onCheckout: (checkoutId: number) => void; user: string },
  },
}).createMachine({
  context: (context) => ({
    error: [],
    items: [],
    onCheckout: context.input.onCheckout,
    retryCount: 0,
    user: context.input.user,
  }),
  id: "root",
  initial: "loading",
  states: {
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
          target: "#loading.syncBasket",
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
          target: "#loading.syncBasket",
        },
        "remove-error": {
          actions: assign({
            error: ({ context, event }) =>
              context.error.filter((error) => error.id !== event.id),
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
                error: ({ context }) =>
                  context.error.concat({
                    id: context.error.length,
                    message: "FAILED TO LOAD BASKET. RETRYING...",
                  }),
                items: [],
              }),
              target: "#loading.retryBasket",
            },
            src: "fetchBasket",
          },
        },
        checkout: {
          invoke: {
            input: ({ context }) => context.items,
            onDone: {
              actions: ({ context, event }) => {
                console.log("checkout done with id", event);
                context.onCheckout(event.output);
              },
              target: "#root.idle",
            },
            onError: {
              actions: assign({
                error: ({ context }) =>
                  context.error.concat({
                    id: context.error.length,
                    message: "FAILED TO CHECKOUT. RETRYING...",
                  }),
              }),
              target: "#loading.retryCheckout",
            },
            src: "createCheckout",
          },
        },
        retryBasket: {
          after: {
            [RETRY_DELAY]: { target: "#loading.basket" },
          },
        },
        retryCheckout: {
          after: {
            [RETRY_DELAY]: { target: "#loading.checkout" },
          },
        },
        syncBasket: {
          invoke: {
            input: ({ context }) => context.items,
            onDone: {
              target: "#root.idle",
            },
            onError: {
              actions: assign({
                error: ({ context }) =>
                  context.error.concat({
                    id: context.error.length,
                    message: "FAILED TO SYNC BASKET. RELOADING...",
                  }),
              }),
              target: "#loading.basket",
            },
            src: "syncBasket",
          },
        },
      },
    },
  },
});
