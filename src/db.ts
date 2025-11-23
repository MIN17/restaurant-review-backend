import { Client } from "pg";

export const client = new Client({
  host: process.env.DB_HOST, // 'database' for Docker, 'localhost' for local dev
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function connectAndInitializeDatabase() {
  try {
    console.log("DB: Attempting to connect to PostgreSQL...");
    await client.connect(); // Establish the connection
    console.log("DB: PostgreSQL connected successfully!");

    // Create tables if they don't exist
    console.log("DB: Checking/creating database tables...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        address VARCHAR(100),
        rating INT,
        review VARCHAR(500))
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("DB: Database tables checked/created successfully!");
  } catch (err: any) {
    console.error("DB: FATAL: Database initialization error!");
    console.error("DB:", err);
    throw err;
  }
}
