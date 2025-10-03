import express, {Request , Response} from 'express';;
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {startServer} from "./src/config/db.ts"
import route from "./src/routes/deliveryRoute.ts"
import cron from 'node-cron'
import https from 'https';

dotenv.config();
startServer().catch(err => console.log(err));;

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use("/api/v1", route)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function keepAlive(url: string) {
  https
    .get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
    })
    .on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });
}

cron.schedule('*/14 * * * *', () => {
  keepAlive('https://pick-n-get-be.onrender.com');
  console.log('Pinged the server every 14 minutes');
});
