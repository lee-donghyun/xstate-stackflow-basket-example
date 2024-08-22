/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
export interface BasketItem {
  id: number;
  isSelected: boolean;
  isSoldOut: boolean;
  name: string;
  options: { name: string; value: string }[];
  originalPrice: number;
  price: number;
  quantity: number;
}

export const loadBasket = (user: string) =>
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

export const syncBasket = (items: BasketItem[]) =>
  new Promise<BasketItem[]>((resolve, reject) => {
    setTimeout(() => {
      const r = Math.random();
      if (r > 0.4) {
        resolve(items);
      } else if (r > 0.2) {
        reject({
          items: items.map((item, index) =>
            index === 0 ? { ...item, isSoldOut: true } : item,
          ),
          type: "NO_ITEM",
        });
      } else {
        reject({ type: "NETWORK" });
      }
    }, 1000);
  });
