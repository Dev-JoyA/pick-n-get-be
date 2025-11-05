# 📡 API Endpoint Reference

Complete reference for all Pick-n-Get Backend API endpoints.

**Base URLs:**

- Production: `https://pick-n-get-be.onrender.com`
- Local: `http://localhost:5000`

**Interactive Documentation:** Visit `/api-docs` for Swagger UI

---

## 📋 Table of Contents

- [Authentication Endpoints](#authentication-endpoints)
- [Rider Management Endpoints](#rider-management-endpoints)
- [Pickup Endpoints](#pickup-endpoints)
- [Agent/Rider Operations](#agentrider-operations)
- [Product & Marketplace](#product--marketplace)
- [Location Tracking](#location-tracking)
- [File Upload](#file-upload)
- [Admin Panel](#admin-panel)
- [Response Formats](#response-formats)

---

## Authentication Endpoints

### Check Wallet Authentication

Verify wallet and get user roles.

```http
POST /api/v1/auth/check-wallet
```

**Request Body:**

```json
{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "walletAddress": "0x1234...",
    "roles": ["Recycler", "Admin"],
    "primaryRole": "Recycler",
    "userData": { ... },
    "riderData": null
  }
}
```

---

### Save User from Contract

Save user data after blockchain registration.

```http
POST /api/v1/auth/save-user
```

**Request Body:**

```json
{
  "walletAddress": "0x1234567890abcdef...",
  "name": "John Doe",
  "phoneNumber": "1234567890",
  "homeAddress": "123 Main St",
  "profilePicture": "0.0.7179369"
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "userId": 1,
    "walletAddress": "0x1234...",
    "roles": ["Recycler"]
  }
}
```

---

### Verify User Phone

Verify or auto-register user by phone number.

```http
POST /api/v1/users/verify-phone
```

**Request Body:**

```json
{
  "phoneNumber": "1234567890"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "User verified successfully",
  "data": {
    "userId": 1,
    "name": "John Doe",
    "phoneNumber": "1234567890",
    "role": ["Recycler"],
    "status": "Active",
    "totalRecycled": 0,
    "totalEarnings": 0,
    "co2Saved": 0
  }
}
```

---

### Sync Vendor Status

Check and sync vendor status from smart contract.

```http
POST /api/v1/auth/sync-vendor-status
```

**Request Body:**

```json
{
  "walletAddress": "0x1234567890abcdef..."
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Vendor status synced successfully",
  "data": {
    "walletAddress": "0x1234...",
    "roles": ["Vendor"],
    "primaryRole": "Vendor",
    "vendorData": {
      "producerId": 1730425537000,
      "isVerified": true
    },
    "syncedFromContract": true
  }
}
```

---

## Rider Management Endpoints

### Register New Rider

Register a rider with documents.

```http
POST /api/v1/riders
```

**Request Body:**

```json
{
  "id": 123,
  "name": "John Doe",
  "phoneNumber": "123",
  "vehicleNumber": "ABC-123-XY",
  "homeAddress": "123 Main St, Lagos",
  "walletAddress": "0x1234567890abcdef...",
  "vehicleType": "Car",
  "country": "Nigeria",
  "capacity": 50,
  "vehicleMakeModel": "Toyota Corolla",
  "vehiclePlateNumber": "LAG-1234-AB",
  "vehicleColor": "Red",
  "profileImage": "QmXx...abc123",
  "driversLicense": "QmYy...def456",
  "vehicleRegistration": "QmZz...ghi789",
  "insuranceCertificate": "QmAa...jkl012",
  "vehiclePhotos": "QmBb...mno345"
}
```

**Required Fields:**

- `id`, `name`, `phoneNumber`, `vehicleNumber`
- `homeAddress`, `vehicleType`, `country`, `capacity`
- `vehicleRegistration`, `vehiclePhotos`

**Vehicle Types:** `Bike`, `Car`, `Truck`, `Van`

**Response (201 Created):**

```json
{
  "status": "success",
  "message": "Rider created successfully with ID: 123",
  "data": {
    "riderId": 123,
    "name": "John Doe",
    "phoneNumber": "123",
    "vehicleType": "Car",
    "approvalStatus": "Pending",
    "walletAddress": "0x1234...",
    "documents": {
      "profileImage": "QmXx...abc123",
      "driversLicense": "QmYy...def456",
      "vehicleRegistration": "QmZz...ghi789",
      "insuranceCertificate": "QmAa...jkl012",
      "vehiclePhotos": "QmBb...mno345"
    }
  }
}
```

**Error Responses:**

- `400` - Validation error or missing fields
- `409` - Rider ID, phone, vehicle number, or wallet already exists

---

### Check Rider Registration

Check if rider is already registered.

```http
GET /api/v1/riders/check/{identifier}
```

**Parameters:**

- `identifier` - Rider ID (number) or wallet address (string)

**Example:**

```http
GET /api/v1/riders/check/123
GET /api/v1/riders/check/0x1234567890abcdef...
```

**Response (200 OK) - Registered:**

```json
{
  "status": "success",
  "isRegistered": true,
  "data": {
    "riderId": 123,
    "name": "John Doe",
    "approvalStatus": "Pending",
    "riderStatus": "Available",
    "vehicleType": "Car",
    "walletAddress": "0x1234..."
  }
}
```

**Response (200 OK) - Not Registered:**

```json
{
  "status": "success",
  "isRegistered": false,
  "message": "No rider found with this identifier"
}
```

---

### Get All Riders

Retrieve list of all registered riders.

```http
GET /api/v1/riders
```

**Response (200 OK):**

```json
{
  "status": "success",
  "count": 25,
  "data": [
    {
      "riderId": 123,
      "name": "John Doe",
      "phoneNumber": "123",
      "vehicleNumber": "ABC-123-XY",
      "walletAddress": "0x1234...",
      "riderStatus": "Available",
      "vehicleType": "Car",
      "approvalStatus": "Approved",
      "country": "Nigeria",
      "capacity": 50,
      "vehicleMakeModel": "Toyota Corolla",
      "hasProfileImage": true,
      "hasDriversLicense": true,
      "hasVehicleRegistration": true,
      "hasInsuranceCertificate": true,
      "hasVehiclePhotos": true,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Rider by ID

Get detailed information about a specific rider.

```http
GET /api/v1/riders/{riderId}
```

**Example:**

```http
GET /api/v1/riders/123
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "riderId": 123,
    "name": "John Doe",
    "phoneNumber": "123",
    "vehicleNumber": "ABC-123-XY",
    "homeAddress": "123 Main St, Lagos",
    "walletAddress": "0x1234...",
    "riderStatus": "Available",
    "vehicleType": "Car",
    "approvalStatus": "Approved",
    "country": "Nigeria",
    "capacity": 50,
    "vehicleMakeModel": "Toyota Corolla",
    "vehiclePlateNumber": "LAG-1234-AB",
    "vehicleColor": "Red",
    "documents": {
      "profileImage": "QmXx...abc123",
      "driversLicense": "QmYy...def456",
      "vehicleRegistration": "QmZz...ghi789",
      "insuranceCertificate": "QmAa...jkl012",
      "vehiclePhotos": "QmBb...mno345"
    },
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### Update Rider Approval Status

Approve or reject a rider (Admin only).

```http
PATCH /api/v1/riders/{riderId}/approval
```

**Request Body:**

```json
{
  "status": "approve"
}
```

**Status Options:** `approve`, `reject`

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Rider approved successfully",
  "data": {
    "riderId": 123,
    "name": "John Doe",
    "approvalStatus": "Approved",
    "vehicleType": "Car",
    "walletAddress": "0x1234..."
  }
}
```

---

## Pickup Endpoints

### Find Nearest Riders

Find available riders for a pickup request.

```http
POST /api/v1/pickups/find-riders
```

**Request Body:**

```json
{
  "pickupAddress": "123 Victoria Island, Lagos, Nigeria",
  "itemWeight": 15.5,
  "country": "Nigeria"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Found 5 available riders",
  "data": {
    "riders": [
      {
        "riderId": 123,
        "name": "John Adebayo",
        "phoneNumber": "234",
        "vehicleNumber": "LAG-123-ABC",
        "vehicleType": "Car",
        "capacity": 50,
        "profileImage": "QmXx...abc123",
        "lat": 6.5244,
        "lng": 3.3792,
        "distance": 2345,
        "duration": 420,
        "eta": "7 mins"
      }
    ],
    "vehicleType": "Car",
    "itemWeight": 15.5
  }
}
```

---

### Create Pickup Request

Create a new pickup request.

```http
POST /api/v1/pickups/create
```

**Request Body:**

```json
{
  "userId": 1,
  "itemId": 1,
  "customerName": "Jane Doe",
  "customerPhoneNumber": "+234123456789",
  "pickupAddress": "123 Main St, Victoria Island, Lagos",
  "pickupCoordinates": {
    "lat": 6.4281,
    "lng": 3.4219
  },
  "itemCategory": "plastic",
  "itemWeight": 15,
  "itemDescription": "Mixed plastic bottles",
  "itemImages": ["QmXx...abc123"],
  "estimatedEarnings": 1800,
  "riderId": 123
}
```

**Required Fields:**

- `userId`, `itemId`, `customerName`, `customerPhoneNumber`
- `pickupAddress`, `itemCategory`, `itemWeight`
- `estimatedEarnings`, `riderId`

**Item Categories:** `plastic`, `metal`, `glass`, `electronic`, `paper`, `textile`

**Response (201 Created):**

```json
{
  "status": "success",
  "message": "Pickup created successfully",
  "data": {
    "trackingId": "REC123456",
    "pickupId": "507f1f77bcf86cd799439011",
    "riderId": 123,
    "riderName": "John Adebayo",
    "riderPhoneNumber": "234",
    "estimatedEarnings": 1800,
    "pickUpStatus": "Pending"
  }
}
```

---

### Track Pickup

Track a pickup by ID.

```http
GET /api/v1/pickups/track/{pickupId}
```

**Example:**

```http
GET /api/v1/pickups/track/507f1f77bcf86cd799439011
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "trackingId": "REC123456",
    "pickupId": "507f1f77bcf86cd799439011",
    "customerName": "Jane Doe",
    "customerPhoneNumber": "+234123456789",
    "pickupAddress": "123 Main St, Lagos",
    "pickupCoordinates": {
      "lat": 6.4281,
      "lng": 3.4219
    },
    "itemCategory": "plastic",
    "itemWeight": 15,
    "itemDescription": "Mixed plastic bottles",
    "estimatedEarnings": 1800,
    "pickUpStatus": "InTransit",
    "riderId": 123,
    "riderName": "John Adebayo",
    "riderPhoneNumber": "234",
    "requestedAt": "2025-01-15T10:30:00Z",
    "acceptedAt": "2025-01-15T10:35:00Z",
    "collectedAt": null,
    "deliveredAt": null
  }
}
```

---

### Get User Active Pickups

Get all active pickups for a user.

```http
GET /api/v1/pickups/user/{userId}/active
```

**Example:**

```http
GET /api/v1/pickups/user/1/active
```

**Response (200 OK):**

```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "trackingId": "REC123456",
      "pickupId": "507f1f77bcf86cd799439011",
      "customerName": "Jane Doe",
      "pickupAddress": "123 Main St, Lagos",
      "itemCategory": "plastic",
      "itemWeight": 15,
      "estimatedEarnings": 1800,
      "pickUpStatus": "InTransit",
      "riderName": "John Adebayo",
      "requestedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get User Pickup History

Get completed/cancelled pickups for a user.

```http
GET /api/v1/pickups/user/{userId}/history
```

**Example:**

```http
GET /api/v1/pickups/user/1/history
```

**Response (200 OK):**

```json
{
  "status": "success",
  "count": 10,
  "data": [
    {
      "trackingId": "REC123456",
      "itemCategory": "plastic",
      "itemWeight": 15,
      "estimatedEarnings": 1800,
      "pickUpStatus": "Delivered",
      "riderName": "John Adebayo",
      "requestedAt": "2025-01-15T10:30:00Z",
      "deliveredAt": "2025-01-15T12:00:00Z"
    }
  ]
}
```

---

## Agent/Rider Operations

### Get Agent Active Pickups

Get all active pickups for an agent.

```http
GET /api/v1/agents/{riderId}/pickups/active
```

**Example:**

```http
GET /api/v1/agents/123/pickups/active
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Found 2 active pickups",
  "data": {
    "count": 2,
    "pickups": [
      {
        "trackingId": "REC123456",
        "pickupId": "507f1f77bcf86cd799439011",
        "customerName": "Jane Doe",
        "customerPhoneNumber": "+234123456789",
        "pickupAddress": "123 Main St, Lagos",
        "itemCategory": "plastic",
        "itemWeight": 15,
        "estimatedEarnings": 1800,
        "pickUpStatus": "InTransit",
        "requestedAt": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### Get Available Pickup Jobs

Get pending pickups assigned to an agent.

```http
GET /api/v1/agents/{riderId}/pickups/available?limit=10
```

**Query Parameters:**

- `limit` (optional) - Max number of jobs to return (default: 10)

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Found 5 available jobs",
  "data": {
    "count": 5,
    "jobs": [
      {
        "trackingId": "REC123456",
        "pickupId": "507f1f77bcf86cd799439011",
        "customerName": "Jane Doe",
        "pickupAddress": "123 Main St, Lagos",
        "itemCategory": "plastic",
        "itemWeight": 15,
        "estimatedEarnings": 1800,
        "pickUpStatus": "Pending",
        "requestedAt": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### Accept Pickup Job

Accept a pending pickup.

```http
POST /api/v1/agents/{riderId}/pickups/{pickupId}/accept
```

**Example:**

```http
POST /api/v1/agents/123/pickups/507f1f77bcf86cd799439011/accept
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Pickup accepted successfully",
  "data": {
    "trackingId": "REC123456",
    "newStatus": "InTransit"
  }
}
```

**Error Responses:**

- `400` - Pickup not in pending status or not assigned to rider
- `404` - Pickup not found

---

### Update Pickup Status

Update pickup status (InTransit → PickedUp → Delivered).

```http
PATCH /api/v1/agents/{riderId}/pickups/{pickupId}/status
```

**Request Body:**

```json
{
  "status": "PickedUp"
}
```

**Status Options:** `InTransit`, `PickedUp`, `Delivered`, `Cancelled`

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Pickup status updated to PickedUp",
  "data": {
    "trackingId": "REC123456",
    "newStatus": "PickedUp"
  }
}
```

---

### Get Agent Statistics

Get agent performance metrics.

```http
GET /api/v1/agents/{riderId}/stats
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "totalPickups": 156,
    "totalEarnings": 2450.75,
    "weeklyPickups": 8,
    "rating": 4.8,
    "completionRate": 96
  }
}
```

---

## Product & Marketplace

### Register Producer/Vendor

Register as a product vendor.

```http
POST /api/v1/products/producers
```

**Request Body:**

```json
{
  "registrationId": 1730425537000,
  "walletAddress": "0x0e54c9054f000849a5f82d53914daaf97f306e95",
  "name": "Matthew Idungafa",
  "businessName": "Matthew Eco Products",
  "country": "Nigeria",
  "phoneNumber": "2348123456789"
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "message": "Producer registered successfully",
  "data": {
    "producerId": 1730425537000,
    "walletAddress": "0x0e54...",
    "name": "Matthew Idungafa",
    "businessName": "Matthew Eco Products"
  }
}
```

**Error Responses:**

- `400` - Missing required fields
- `409` - Producer already registered

---

### Add Product

Add a new product to marketplace.

```http
POST /api/v1/products
```

**Request Body:**

```json
{
  "productId": 1,
  "walletAddress": "0x0e54c9054f000849a5f82d53914daaf97f306e95",
  "name": "Recycled Tote Bag",
  "description": "Eco-friendly bag made from recycled materials",
  "category": "Bags & Accessories",
  "price": 10,
  "priceUSD": 0.5,
  "quantity": 20,
  "weight": 0.5,
  "imageFileId": "0.0.7179369",
  "txHash": "0x306c58ea...",
  "recycledPercentage": 85,
  "carbonNeutral": true
}
```

**Categories:**

- `Bags & Accessories`
- `Furniture`
- `Office Supplies`
- `Fitness & Wellness`
- `Home & Garden`
- `Textiles`
- `Electronics`
- `Others`

**Response (201 Created):**

```json
{
  "status": "success",
  "message": "Product added successfully",
  "data": {
    "productId": 1,
    "name": "Recycled Tote Bag",
    "price": 10,
    "priceUSD": 0.5,
    "imageUrl": "https://pick-n-get-be.onrender.com/api/v1/upload/file/0.0.7179369",
    "txHash": "0x306c58ea..."
  }
}
```

---

### Get All Products

Get products for shop page.

```http
GET /api/v1/products?status=Available&category=Bags+%26+Accessories&limit=50&offset=0
```

**Query Parameters:**

- `status` (optional) - `Available`, `Sold Out`, `Inactive` (default: Available)
- `category` (optional) - Filter by category
- `limit` (optional) - Max results (default: 50)
- `offset` (optional) - Pagination offset (default: 0)

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "productId": 1,
        "walletAddress": "0x0e54...",
        "name": "Recycled Tote Bag",
        "description": "Eco-friendly bag",
        "category": "Bags & Accessories",
        "price": 10,
        "priceUSD": 0.5,
        "quantity": 20,
        "weight": 0.5,
        "imageUrl": "https://.../file/0.0.7179369",
        "status": "Available",
        "views": 45,
        "sales": 3,
        "revenue": 30,
        "recycledPercentage": 85,
        "carbonNeutral": true,
        "createdAt": "2025-01-15T10:30:00Z"
      }
    ],
    "total": 15,
    "limit": 50,
    "offset": 0
  }
}
```

---

### Get Product by ID

Get detailed product information.

```http
GET /api/v1/products/{productId}
```

**Example:**

```http
GET /api/v1/products/1
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "productId": 1,
    "walletAddress": "0x0e54...",
    "name": "Recycled Tote Bag",
    "description": "Eco-friendly bag made from recycled materials",
    "category": "Bags & Accessories",
    "price": 10,
    "priceUSD": 0.5,
    "quantity": 20,
    "weight": 0.5,
    "imageFileId": "0.0.7179369",
    "imageUrl": "https://.../file/0.0.7179369",
    "txHash": "0x306c58ea...",
    "status": "Available",
    "views": 46,
    "sales": 3,
    "revenue": 30,
    "recycledPercentage": 85,
    "carbonNeutral": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T14:20:00Z"
  }
}
```

---

### Get Vendor Statistics

Get vendor performance metrics.

```http
GET /api/v1/products/vendors/{walletAddress}/stats
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "totalProducts": 15,
    "totalRevenue": 450,
    "totalSales": 32,
    "avgRating": 4.7,
    "monthlyGrowth": 15.2
  }
}
```

---

### Record Product Sale

Record a sale after blockchain purchase.

```http
POST /api/v1/products/{productId}/sale
```

**Request Body:**

```json
{
  "quantity": 2,
  "totalAmount": 20,
  "customerWalletAddress": "0x1234...",
  "customerName": "John Doe",
  "deliveryAddress": "123 Main St, Lagos",
  "txHash": "0xabc123..."
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "message": "Sale recorded successfully",
  "data": {
    "orderId": "ORD-1705328400000",
    "productId": 1,
    "remainingQuantity": 18
  }
}
```

---

### Get Conversion Rate

Get HBAR to USD conversion rate.

```http
GET /api/v1/products/conversion/hbar-to-usd?amount=10
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "hbar": 10,
    "usd": 0.5,
    "rate": 0.05
  }
}
```

---

## Location Tracking

### Update Rider Location

Update rider's real-time location.

```http
POST /api/v1/location/update
```

**Request Body:**

```json
{
  "riderId": 123,
  "lat": 6.5244,
  "lng": 3.3792,
  "heading": 45
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Location updated successfully"
}
```

---

### Get Rider Location

Retrieve rider's current location.

```http
GET /api/v1/location/{riderId}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "lat": 6.5244,
    "lng": 3.3792,
    "heading": 45,
    "timestamp": 1672531200000
  }
}
```

---

### Remove Rider Location

Delete rider location (go offline).

```http
DELETE /api/v1/location/{riderId}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Location removed successfully"
}
```

---

## File Upload

### Upload Single Document

Upload a document to Hedera File Service.

```http
POST /api/v1/upload/document
Content-Type: multipart/form-data
```

**Form Data:**

- `file` - The file to upload (max 10MB)

**Allowed Types:** jpg, jpeg, png, pdf, webp

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "File uploaded successfully to Hedera File Service",
  "data": {
    "fileId": "0.0.12345678",
    "fileName": "drivers-license.pdf",
    "fileSize": 524288,
    "mimeType": "application/pdf",
    "uploadedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### Upload Multiple Documents

Upload multiple documents at once.

```http
POST /api/v1/upload/documents
Content-Type: multipart/form-data
```

**Form Data:**

- `files` - Array of files (max 10 files, 10MB each)

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Uploaded 4 of 4 files",
  "data": {
    "uploaded": [
      {
        "fileName": "profile.jpg",
        "fileId": "0.0.12345678",
        "fileSize": 102400,
        "mimeType": "image/jpeg"
      }
    ],
    "failed": []
  }
}
```

