# 🌍 Pick-n-Get Backend API

**Express.js + TypeScript API Server for Decentralized Recycling Platform**

A comprehensive backend system for managing recyclers, riders, pickups, and eco-friendly product marketplace integrated with Hedera blockchain and Firebase real-time database.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Models](#-database-models)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Features

- 🔐 **Wallet-Based Authentication** - No passwords, secure blockchain-based auth
- 🚴 **Rider Management** - Registration, approval, and real-time location tracking
- 📦 **Smart Pickup System** - AI-powered rider matching based on distance and capacity
- 🛒 **Eco-Marketplace** - Platform for selling recycled products
- 📊 **Admin Dashboard** - Comprehensive analytics and platform management
- 🌐 **Real-Time Tracking** - Firebase-powered location updates
- 📄 **Document Management** - Hedera File Service integration for secure document storage

### Technical Features

- RESTful API with OpenAPI/Swagger documentation
- MongoDB for persistent storage
- Firebase Realtime Database for location tracking
- Hedera blockchain integration
- CORS-enabled for web and mobile clients
- TypeScript for type safety
- Comprehensive error handling

---

## 🛠 Tech Stack

| Category          | Technology     | Version |
| ----------------- | -------------- | ------- |
| **Runtime**       | Node.js        | 18+     |
| **Framework**     | Express.js     | 5.1.0   |
| **Language**      | TypeScript     | 5.9.2   |
| **Database**      | MongoDB        | 6.20.0  |
| **ODM**           | Mongoose       | 8.19.0  |
| **Blockchain**    | Hedera SDK     | 2.72.0  |
| **Real-time DB**  | Firebase Admin | 13.5.0  |
| **Documentation** | Swagger UI     | 5.0.1   |
| **Security**      | Helmet         | 8.1.0   |
| **File Upload**   | Multer         | 2.0.2   |

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Hedera Testnet Account** - [Create Account](https://portal.hedera.com/)
- **Firebase Project** - [Firebase Console](https://console.firebase.google.com/)

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/pick-n-get-be.git
   cd pick-n-get-be
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials (see [Environment Setup](#-environment-setup))

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Verify Installation**
   - Server: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs
   - Health Check: http://localhost:5000/health

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following configuration:

### Server Configuration

```bash
# Server Settings
PORT=5000
NODE_ENV=development

# Backend URL (for file URLs)
BACKEND_URL=http://localhost:5000
```

### Database Configuration

```bash
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/pick-n-get
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pick-n-get?retryWrites=true&w=majority
```

### Hedera Blockchain Configuration

```bash
# Hedera Testnet Configuration
HEDERA_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_OPERATOR_KEY=YOUR_PRIVATE_KEY_HERE
HEDERA_NETWORK=testnet

# Super Admin Wallet (must match HEDERA_OPERATOR_ID wallet)
SUPER_ADMIN_WALLET=0x0000000000000000000000000000000000000000
```

**Important Notes:**

- Replace `0.0.YOUR_ACCOUNT_ID` with your actual Hedera account ID
- Get your account ID and private key from [Hedera Portal](https://portal.hedera.com/)
- For admin functionality, register your wallet address on HashScan
- Never commit your `.env` file to version control

### Firebase Configuration

#### Option 1: Using Environment Variable (Recommended for Production)

```bash
# Firebase Configuration as JSON string
DATABASE_URL=https://your-project.firebaseio.com/
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
```

#### Option 2: Using Service Account File (Recommended for Development)

1. Download your Firebase service account key from [Firebase Console](https://console.firebase.google.com/)
2. Save it as `firebase-service-account.json` in the project root
3. Add only DATABASE_URL to `.env`:

```bash
DATABASE_URL=https://your-project.firebaseio.com/
```

### Optional Configuration

```bash
# Mapbox (for enhanced geocoding - optional)
MAPBOX_API_KEY=your_mapbox_api_key

# Security Keys (for additional encryption if needed)
PRIVATE_KEY=your_encryption_key
PUBLIC_KEY=your_encryption_key
```

---

## 📂 Project Structure

```
pick-n-get-be/
├── server.ts                 # Application entry point
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
│
├── src/
│   ├── config/              # Configuration files
│   │   ├── db.ts           # MongoDB & Firebase setup
│   │   ├── firebase.ts     # (Deprecated - moved to db.ts)
│   │   └── messaging.ts    # (Deprecated)
│   │
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts           # Authentication & user management
│   │   ├── pickupController.ts         # Pickup request handling
│   │   ├── agentController.ts          # Rider/agent operations
│   │   ├── productController.ts        # Marketplace products
│   │   ├── adminController.ts          # Admin management
│   │   ├── adminController_stats.ts    # Admin analytics
│   │   ├── deliveryController.ts       # Delivery operations
│   │   ├── locationController.ts       # Real-time location
│   │   ├── pickupTrackingController.ts # Pickup tracking
│   │   └── uploadController.ts         # File uploads
│   │
│   ├── services/            # Business logic
│   │   ├── authService.ts          # Role management
│   │   ├── deliveryService.ts      # Delivery operations
│   │   ├── hederaFileService.ts    # Hedera file uploads
│   │   ├── locationService.ts      # Location management
│   │   ├── notificationService.ts  # Push notifications
│   │   ├── pickupService.ts        # Pickup creation
│   │   ├── agentPickupService.ts   # Agent pickup ops
│   │   └── riderFinderService.ts   # Rider matching algorithm
│   │
│   ├── models/              # Database schemas
│   │   ├── userModel.ts    # User/Recycler schema
│   │   ├── riderModel.ts   # Rider/Agent schema
│   │   ├── pickupModel.ts  # Pickup request schema
│   │   └── productModel.ts # Product/Producer/Order schemas
│   │
│   ├── routes/              # API routes
│   │   ├── authRoute.ts        # Authentication endpoints
│   │   ├── pickupRoute.ts      # Pickup endpoints
│   │   ├── agentRoute.ts       # Agent endpoints
│   │   ├── productRoute.ts     # Product endpoints
│   │   ├── deliveryRoute.ts    # Delivery endpoints
│   │   ├── locationRoute.ts    # Location endpoints
│   │   ├── uploadRoute.ts      # Upload endpoints
│   │   └── adminRoutes.ts      # Admin endpoints
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts         # Authentication middleware
│   │   ├── validation.ts   # Input validation
│   │   └── errorHandler.ts # Error handling
│   │
│   ├── utils/               # Helper functions
│   │   ├── riderValidation.ts    # Rider validation logic
│   │   └── vehicleCalculator.ts  # Vehicle type calculation
│   │
│   ├── interface/           # TypeScript interfaces
│   │   └── deliveryInterface.ts  # Delivery types
│   │
│   ├── scripts/             # Utility scripts
│   │   ├── seedRiderLocations.ts # Seed test locations
│   │   └── seedUsers.ts          # Seed test users
│   │
│   └── swagger/             # API documentation
│       ├── config.ts       # Swagger configuration
│       └── swagger.yaml    # OpenAPI specification
│
├── dist/                    # Compiled JavaScript (generated)
└── node_modules/           # Dependencies (gitignored)
```

---

## 📡 API Documentation

### Accessing Swagger Documentation

**Production:** https://pick-n-get-be.onrender.com/api-docs  
**Local Development:** http://localhost:5000/api-docs

### Server Selection in Swagger

The API documentation includes a **server selector** at the top:

1. **Production server (Live)** - `https://pick-n-get-be.onrender.com`
2. **Local development** - `http://localhost:5000`

Select the appropriate server before testing endpoints.

### Quick API Reference

| Category           | Endpoints            | Description                     |
| ------------------ | -------------------- | ------------------------------- |
| **Authentication** | `/api/v1/auth/*`     | User & rider authentication     |
| **Riders**         | `/api/v1/riders/*`   | Rider registration & management |
| **Pickups**        | `/api/v1/pickups/*`  | Pickup requests & tracking      |
| **Agents**         | `/api/v1/agents/*`   | Agent dashboard & operations    |
| **Products**       | `/api/v1/products/*` | Marketplace products            |
| **Location**       | `/api/v1/location/*` | Real-time location tracking     |
| **Upload**         | `/api/v1/upload/*`   | Document uploads (Hedera)       |
| **Admin**          | `/api/v1/admin/*`    | Admin panel & analytics         |

### Core Endpoint Examples

#### 1. Register a Rider

```http
POST /api/v1/riders
Content-Type: application/json

{
  "id": 123,
  "name": "John Doe",
  "phoneNumber": "123",
  "vehicleNumber": "ABC-123-XY",
  "homeAddress": "123 Main St, Lagos",
  "vehicleType": "Car",
  "country": "Nigeria",
  "capacity": 50,
  "vehicleRegistration": "QmZz...ghi789",
  "vehiclePhotos": "QmBb...mno345"
}
```

#### 2. Check Wallet Authentication

```http
POST /api/v1/auth/check-wallet
Content-Type: application/json

{
  "walletAddress": "0x1234567890abcdef..."
}
```

#### 3. Create Pickup Request

```http
POST /api/v1/pickups/create
Content-Type: application/json

{
  "userId": 1,
  "itemId": 1,
  "customerName": "Jane Doe",
  "customerPhoneNumber": "+234123456789",
  "pickupAddress": "123 Victoria Island, Lagos",
  "itemCategory": "plastic",
  "itemWeight": 15,
  "estimatedEarnings": 1800,
  "riderId": 123
}
```

#### 4. Update Rider Location

```http
POST /api/v1/location/update
Content-Type: application/json

{
  "riderId": 123,
  "lat": 6.5244,
  "lng": 3.3792,
  "heading": 45
}
```

#### 5. Get Dashboard Statistics

```http
GET /api/v1/admin/stats/dashboard
```

For complete API documentation with request/response examples, visit the Swagger UI.

---

## 🗄️ Database Models

### User Model

```typescript
{
  id: number,              // Unique user ID (0-255)
  name: string,
  email?: string,
  phoneNumber: string,     // Unique
  walletAddress?: string,  // Unique
  roles: UserRole[],       // ["Recycler", "Admin", "Vendor"]
  status: UserStatus,      // "Active", "Inactive", "Suspended"
  profileImage?: string,   // Hedera File ID
  address?: string,
  country?: string,
  totalRecycled: number,
  totalEarnings: number,
  co2Saved: number,
  totalPickups: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Rider Model

```typescript
{
  id: number,              // Unique rider ID (0-255)
  name: string,
  phoneNumber: string,     // Unique
  vehicleNumber: string,   // Unique
  homeAddress: string,
  walletAddress?: string,  // Unique
  vehicleType: VehicleType,    // "Bike", "Car", "Truck", "Van"
  country: string,
  capacity: number,        // kg
  riderStatus: RiderStatus,    // "Available", "Off-line", "On-Trip"
  approvalStatus: ApprovalStatus, // "Pending", "Approved", "Reject"

  // Vehicle details
  vehicleMakeModel?: string,
  vehiclePlateNumber?: string,
  vehicleColor?: string,

  // Documents (Hedera File IDs)
  profileImage?: string,
  driversLicense?: string,
  vehicleRegistration: string,  // Required
  insuranceCertificate?: string,
  vehiclePhotos: string,        // Required

  createdAt: Date,
  updatedAt: Date
}
```

### Pickup Model

```typescript
{
  trackingId: string,      // "REC123456"
  riderId: ObjectId,
  userId: number,          // From contract
  itemId: number,          // From contract
  customerName: string,
  customerPhoneNumber: string,
  pickupAddress: string,
  pickupCoordinates?: { lat: number, lng: number },
  itemCategory: string,    // "plastic", "metal", "glass", etc.
  itemWeight: number,      // kg
  itemDescription?: string,
  itemImages?: string[],   // Hedera File IDs
  pickUpStatus: PickUpStatus, // "Pending", "InTransit", "PickedUp", "Delivered"

  // Timestamps
  requestedAt: Date,
  acceptedAt?: Date,
  collectedAt?: Date,
  deliveredAt?: Date,

  estimatedEarnings: number,
  confirmedOnChain: boolean,
  confirmationTxHash?: string,
  notes?: string,

  createdAt: Date,
  updatedAt: Date
}
```

### Product Model

```typescript
{
  productId: number,
  walletAddress: string,   // Vendor wallet
  name: string,
  description: string,
  category: ProductCategory,
  price: number,           // HBAR
  priceUSD?: number,       // USD conversion
  quantity: number,
  weight: number,          // kg
  imageFileId: string,     // Hedera File ID
  imageUrl?: string,       // Generated URL
  txHash: string,          // Blockchain tx
  status: ProductStatus,   // "Available", "Sold Out", "Inactive"

  // Stats
  views: number,
  sales: number,
  revenue: number,

  // Sustainability
  recycledPercentage?: number,
  carbonNeutral?: boolean,

  createdAt: Date,
  updatedAt: Date
}
```

---

## 👨‍💻 Development Guide

### Available Scripts

```bash
# Development
npm run dev              # Start with hot reload (nodemon + tsx)

# Production
npm run build            # Compile TypeScript to JavaScript
npm start                # Start production server

# Database
npm run seed             # Seed database with test data
```

### Code Structure Guidelines

1. **Controllers** - Handle HTTP requests/responses
   - Validate input
   - Call service functions
   - Return formatted responses

2. **Services** - Contain business logic
   - Database operations
   - External API calls
   - Complex computations

3. **Models** - Define data schemas
   - Mongoose schemas
   - Validation rules
   - Indexes

4. **Routes** - Define API endpoints
   - Map URLs to controllers
   - Apply middleware
   - Group related endpoints

### Adding a New Endpoint

1. **Create Controller Function** (`src/controllers/`)

   ```typescript
   export const myNewFunction = async (req: Request, res: Response) => {
     try {
       // Your logic here
       return res.status(200).json({ status: 'success', data: result });
     } catch (error: any) {
       return res.status(500).json({ status: 'error', message: error.message });
     }
   };
   ```

2. **Create Service Function** (`src/services/`) if needed

   ```typescript
   export const myNewService = async (param: string) => {
     // Business logic
     return result;
   };
   ```

3. **Add Route** (`src/routes/`)

   ```typescript
   router.get('/my-endpoint', myNewFunction);
   ```

4. **Update Swagger Documentation** (`src/swagger/swagger.yaml`)
   ```yaml
   /api/v1/my-endpoint:
     get:
       tags:
         - MyCategory
       summary: My endpoint description
       responses:
         '200':
           description: Success response
   ```

### Testing Endpoints

1. **Using Swagger UI**
   - Navigate to http://localhost:5000/api-docs
   - Select server (local/production)
   - Try out endpoints directly

2. **Using Postman**
   - Import Swagger JSON: http://localhost:5000/api-docs/swagger.json
   - Set environment variables
   - Test endpoints

3. **Using cURL**
   ```bash
   curl -X GET http://localhost:5000/api/v1/riders \
     -H "Content-Type: application/json"
   ```

---

## 🚀 Deployment

### Deploying to Render

1. **Create Account** on [Render](https://render.com/)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Set Environment Variables**
   - Add all variables from `.env` in Render dashboard
   - Ensure `NODE_ENV=production`
   - Set `PORT=5000` (or let Render auto-assign)

4. **Deploy**
   - Push to main branch
   - Render automatically builds and deploys

### Environment Variables Checklist for Production

- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `HEDERA_OPERATOR_ID` - Hedera account ID
- [ ] `HEDERA_OPERATOR_KEY` - Hedera private key
- [ ] `HEDERA_NETWORK` - Set to `testnet` or `mainnet`
- [ ] `SUPER_ADMIN_WALLET` - Admin wallet address
- [ ] `DATABASE_URL` - Firebase Realtime Database URL
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase credentials (JSON string)
- [ ] `BACKEND_URL` - Your production URL
- [ ] `NODE_ENV=production`

### Health Monitoring

Monitor your deployed application:

```bash
# Health check endpoint
GET https://your-app.onrender.com/health

# Expected response
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 123456
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem:** Cannot connect to MongoDB

**Solutions:**

```bash
# Test connection locally
mongosh "your_connection_string"

# For MongoDB Atlas:
# 1. Whitelist IP address (0.0.0.0/0 for all IPs)
# 2. Check username/password
# 3. Ensure cluster is running
# 4. Verify network access settings
```

### Hedera SDK Errors

**Problem:** Hedera transactions failing

**Solutions:**

- Verify operator ID format: `0.0.123456` (no extra spaces)
- Check private key format (hex string, no `0x` prefix)
- Ensure sufficient HBAR balance in account
- Confirm network setting (`testnet` vs `mainnet`)
- Check Hedera status: https://status.hedera.com/

### Firebase Connection Issues

**Problem:** Firebase authentication/database not working

**Solutions:**

```bash
# Verify service account key JSON is valid
# Check Firebase Realtime Database rules

# Example rules for development:
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

# For production, implement proper security rules
```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**

```bash
# Find process using port 5000 (macOS/Linux)
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Swagger Documentation Not Loading

**Problem:** 404 error when accessing `/api-docs`

**Solutions:**

- Verify `swagger.yaml` exists in `src/swagger/`
- Check YAML syntax (use online YAML validator)
- Ensure `yamljs` package is installed
- Check console for Swagger loading errors

### File Upload Issues

**Problem:** Document upload failing

**Solutions:**

- Check file size (max 10MB)
- Verify allowed file types: jpg, jpeg, png, pdf, webp
- Ensure Hedera account has sufficient balance
- Check Hedera File Service status
- Verify `HEDERA_OPERATOR_KEY` is correct

### CORS Errors

**Problem:** CORS policy blocking requests

**Solutions:**

- Add your frontend domain to allowed origins in `server.ts`
- For development, origins are already permissive
- For production, update allowed origins list
- Check browser console for specific CORS error

### TypeScript Compilation Errors

**Problem:** Build failing with TS errors

**Solutions:**

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build

# Check for missing type definitions
npm install --save-dev @types/package-name
```

### Getting Help

If you encounter issues not covered here:

1. Check [GitHub Issues](https://github.com/Dev-JoyA/pick-n-get-be/issues)
2. Review API documentation at `/api-docs`
3. Enable debug logging by setting `NODE_ENV=development`
4. Contact support: support@pick-n-get.io

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the Repository**

   ```bash
   git fork https://github.com/Dev-JoyA/pick-n-get-be.git
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit Changes**

   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic
- Keep functions small and focused

### Pull Request Guidelines

- Describe changes clearly
- Reference related issues
- Ensure all tests pass
- Update documentation
- Request review from maintainers

---

## 📄 License

**UNLICENSED** — This project is for research and hackathon purposes only.

---

## 📞 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/Dev-JoyA/pick-n-get-be/issues)
- **Email:** support@pick-n-get.io
- **Documentation:** [Live API Docs](https://pick-n-get-be.onrender.com/api-docs)
- **Hedera Network:** [Testnet Explorer](https://hashscan.io/testnet)

---

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Powered by [Hedera Hashgraph](https://hedera.com/)
- Database by [MongoDB](https://www.mongodb.com/)
- Real-time by [Firebase](https://firebase.google.com/)

---

**Made with 💚 for a sustainable future**
