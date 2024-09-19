export interface Product {
  id: number;
  name?: string;
  description: string;
  slug?: string;
  price: number;
  stock: number;
  image?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  categoryId: number;
}