---

### Retrieve File from Hedera

Get file content from Hedera File Service.

```http
GET /api/v1/upload/file/{fileId}
```

**Example:**

```http
GET /api/v1/upload/file/0.0.7179369
```

**Response:**

- Returns the file content directly
- Content-Type set based on file type
- Cached for 1 year

---

## Admin Panel

### Get Dashboard Statistics

Get overview dashboard stats.

```http
GET /api/v1/admin/stats/dashboard
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Dashboard statistics fetched successfully",
  "data": {
    "totalUsers": 1245,
    "activeUsers": 980,
    "totalRiders": 156,
    "activeAgents": 89,
    "verifiedVendors": 45,
    "pendingApprovals": 12,
    "platformRevenue": "$45,230",
    "totalEarnings": 45230,
    "userGrowthRate": "+12.5%",
    "pickupGrowthRate": "+8.3%",
    "approvedToday": 5,
    "rejectedToday": 1,
    "systemUptime": "99.8%",
    "transactionSuccessRate": "96.2%"
  }
}
```

---

### Get User Statistics

Get detailed user statistics.

```http
GET /api/v1/admin/stats/users
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "total": 1245,
    "byStatus": {
      "active": 980,
      "inactive": 200,
      "suspended": 5
    },
    "byRole": {
      "recyclers": 1200,
      "admins": 3,
      "superAdmins": 1
    },
    "engagement": {
      "usersWithPickups": 850,
      "engagementRate": "68.3"
    },
    "topRecyclers": [...]
  }
}
```

