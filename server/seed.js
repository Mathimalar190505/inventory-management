import bcrypt from "bcrypt";
import User from "./models/User.js";
import connectDB from "./db/connection.js";

const register = async () => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email: "admin10@gmail.com" });

    if (existingUser) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashPassword = await bcrypt.hash("admin", 10);

    const newUser = new User({
      name: "admin",
      email: "admin10@gmail.com",
      password: hashPassword,
      address: "admin address",
      role: "admin"
    });

    await newUser.save();

    console.log("Admin user created successfully");

    process.exit();

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

register();
