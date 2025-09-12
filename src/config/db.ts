import { createClient } from 'redis';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const password = process.env.POSTGRES_PASSWORD;

export const client = createClient();

export const sequelize = new Sequelize('pngdb', 'postgres', password, {
  host: 'localhost',
  dialect: 'postgres'
});


