export interface OrderItemI {
  id: string;
  productLink: string;
  productName: string;
  details: string;
  quantity: number;
  price: number;
  referenceNumber: string;
  estimatedWeight: string;
  image: string;
  createdAt: Date;
  // if you load the reverse relation:
  orderId?: string;
}

export interface OrderI {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  createdAt: Date;
  // include your items when needed
  items?: OrderItemI[];
}
