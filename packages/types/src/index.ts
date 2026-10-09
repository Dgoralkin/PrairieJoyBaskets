{/* Define interfaces for the shape (type structure) of a category object in our 
    frontend or Node.js application. */}

export interface Category {
    id: string;
    name: string;
    sortOrder: number;
}

export interface Basket {
    id: string;
    title: string;
    category: string;
    categoryId: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    tags: string[];
    contents: string[];
    isActive: boolean;
}

export type CartItem = Omit<Basket, 'categoryId' | 'isActive'> & {
    qty: number;
    categoryId?: string;
    isActive?: boolean;
    isCustom?: boolean;
    contents?: string[];
};

export interface Addon {
    id: string;
    name: string;
    price: number;
    category: string;
}

export interface Zone {
    id: string;
    name: string;
    price: number;
    estDays: string;
}
