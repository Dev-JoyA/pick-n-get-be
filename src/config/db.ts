import { createClient } from 'redis';
import { Server } from "socket.io";
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { initializeApp} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

dotenv.config();

const password = process.env.POSTGRES_PASSWORD;
const databaseURL = process.env.DATABASE_URL;

const firebaseConfig = {
  databaseURL: databaseURL,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);


export const sequelize = new Sequelize('pngdb', 'postgres', password, {
  host: 'localhost',
  dialect: 'postgres'
});





