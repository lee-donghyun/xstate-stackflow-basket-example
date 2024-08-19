import { assign, fromPromise, setup } from "xstate";

import { BasketItem, loadBasket } from "../model/basket-item";
import { createCheckout } from "../model/checkout";

const MAX_RETRY = 3;
const RETRY_DELAY = 1000;

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
      onCheckout: (checkoutId: number) => void;
      retryCount: number;
      user: string;
    },
    events: {} as
      | { item: BasketItem; type: "dec-qty" }
      | { item: BasketItem; type: "deselect" }
      | { item: BasketItem; type: "inc-qty" }
      | { item: BasketItem; type: "select" }
      | { type: "checkout" },
    input: {} as { onCheckout: (checkoutId: number) => void; user: string },
  },
}).createMachine({
  context: (context) => ({
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
      entry: assign({
        retryCount: 0,
      }),
      id: "loading",
      initial: "basket",
      states: {
        basket: {
          entry: assign({
            retryCount: ({ context }) => context.retryCount + 1,
          }),
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
              guard: ({ context }) => context.retryCount < MAX_RETRY,
              target: "#loading.retry",
            },
            src: "fetchBasket",
          },
        },
        checkout: {
          entry: assign({
            retryCount: ({ context }) => context.retryCount + 1,
          }),
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
              guard: ({ context }) => context.retryCount < MAX_RETRY,
              target: "#loading.retryCheckout",
            },
            src: "createCheckout",
          },
        },
        retry: {
          after: {
            [RETRY_DELAY]: { target: "#loading.basket" },
          },
          entry: assign({
            retryCount: ({ context }) => context.retryCount + 1,
          }),
        },
        retryCheckout: {
          after: {
            [RETRY_DELAY]: { target: "#loading.checkout" },
          },
          entry: assign({
            retryCount: ({ context: { retryCount } }) => retryCount + 1,
          }),
        },
      },
    },
  },
});
