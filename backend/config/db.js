import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function query(sql, params) {
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute(sql, params);
  await conn.end();
  return rows;
}

// Test connection when app starts
export async function testConnection() {
  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log('Database connected successfully!');
    await conn.end();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
}
