// This file is part of the PrairieJoyBaskets project and provides an API client for interacting with the backend services.
// It includes methods to fetch categories and baskets from the API.

import type { Basket, Category, Zone, Addon, CorpForm } from '@repo/types';

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

    // Helper method to fetch delivery zones from the API
    async getZones(): Promise<Zone[]> {
        const res = await fetch('/api/v1/zones');
        if (!res.ok) throw new Error(`Failed to fetch zones: ${res.statusText}`);
        return res.json();
    }

    // Helper method to fetch catalog products (addons) from the API
    async getAddons(): Promise<Addon[]> {
        const res = await fetch('/api/v1/addons');
        if (!res.ok) throw new Error(`Failed to fetch addons: ${res.statusText}`);
        return res.json();
    }

    // Helper method to insert corporate orders form into the DB via API POST request and
    // send an email notification to the corporate orders email address VIA SendGrid.
    async submitCorporateOrder(
        order: CorpForm
    ): Promise<{
        status: number;
        data: {
            message: string;
            notificationSent: boolean;
            notificationResponse: {
                status: number;
                data: { result?: string; error?: string };
            } | null;
        };
    }> {
        const res = await fetch('/api/v1/submit_corpform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });
        if (!res.ok) throw new Error(`Failed to submit corporate order: ${res.statusText}`);
        // Parse and return the JSON response
        const responseData: {
            message: string;
            notificationSent: boolean;
            notificationResponse: {
                status: number;
                data: { result?: string; error?: string };
            } | null;
        } = await res.json();
        return {
            status: res.status,
            data: responseData,
        };
    }
}
// Latest ?

export const apiClient = new PrairieJoyClient();