
import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		console.log("mongo_uri: ", process.env.MONGO_URL);
		const conn = await mongoose.connect(process.env.MONGO_URL as string);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connection to MongoDB: ", error);
		process.exit(1); // 1 is failure, 0 status code is success
	}
};