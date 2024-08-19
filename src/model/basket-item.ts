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
