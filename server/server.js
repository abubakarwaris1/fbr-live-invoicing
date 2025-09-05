import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import invoiceRoutes from './routes/invoices.js';
import authRoutes from './routes/auth.js';
import { auth } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Changed to 3001 for nginx proxy

// Connect to MongoDB
connectDB();

// Configure helmet with relaxed CSP for development/production
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://api.nepcha.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      // Removed upgradeInsecureRequests to allow HTTP requests
    },
  },
  crossOriginOpenerPolicy: false, // Disable COOP to avoid browser warnings
}));


app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FBR Live Invoicing API is running perfectly',
    timestamp: new Date().toISOString()
  });
});

// Auth routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/gov-invoices', auth, invoiceRoutes);

// Example API endpoint
app.get('/api/example', (req, res) => {
  res.json({
    message: 'This is an example API endpoint',
    data: {
      items: ['item1', 'item2', 'item3'],
      count: 3
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on port ${PORT}`);
  console.log(`🔧 API endpoints available at http://localhost:${PORT}/api`);
});
