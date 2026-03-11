import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js"; // Adjust the path if needed

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/poss-db")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const createUser = async () => {
  try {
    const email = "customer@gmail.com"; // Change to admin if needed
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(`User with email ${email} already exists!`);
      return mongoose.disconnect();
    }

    const hashedPassword = await bcrypt.hash("123456", 10); // password for new user

    const user = new User({
      name: "Test Customer",
      email,
      password: hashedPassword,
      role: "customer", // Change to "admin" if you want admin
      address: "123 Test Street",
    });

    await user.save();
    console.log(`User created successfully! Email: ${email} | Password: 123456`);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    mongoose.disconnect();
  }
};

createUser();