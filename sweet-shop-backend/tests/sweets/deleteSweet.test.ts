import request from "supertest";
import app from "../../src/app";
import { connectTestDB, clearTestDB, closeTestDB } from "../helpers/db";
import SweetModel from "../../src/models/sweet.model";
import UserModel from "../../src/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let adminToken: string;

beforeAll(async () => {
  await connectTestDB();
  const admin = await UserModel.create({
    name: "Admin",
    email: "admin@example.com",
    password: await bcrypt.hash("AdminPass123", 10),
    role: "admin",
  });
  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || "supersecret");
});

afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe("DELETE /api/sweets/:id", () => {
  it("deletes sweet if admin", async () => {
    const sweet = await SweetModel.create({ name: "Candy", category: "Sweet", price: 10, quantity: 5 });
    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Sweet deleted successfully");
  });

  it("returns 403 if not admin", async () => {
    const sweet = await SweetModel.create({ name: "Candy", category: "Sweet", price: 10, quantity: 5 });
    const userToken = jwt.sign({ id: "123", role: "user" }, process.env.JWT_SECRET || "supersecret");

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it("returns 404 if sweet not found", async () => {
    const res = await request(app)
      .delete(`/api/sweets/64f0b0f0b0f0b0f0b0f0b0f0`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
