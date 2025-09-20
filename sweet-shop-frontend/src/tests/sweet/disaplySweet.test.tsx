import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import UserDashboard from "../../components/UserDashboard";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll, describe, test, expect } from "vitest";

const sweets = [
  { _id: "1", name: "Chocolate Bar", category: "Chocolate", price: 10, quantity: 5 },
  { _id: "2", name: "Gummy Bears", category: "Candy", price: 5, quantity: 50 },
];

const server = setupServer(
  rest.get("http://localhost:5000/api/sweets", (req, res, ctx) => {
    return res(ctx.json({ sweets }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("UserDashboard - Display Sweets", () => {
  test("fetches and displays sweets", async () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Chocolate Bar")).toBeInTheDocument();
      expect(screen.getByText("Gummy Bears")).toBeInTheDocument();
    });
  });

  test("shows message when no sweets are available", async () => {
    server.use(
      rest.get("http://localhost:5000/api/sweets", (req, res, ctx) => {
        return res(ctx.json({ sweets: [] }));
      })
    );

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No sweets available")).toBeInTheDocument();
    });
  });
});
