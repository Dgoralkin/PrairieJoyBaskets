/* This file contains the main entry point for the API server */
/* It defines the Express app and its routes (get, post, put, delete) */
/* It also initializes the Google Cloud Storage client and provides a helper function to generate signed URLs for images stored in GCS */

import express from 'express';
import cors from 'cors';
import { Storage } from '@google-cloud/storage';
import { pool } from './db.js';
import type { Basket, Category, CorpForm } from '@repo/types';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Initialize Google Cloud Storage client
// This automatically picks up the backend's IAM service account credentials on Cloud Run. 
const storage = new Storage();
// The name of the GCS bucket where images are stored.
const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'pjb_media_bucket';


/* Helper function to generate a temporary GCS Signed URL for a given file path for fetching images from Google Cloud Storage */
async function getSignedImageUrl(rawUrl: string): Promise<string> {
    if (!rawUrl) return '';

    try {
        let objectPath = rawUrl;

        // Extract object path if rawUrl is a standard GCS public URL
        // e.g., "https://storage.googleapis.com/pjb_media_bucket/basket_image_url/b1.avif" -> "basket_image_url/b1.avif"
        if (rawUrl.includes('storage.googleapis.com')) {
            const parsedUrl = new URL(rawUrl);
            // pathname is "/pjb_media_bucket/basket_image_url/b1.avif"
            const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
            
            // Skip the bucket name (first segment) and join the remaining path
            objectPath = pathSegments.slice(1).join('/');
        }

        const options = {
            version: 'v4' as const,
            action: 'read' as const,
            expires: Date.now() + 60 * 60 * 1000, // Valid for 1 hour
        };

        const [signedUrl] = await storage
            .bucket(BUCKET_NAME) // 'pjb_media_bucket'
            .file(objectPath)
            .getSignedUrl(options);

        return signedUrl;
    } catch (error) {
        console.error(`Failed to generate signed URL for path: ${rawUrl}`, error);
        return rawUrl; // Fallback to raw string if signing fails
    }
}

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/v1/categories - Returns active categories sorted by sort_order
app.get('/api/v1/categories', async (_req, res) => {
    try {
        const result = await pool.query(`
      SELECT id, name, sort_order AS "sortOrder"
      FROM basket_categories
      WHERE sort_order < 6
      ORDER BY sort_order ASC;
    `);
        res.json(result.rows as Category[]);
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET /api/v1/baskets - Returns active baskets with joined category name
app.get('/api/v1/baskets', async (req, res) => {
    try {
        const { category } = req.query;

        let queryText = `
      SELECT 
        b.id,
        b.title,
        c.name AS category,
        b.category_id AS "categoryId",
        b.price,
        b.rating,
        b.reviews,
        b.image_url AS image,
        b.description,
        b.tags,
        b.contents,
        b.is_active AS "isActive"
      FROM catalog_baskets b
      LEFT JOIN basket_categories c ON b.category_id = c.id
      WHERE b.is_active = TRUE
    `;

        const params: any[] = [];
        if (category && category !== 'All') {
            params.push(category);
            queryText += ` AND (c.name = $1 OR c.id = $1)`;
        }

        queryText += ` ORDER BY b.title ASC;`;

        const result = await pool.query(queryText, params);

        // Map through database rows and generate signed URLs concurrently for each basket image
        const basketsWithSignedImages = await Promise.all(
            result.rows.map(async (basket: any) => {
                const signedImage = await getSignedImageUrl(basket.image);
                return {
                    ...basket,
                    image: signedImage, // Replaces raw db path with secure 1-hour signed URL
                };
            })
        );
        res.json(basketsWithSignedImages as Basket[]);
    } catch (error) {
        console.error('Failed to fetch baskets:', error);
        res.status(500).json({ error: 'Failed to fetch baskets' });
    }
});

// GET /api/v1/zones - Returns delivery zones with their prices and estimated delivery days
app.get('/api/v1/zones', async (_req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, price, est_days, is_active, created_at
            FROM delivery_zones
            ORDER BY id;
            `);
        res.json(result.rows);
        // console.log('Fetched zones:', result.rows);
    } catch (error) {
        console.error('Failed to fetch zones:', error);
        res.status(500).json({ error: 'Failed to fetch zones' });
    }
});

// GET /api/v1/addons - Returns catalog products (addons) with their names, prices, and signed image URLs
app.get('/api/v1/addons', async (_req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                image_url,
                category,
                msrp,
                cost,
                is_active
            FROM catalog_products
            ORDER BY id ASC;
        `);

        // Generate signed URLs for addon images concurrently
        const addonsWithSignedImages = await Promise.all(
            result.rows.map(async (addon: any) => {
                const signedImage = await getSignedImageUrl(addon.image_url);

                return {
                    ...addon,
                    image_url: signedImage,
                };
            })
        );

        res.json(addonsWithSignedImages);
    } catch (error) {
        console.error('Failed to fetch catalog products / addons:', error);
        res.status(500).json({
            error: 'Failed to fetch catalog products / addons'
        });
    }
});

// POST /api/v1/corporate_orders
app.post('/api/v1/submit_corpform', async (req, res) => {
    const body: unknown = req.body;
    if (!body || typeof body !== 'object') {
        res.status(400).json({ error: 'Invalid corporate order.' });
        return;
    }

    const { companyName, contactEmail, quantity, deliveryDate, notes } =
        body as Partial<CorpForm>;
    const parsedDeliveryDate =
        typeof deliveryDate === 'string' ? Date.parse(`${deliveryDate}T00:00:00.000Z`) : NaN;
    const isValidDeliveryDate =
        Number.isFinite(parsedDeliveryDate) &&
        new Date(parsedDeliveryDate).toISOString().slice(0, 10) === deliveryDate;

    if (
        typeof companyName !== 'string' ||
        !companyName.trim() ||
        typeof contactEmail !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ||
        typeof quantity !== 'number' ||
        !Number.isInteger(quantity) ||
        quantity < 5 ||
        !isValidDeliveryDate ||
        (notes !== undefined && typeof notes !== 'string')
    ) {
        res.status(400).json({ error: 'Invalid corporate order.' });
        return;
    }

    try {
        await pool.query(`
            INSERT INTO corporate_orders
            (company_name, contact_email, quantity, delivery_date, notes)
            VALUES ($1, $2, $3, $4, $5);
        `, [companyName.trim(), contactEmail, quantity, deliveryDate, notes ?? '']);
        res.status(201).json({ message: 'Corporate order submitted.' });
    } catch (error) {
        console.error('Failed to post corporate order:', error);
        res.status(500).json({
            error: 'Failed to post corporate order.'
        });
    }
});











app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Backend server Prairie Joy Baskets is listening on port ${port}`);
});