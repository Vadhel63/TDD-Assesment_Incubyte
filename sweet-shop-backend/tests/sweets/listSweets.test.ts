import request from "supertest";
import app from "../../src/app";
import { connectTestDB, clearTestDB, closeTestDB } from "../helpers/db";
import UserModel from "../../src/models/user.model";
import SweetModel from "../../src/models/sweet.model";
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

describe("GET /api/sweets", () => {
  it("returns list of sweets for admin", async () => {
    await SweetModel.create([{ name: "Chocolate", category: "Candy", price: 50, quantity: 10 }]);

    const res = await request(app).get("/api/sweets").set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.sweets.length).toBe(1);
  });

  it("returns list of sweets for normal user", async () => {
    await SweetModel.create([{ name: "Lollipop", category: "Candy", price: 10, quantity: 5 }]);

    const res = await request(app).get("/api/sweets").set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.sweets.length).toBe(1);
  });

  it("returns empty array if no sweets", async () => {
    const res = await request(app).get("/api/sweets").set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.sweets).toEqual([]);
  });

  it("returns 401 if no token", async () => {
    const res = await request(app).get("/api/sweets");
    expect(res.status).toBe(401);
  });
});
