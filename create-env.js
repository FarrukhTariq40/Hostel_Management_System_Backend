const fs = require('fs');
const path = require('path');

const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}

# MongoDB Configuration
# For local MongoDB (uncomment if using local):
MONGODB_URI=mongodb://localhost:27017/hostel_management

# For MongoDB Atlas (Cloud) - Replace with your connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel_management?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=hostel_management_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file in backend directory');
  console.log('📝 Please update MONGODB_URI with your MongoDB connection string');
} else {
  console.log('⚠️  .env file already exists in backend directory');
}











