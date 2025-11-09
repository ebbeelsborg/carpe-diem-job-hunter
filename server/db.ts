import * as schema from "@shared/schema";
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Use Supabase database connection string
const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "SUPABASE_DATABASE_URL or DATABASE_URL must be set. Did you forget to add Supabase credentials?",
  );
}

// Create PostgreSQL connection pool for Supabase
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize Drizzle ORM with the pool
const db = drizzle(pool, { schema });

export { pool, db };
