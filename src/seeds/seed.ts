import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function seed() {
  await ds.initialize();

  // Категорії
  await ds.query(`INSERT INTO categories (name) VALUES ('Electronics'), ('Accessories'), ('Clothing') ON CONFLICT DO NOTHING`);

  // Продукти
  await ds.query(`
    INSERT INTO products (name, price, stock, "categoryId", "createdAt", "updatedAt")
    VALUES 
      ('iPhone 16', 999, 50, 1, NOW(), NOW()),
      ('Galaxy S24', 849, 40, 1, NOW(), NOW()),
      ('MacBook Pro', 2499, 15, 1, NOW(), NOW()),
      ('AirPods Pro', 249, 100, 2, NOW(), NOW()),
      ('USB-C Cable', 19, 500, 2, NOW(), NOW()),
      ('T-Shirt Dev', 25, 200, 3, NOW(), NOW()),
      ('Hoodie NestJS', 55, 75, 3, NOW(), NOW())
    ON CONFLICT DO NOTHING
  `);

  console.log('✅ Seed complete: categories and products added');
  await ds.destroy();
}

seed().catch(console.error);