# MongoDB Setup for FBR Live Invoicing

## Overview
This project now uses MongoDB to store government invoice data with full CRUD operations.

## Database Structure

### Collections
- **govinvoices** - Stores government invoice documents

### Schema Fields
- **Invoice Header**: `invoiceType`, `invoiceDate`, `invoiceRefNo`, `scenarioId`
- **Seller Info**: `sellerNTNCNIC`, `sellerBusinessName`, `sellerAddress`, `sellerProvince`
- **Buyer Info**: `buyerNTNCNIC`, `buyerBusinessName`, `buyerAddress`, `buyerProvince`, `buyerRegistrationType`
- **Items**: Array of invoice items with detailed tax and pricing information
- **Status**: `draft`, `submitted`, `approved`, `rejected`
- **Timestamps**: `createdAt`, `updatedAt`, `submittedAt`

## API Endpoints

### Government Invoices
- `GET /api/gov-invoices` - Get all invoices (with pagination and filtering)
- `GET /api/gov-invoices/:id` - Get single invoice
- `POST /api/gov-invoices` - Create new invoice
- `PUT /api/gov-invoices/:id` - Update invoice
- `DELETE /api/gov-invoices/:id` - Delete invoice
- `PATCH /api/gov-invoices/:id/status` - Update invoice status

## Setup Instructions

### 1. Install MongoDB
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### 2. Start MongoDB Service
```bash
# Ubuntu/Debian
sudo systemctl start mongodb
sudo systemctl enable mongodb

# macOS
brew services start mongodb-community

# Windows
# Start MongoDB service from Services
```

### 3. Environment Configuration
The `.env` file contains:
```
MONGODB_URI=mongodb://localhost:27017/fbr-invoicing
```

### 4. Database Connection
The application automatically:
- Connects to MongoDB on startup
- Creates the database if it doesn't exist
- Creates collections as needed
- Handles connection errors gracefully

## Features

### ✅ Implemented
- **Full CRUD Operations**: Create, Read, Update, Delete invoices
- **Data Validation**: MongoDB schema validation with regex patterns
- **Status Management**: Track invoice status (draft, submitted, approved, rejected)
- **Pagination**: API supports pagination for large datasets
- **Filtering**: Filter by status, seller/buyer NTN/CNIC
- **Error Handling**: Comprehensive error handling and validation
- **Indexes**: Optimized database indexes for better performance
- **Virtual Fields**: Automatic calculation of total amounts

### 🔄 Real-time Updates
- Frontend automatically refreshes after successful invoice creation
- Success/error notifications with auto-dismiss
- Loading states for better UX

## Data Flow
1. **Frontend Form** → React Hook Form + Zod validation
2. **API Call** → `submitGovInvoice()` service function
3. **Backend Route** → `/api/gov-invoices` POST endpoint
4. **Database** → MongoDB document creation
5. **Response** → Success/error feedback to frontend
6. **UI Update** → Refresh invoice list and show notification

## Validation Rules
- **HS Code**: Must match format `XXXX.XXXX`
- **NTN/CNIC**: 7-15 digits only
- **Invoice Date**: YYYY-MM-DD format
- **Scenario ID**: Must match format `SNXXX`
- **Rate**: Must be percentage format (e.g., "17%")
- **Required Fields**: All mandatory fields are validated
- **Item Count**: At least one item required per invoice

## Performance Optimizations
- **Database Indexes**: On frequently queried fields
- **Pagination**: Limits data transfer
- **Error Retry**: Network error retry logic
- **Connection Pooling**: MongoDB connection management
- **Validation**: Client-side validation reduces server load

## Security Features
- **Input Sanitization**: All inputs are validated and sanitized
- **Schema Validation**: MongoDB schema-level validation
- **Error Handling**: No sensitive data in error messages
- **CORS**: Proper CORS configuration
- **Helmet**: Security headers middleware 