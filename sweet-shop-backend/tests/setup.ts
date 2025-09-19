// Jest setup file
import mongoose from "mongoose";

// Disconnect from DB after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
