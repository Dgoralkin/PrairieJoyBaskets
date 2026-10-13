// Create a client instance for connecting to CloudSQL Postgres database.

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool, types } = pg;

// Parse Postgres NUMERIC / DECIMAL (type ID 1700) to JavaScript floats
types.setTypeParser(1700, (val: string) => parseFloat(val));

// Pool config — supports both TCP (IP/hostname) and Cloud SQL Unix socket paths
export const pool = new Pool({
    // pg detects Unix socket paths automatically when 'host' starts with '/'
    host: process.env.DB_HOST || '127.0.0.1',
    // Skip port for Unix socket connections (Cloud SQL Auth Proxy uses socket files)
    ...(process.env.DB_HOST?.startsWith('/') ? {} : { port: Number(process.env.DB_PORT) || 5432 }),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'pjb-web-db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false, checkServerIdentity: () => undefined } : false,
});
