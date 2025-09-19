// tests/auth/register.test.ts
import request from "supertest";
import app from "../../src/app";
import { connectTestDB, clearTestDB, closeTestDB } from "../helpers/db";
import UserModel from "../../src/models/user.model";
import jwt from "jsonwebtoken";

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("POST /api/auth/register", () => {
  const endpoint = "/api/auth/register";

  it("returns 201 and token + user shape on valid registration", async () => {
    const res = await request(app).post(endpoint).send({
      name: "Milan",
      email: "milan@gmail.com",
      password: "StrongP@ssword",
    });

    expect(res.status).toBe(201);
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

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post(endpoint).send({
      email: "a@b.com",
      // missing password
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("returns 400 for invalid email", async () => {
    const res = await request(app).post(endpoint).send({
      name: "Bob",
      email: "not-an-email",
      password: "SomePass1!",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("returns 400 for weak password", async () => {
    const res = await request(app).post(endpoint).send({
      name: "Carl",
      email: "carl@example.com",
      password: "123", //weak
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("returns 409 for duplicate email", async () => {
    await request(app).post(endpoint).send({
      name: "D1",
      email: "dupe@example.com",
      password: "StrongP@ss1",
    });

    const res2 = await request(app).post(endpoint).send({
      name: "D2",
      email: "dupe@example.com",
      password: "StrongP@ss2",
    });

    expect(res2.status).toBe(409);
    expect(res2.body).toHaveProperty("message");
  });

  it("stores password hashed in DB", async () => {
    const plain = "SuperSecret123!";
    await request(app).post(endpoint).send({
      name: "HashTest",
      email: "hash@example.com",
      password: plain,
    });

    const user = await UserModel.findOne({ email: "hash@example.com" }).select("+password");
    expect(user).toBeTruthy();
    expect(user!.password).not.toBe(plain);
  });
});
