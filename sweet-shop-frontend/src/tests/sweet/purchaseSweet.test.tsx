import React from "react";
import { render, screen } from "@testing-library/react";
import UserDashboard from "../../components/UserDashboard";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll, describe, test, expect } from "vitest";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter

const sweets = [
  { _id: "1", name: "Chocolate Bar", category: "Chocolate", price: 10, quantity: 5 },
  { _id: "2", name: "Candy Cane", category: "Candy", price: 2, quantity: 0 },
];

const server = setupServer(
  rest.get("http://localhost:5000/api/sweets", (req, res, ctx) => {
    return res(ctx.json({ sweets }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("UserDashboard - Purchase Button", () => {
  test("renders Buy Now button for available sweets", async () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );
    expect(await screen.findByText("Buy Now")).toBeInTheDocument();
  });

  test("disables button for sweets with quantity 0", async () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );
    const outOfStockBtn = await screen.findByText("Out of Stock");
    expect(outOfStockBtn).toBeDisabled();
  });
});
