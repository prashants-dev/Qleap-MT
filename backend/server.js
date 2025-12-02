import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/userRoutes.js';
import { testConnection } from './config/db.js';
await testConnection();

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api', authRoutes); 

// Test endpoint
app.get('/', (req, res) => res.send('Backend is running...'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
