import mongoose from "mongoose";

const { MONGO_URL } = process.env;

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("conexão realizada com o banco");
  } catch (error) {
    console.log("erro ao conectar com o banco", error);
  }
};
