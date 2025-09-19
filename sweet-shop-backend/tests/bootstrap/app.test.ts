import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app"

describe("App Bootstrap", () => {
  beforeAll(async () => {
    // Connect to in-memory MongoDB or test DB
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sweetshop_test";
    await mongoose.connect(uri, { dbName: "sweetshop_test" });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.status).toBe(404);
  });

  it("should connect to the test database", async () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });
});
