import request from "supertest";
import app from "../../src/app";
import { connectTestDB, clearTestDB, closeTestDB } from "../helpers/db";
import SweetModel from "../../src/models/sweet.model";
import UserModel from "../../src/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let userToken: string;

beforeAll(async () => {
  await connectTestDB();
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

describe("GET /api/sweets/search", () => {
  beforeEach(async () => {
    await SweetModel.create([
      { name: "Chocolate", category: "Candy", price: 50, quantity: 10 },
      { name: "Lollipop", category: "Candy", price: 10, quantity: 5 },
      { name: "Gulab Jamun", category: "Dessert", price: 20, quantity: 15 },
    ]);
  });

  it("returns sweets matching name", async () => {
    const res = await request(app)
      .get("/api/sweets/search?name=Choc")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.sweets.length).toBe(1);
    expect(res.body.sweets[0].name).toBe("Chocolate");
  });

  it("returns sweets matching category", async () => {
    const res = await request(app)
      .get("/api/sweets/search?category=Candy")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.sweets.length).toBe(2);
  });

  it("returns sweets within price range", async () => {
    const res = await request(app)
      .get("/api/sweets/search?minPrice=15&maxPrice=50")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.sweets.length).toBe(2);
  });

  it("returns 401 if no token", async () => {
    const res = await request(app).get("/api/sweets/search?name=Choc");
    expect(res.status).toBe(401);
  });
});
