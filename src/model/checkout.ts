/* eslint-disable @typescript-eslint/no-unused-vars */
import { BasketItem } from "./basket-item";

export const createCheckout = (_items: BasketItem[]) =>
  new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });
