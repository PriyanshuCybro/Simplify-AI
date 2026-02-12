// import mongoose from "mongoose";


// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI);
//         console.log(`MongoDB Connected: ${conn.connection.host}`);

//     } catch (error) {
//         console.error(`Error connecting to MongoDB: ${error.message}`);
//         process.exit(1);
//     }
// };

//export default connectDB;


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
