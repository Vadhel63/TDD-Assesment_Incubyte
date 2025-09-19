import request from "supertest";
import app from "../../src/app";
import { connectTestDB, clearTestDB, closeTestDB } from "../helpers/db";
import UserModel from "../../src/models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("POST /api/auth/login", () => {
  const endpoint = "/api/auth/login";

  it("returns 200 and token + user on valid credentials", async () => {
    const password = "StrongP@ssword";
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      name: "Milan",
      email: "milan@gmail.com",
      password: hashedPassword,
    });

    const res = await request(app).post(endpoint).send({
      email: "milan@gmail.com",
      password: password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toMatchObject({
      email: "milan@gmail.com",
      name: "Milan",
    });
    expect(res.body.user).not.toHaveProperty("password");

    const decoded: any = jwt.decode(res.body.token);
    expect(decoded).toHaveProperty("id");
    expect(decoded).toHaveProperty("role");
  });

  it("returns 401 for wrong password", async () => {
    const password = "RightPass123";
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      name: "Alice",
      email: "alice@example.com",
      password: hashedPassword,
    });

    const res = await request(app).post(endpoint).send({
      email: "alice@example.com",
      password: "WrongPass!",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("returns 401 for non-existing email", async () => {
    const res = await request(app).post(endpoint).send({
      email: "nouser@example.com",
      password: "AnyPass123!",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("stores password hashed in DB for login users", async () => {
    // This is more to check DB setup consistency; optional for login test
    const plain = "CheckHash123!";
    const hashed = await bcrypt.hash(plain, 10);
    await UserModel.create({
      name: "HashUser",
      email: "hashlogin@example.com",
      password: hashed,
    });

    const user = await UserModel.findOne({ email: "hashlogin@example.com" }).select("+password");
    expect(user).toBeTruthy();
    expect(user!.password).not.toBe(plain);
  });
});
