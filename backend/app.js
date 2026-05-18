const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
