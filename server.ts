import express, {Request , Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {startServer} from "./src/config/db.ts"
import route from "./src/routes/deliveryRoute.ts"
import cron from 'node-cron'
import https from 'https';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

dotenv.config();
startServer().catch(err => console.log(err));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Swagger setup
try {
  const swaggerPath = path.join(__dirname, 'src', 'swagger', 'swagger.yaml');
  const swaggerDocument = YAML.load(swaggerPath);

  // Update servers based on environment
  swaggerDocument.servers = [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://pick-n-get-be.onrender.com' 
        : `http://localhost:${PORT}`,
      description: process.env.NODE_ENV === 'production' 
        ? 'Production server' 
        : 'Development server',
    },
  ];

  // Swagger UI options
  const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Pick N Get API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerDocument, swaggerOptions));

  console.log('Swagger documentation loaded successfully');
} catch (error) {
  console.error('Error setting up Swagger:', error);
}

// API routes
app.use("/api/v1", route);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'Welcome to Pick N Get API',
    documentation: `${process.env.NODE_ENV === 'production' 
      ? 'https://pick-n-get-be.onrender.com' 
      : `http://localhost:${PORT}`}/api-docs`
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});

// Keep alive function
function keepAlive(url: string) {
  https
    .get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
    })
    .on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });
}

// Schedule keep-alive
cron.schedule('*/14 * * * *', () => {
  keepAlive('https://pick-n-get-be.onrender.com');
  console.log('Pinged the server every 14 minutes');
});