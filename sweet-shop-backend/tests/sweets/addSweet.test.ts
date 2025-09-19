import request from "supertest";
import app from "../../src/app";
import { connectTestDB, clearTestDB, closeTestDB } from "../helpers/db";
import UserModel from "../../src/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let adminToken: string;
let userToken: string;

beforeAll(async () => {
  await connectTestDB();

  const admin = await UserModel.create({
    name: "Admin",
    email: "admin@example.com",
    password: await bcrypt.hash("AdminPass123", 10),
    role: "admin",
  });
  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || "supersecret");

  const user = await UserModel.create({
    name: "User",
    email: "user@example.com",
    password: await bcrypt.hash("UserPass123", 10),
    role: "user",
  });
  userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "supersecret");
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("POST /api/sweets", () => {
  it("returns 201 and creates sweet if admin", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Chocolate", category: "Candy", price: 50, quantity: 10 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("sweet");
    expect(res.body.sweet.name).toBe("Chocolate");
  });

  it("returns 403 if user is not admin", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Candy", category: "Sweet", price: 10, quantity: 5 });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message", "Admin access required");
  });

  it("returns 400 for missing fields", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Candy" }); // missing category, price, quantity

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("returns 401 if no token", async () => {
    const res = await request(app).post("/api/sweets").send({ name: "Candy", category: "Sweet", price: 10, quantity: 5 });
    expect(res.status).toBe(401);
  });
});
