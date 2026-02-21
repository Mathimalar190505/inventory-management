import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connection.js";
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import supplierRoutes from './routes/supplier.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/supplier',supplierRoutes);

// app.get("/", (req, res) => {
//   res.send("API running without MongoDB 🚀");
// });
const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



