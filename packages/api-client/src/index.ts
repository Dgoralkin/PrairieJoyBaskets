import type { Basket, Category } from '@repo/types';

export class PrairieJoyClient {
    private baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:4000') {
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    async getCategories(): Promise<Category[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/categories`);
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
        return res.json();
    }

    async getBaskets(category?: string): Promise<Basket[]> {
        const url = new URL(`${this.baseUrl}/api/v1/baskets`);
        if (category && category !== 'All') {
            url.searchParams.set('category', category);
        }
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Failed to fetch baskets: ${res.statusText}`);
        return res.json();
    }
}

export const apiClient = new PrairieJoyClient(
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 'http://localhost:4000'
);
