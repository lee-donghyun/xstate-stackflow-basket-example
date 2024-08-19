export interface BasketItem {
  discountedPrice: number;
  id: number;
  name: string;
  options: { name: string; value: string }[];
  price: number;
  quantity: number;
}
