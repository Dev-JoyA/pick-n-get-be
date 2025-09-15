import { createClient } from 'redis';
import { Server } from "socket.io";
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';


dotenv.config();
const password = process.env.POSTGRES_PASSWORD;

export const client = createClient();

export const sequelize = new Sequelize('pngdb', 'postgres', password, {
  host: 'localhost',
  dialect: 'postgres'
});


const io = new Server();

export const redisClient = createClient();
await redisClient.connect();

io.on("connection", (socket) => {
  socket.on("updateLocation", async ({ riderId, lat, lng }) => {
    await redisClient.hSet(`rider:${riderId}:location`, {
      lat,
      lng,
      updatedAt: Date.now()
    });
  });
});



