import type { Basket, Category } from '@repo/types';

export class PrairieJoyClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    // Helper method to fetch categories from the API
    async getCategories(): Promise<Category[]> {
        const res = await fetch(`${this.baseUrl}/api/v1/categories`);
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
        return res.json();
    }

    // Helper method to fetch baskets from the API
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

/*The resolveApiUrl() helper automatically detects the environment (import.meta.env), 
falling back to http://localhost:4000 during local development or requiring an explicit build-time environment variable (VITE_API_URL) for production builds.*/
const resolveApiUrl = (): string => {
    const env = (import.meta as any).env;
    if (env?.VITE_API_URL) return String(env.VITE_API_URL).replace(/\/+$/, '');
    if (env?.DEV) return 'http://localhost:4000';
    return ''; // <--- Return empty string instead of throwing error!
};


export const apiClient = new PrairieJoyClient(resolveApiUrl());