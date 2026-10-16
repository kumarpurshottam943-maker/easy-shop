export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  category: 'Electronics' | 'Fashion' | 'Accessories' | 'Home & Living';
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  image: string;
  additionalImages?: string[];
  description: string;
  features: string[];
  inStock: boolean;
  isFeatured?: boolean;
  stockCount: number;
  tag?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category = 'All' | 'Electronics' | 'Fashion' | 'Accessories' | 'Home & Living';
