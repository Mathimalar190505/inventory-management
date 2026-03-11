import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js"; // Adjust the path if needed

dotenv.config();

// Connect to your database
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/poss-db")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const createUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10); // password for new user

    const user = new User({
      name: "Test Customer",
      email: "customer@test.com",
      password: hashedPassword,
      role: "customer", // Change to "admin" if you want admin user
      address: "123 Test Street"
    });

    await user.save();
    console.log("User created successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error creating user:", error);
    mongoose.disconnect();
  }
};
