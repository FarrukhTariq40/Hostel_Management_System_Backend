const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');

dotenv.config();

const app = express();

// Middleware
// Relax CORS in development so any local frontend (localhost, 127.0.0.1, LAN IP, different ports) can access the API.
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: [
      process.env.FRONTEND_URL || `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`,
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`,
      'https://HostelManagementSystem.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
} else {
  app.use(cors({
    origin: true, // reflect the request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
// OAuth routes removed
// app.use('/api/auth', require('./routes/authOAuth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/accountant', require('./routes/accountant'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/mess', require('./routes/mess'));

// MongoDB Connection
let isConnected = false;
export const connectDB = async () => {
  try {
    if(isConnected)
    {
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: ${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL} and production URLs`);
});

