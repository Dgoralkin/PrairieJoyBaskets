import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import type { Basket, Category } from '@repo/types';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

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
        res.json(result.rows as Basket[]);
    } catch (error) {
        console.error('Failed to fetch baskets:', error);
        res.status(500).json({ error: 'Failed to fetch baskets' });
    }
});

app.listen(port, () => {
    console.log(`Frontend Prairie Joy Baskets API listening on http://localhost:${port}`);
});
