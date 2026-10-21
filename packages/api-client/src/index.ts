import type { Basket, Category } from '@repo/types';

export class PrairieJoyClient {

    // Helper method to fetch categories from the API
    async getCategories(): Promise<Category[] > {
        const res = await fetch('/api/v1/categories');
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
        return res.json();
    }

    // Helper method to fetch baskets from the API
    async getBaskets(category?: string): Promise<Basket[]> {
        // Use window.location.origin as the base so URLSearchParams work cleanly with relative paths
        const url = new URL('/api/v1/baskets', window.location.origin);
        if (category && category !== 'All') {
            url.searchParams.set('category', category);
        }
        
        // Pass url.toString() (which automatically handles the relative path + query params)
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Failed to fetch baskets: ${res.statusText}`);
        return res.json();
    }
}

export const apiClient = new PrairieJoyClient();