---

### Get Rider Statistics

Get detailed rider statistics.

```http
GET /api/v1/admin/stats/riders
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "total": 156,
    "byStatus": {
      "pending": 12,
      "approved": 120,
      "rejected": 24
    },
    "byVehicleType": {
      "Car": 80,
      "Bike": 50,
      "Van": 20,
      "Truck": 6
    },
    "operational": {
      "available": 89,
      "onTrip": 15,
      "offline": 52
    },
    "approvalRate": "76.9"
  }
}
```

---

### Get Recent Activity

Get recent platform activity.

```http
GET /api/v1/admin/activity/recent?limit=10
```

**Query Parameters:**

- `limit` (optional) - Max activities to return (1-50, default: 10)

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "activities": [
      {
        "type": "user_registration",
        "message": "New user registered: John Doe",
        "timestamp": "2025-01-15T10:30:00Z",
        "details": {
          "roles": ["Recycler"]
        }
      },
      {
        "type": "rider_approval",
        "message": "Car rider approved: Jane Smith",
        "timestamp": "2025-01-15T10:25:00Z",
        "details": {
          "vehicleType": "Car"
        }
      }
    ],
    "summary": {
      "newUsers": 5,
      "newRiders": 3,
      "newPickups": 12,
      "newApprovals": 2
    }
  }
}
```

---

### Get System Alerts

Get system health alerts.

```http
GET /api/v1/admin/alerts/system
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "alerts": [
      {
        "id": "high_pending_riders",
        "type": "warning",
        "title": "High Pending Approvals",
        "message": "12 riders awaiting approval",
        "timestamp": "2025-01-15T10:30:00Z",
        "priority": "medium"
      }
    ],
    "alertCount": 1,
    "systemHealth": "warning"
  }
}
```

**Alert Types:** `error`, `warning`, `info`  
**Priorities:** `low`, `medium`, `high`  
**System Health:** `healthy`, `warning`, `critical`

---

### Get Pending Riders

Get all riders pending approval.

```http
GET /api/v1/admin/riders/pending
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Found 5 pending riders",
  "data": {
    "count": 5,
    "riders": [
      {
        "riderId": 123,
        "name": "John Doe",
        "phoneNumber": "123",
        "vehicleType": "Car",
        "approvalStatus": "Pending",
        "documents": {...},
        "createdAt": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### Admin Check Wallet

Verify admin wallet credentials.

```http
POST /api/v1/admin/auth/check-wallet
```

**Request Body:**

```json
{
  "walletAddress": "0x1234567890abcdef..."
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "walletAddress": "0x1234...",
    "roles": ["Admin", "SuperAdmin"],
    "primaryRole": "Admin",
    "userData": {...},
    "riderData": null
  }
}
```

---

## Response Formats

### Success Response

```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description",
  "errors": ["Specific error 1", "Specific error 2"]
}
```

### Common Status Codes

| Code | Meaning               | Usage                              |
| ---- | --------------------- | ---------------------------------- |
| 200  | OK                    | Successful GET/PATCH/DELETE        |
| 201  | Created               | Successful POST (resource created) |
| 400  | Bad Request           | Invalid input data                 |
| 401  | Unauthorized          | Authentication required            |
| 403  | Forbidden             | Insufficient permissions           |
| 404  | Not Found             | Resource doesn't exist             |
| 409  | Conflict              | Resource already exists            |
| 500  | Internal Server Error | Server-side error                  |

---

## Rate Limiting

Current rate limit: **100 requests per minute per IP**

If exceeded, you'll receive:

```json
{
  "status": "error",
  "message": "Too many requests, please try again later"
}
```

---

## Additional Resources

- **Interactive API Docs:** https://pick-n-get-be.onrender.com/api-docs
- **Hedera Explorer:** https://hashscan.io/testnet
- **GitHub Repository:** https://github.com/Dev-JoyA/pick-n-get-be
- **Support Email:** support@pick-n-get.io

---

**Last Updated:** January 2025  
**API Version:** 1.0.0
