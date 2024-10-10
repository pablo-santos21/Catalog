import { Category } from './category';
import { User } from './user';

export interface Product {
  id: number;
  name?: string;
  description: string;
  slug?: string;
  price: number;
  stock: number;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  user?: User;
  categoryId: number;
  category?: Category;
}
