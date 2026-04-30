import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Завантажуємо змінні з .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity.ts'], // Шлях до твоїх Entity
  migrations: ['src/migrations/*.ts'], // Куди зберігати міграції
  synchronize: false, // Завжди false для міграцій!
});