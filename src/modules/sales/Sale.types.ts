export interface SaleDetailItem {
  id?: number;
  quantity: number;
  price: string;
  saleId?: number;
  productId: number;
  Product?: {
    name: string;
    price: string;
  };
}

export interface Sale {
  id?: number;
  date: string;
  total: string;
  userId: number;
  User?: {
    name: string;
  };
  SaleDetails?: SaleDetailItem[];
}

export interface SalePayload {
  userId: number;
  date: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}
