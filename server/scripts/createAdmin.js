import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fbr-invoicing');
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@fbr.com' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@fbr.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@fbr.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️ Please change the password after first login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser(); 