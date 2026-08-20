import type { Category } from './category';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;

    category: Category;

    createdAt: Date;
    updatedAt: Date;
}