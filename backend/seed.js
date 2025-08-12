import bcrypt from "bcrypt";
import User from "./models/User.js";
import { connectDb } from "./config/db.js";

const register = async () => {
  try {
    connectDb();
    const hashPassword = await bcrypt.hash("admin", 10);
    const newUser = new User({
      name: "admin",
      email: "admin@gmail.com",
      password: hashPassword,
      address: "admin address",
      role: "admin",
    });

    await newUser.save();
    console.log("usuario admin criado");
  } catch (error) {
    console.log("não foi possivél criar o usuário", error);
  }
};

register();
