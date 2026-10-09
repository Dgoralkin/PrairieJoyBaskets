// Create a client instance for connecting to CloudSQL Postgres database.

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool, types } = pg;

// Parse Postgres NUMERIC / DECIMAL (type ID 1700) to JavaScript floats
types.setTypeParser(1700, (val: string) => parseFloat(val));

// For DEV - local connection, read env vars from apps/api/.env file
export const pool = new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'pjb-web-db',
    // Disable SSL when using Cloud SQL Auth Proxy on localhost
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false, checkServerIdentity: () => undefined } : false,
});
