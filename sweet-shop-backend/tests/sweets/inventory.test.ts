import request from "supertest";
import app from "../../src/app";
import jwt from "jsonwebtoken";
import SweetModel from "../../src/models/sweet.model";
import { connectTestDB, clearTestDB, closeTestDB } from "../helpers/db";

let adminToken: string;
let userToken: string;

beforeAll(async () => {
  await connectTestDB();
  adminToken = jwt.sign({ id: "adminid", role: "admin" }, process.env.JWT_SECRET || "supersecret");
  userToken = jwt.sign({ id: "userid", role: "user" }, process.env.JWT_SECRET || "supersecret");
});

afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe("POST /api/sweets/:id/purchase", () => {
  it("allows a user to purchase a sweet and decreases quantity", async () => {
    const sweet = await SweetModel.create({ name: "Candy", category: "Sweet", price: 10, quantity: 5 });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body.sweet.quantity).toBe(3);
  });

  it("returns 400 if purchase quantity exceeds stock", async () => {
    const sweet = await SweetModel.create({ name: "Candy", category: "Sweet", price: 10, quantity: 1 });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/sweets/:id/restock", () => {
  it("allows admin to restock a sweet", async () => {
    const sweet = await SweetModel.create({ name: "Candy", category: "Sweet", price: 10, quantity: 1 });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.sweet.quantity).toBe(6);
  });

  it("returns 403 if non-admin tries to restock", async () => {
    const sweet = await SweetModel.create({ name: "Candy", category: "Sweet", price: 10, quantity: 1 });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(403);
  });
});
