export interface BasketItem {
  discountedPrice: number;
  id: number;
  name: string;
  option: { name: string; value: string };
  price: number;
}
