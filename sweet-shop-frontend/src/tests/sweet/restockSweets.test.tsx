import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminDashboard from "../../components/AdminDashboard";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll, describe, test, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";

// Mock data
const sweets = [
  { _id: "1", name: "Chocolate Bar", category: "Chocolate", price: 10, quantity: 5 },
];

// MSW server
const server = setupServer(
  rest.get("http://localhost:5000/api/sweets", (req, res, ctx) => {
    return res(ctx.json({ sweets }));
  }),
  rest.post("http://localhost:5000/api/sweets/:id/restock", (req, res, ctx) => {
    const { id } = req.params;
    const sweet = sweets.find((s) => s._id === id);
    if (!sweet) return res(ctx.status(404), ctx.json({ message: "Sweet not found" }));
    sweet.quantity += req.body.quantity;
    return res(ctx.json({ sweet }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Helper to wrap with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("AdminDashboard Restock Sweet", () => {
  test("fetches and displays sweets", async () => {
    renderWithRouter(<AdminDashboard />);
    expect(await screen.findByText("Chocolate Bar")).toBeInTheDocument();
  });

  test("restocks a sweet successfully", async () => {
    renderWithRouter(<AdminDashboard />);

    const restockInput = await screen.findByPlaceholderText("Restock qty") as HTMLInputElement;
    fireEvent.change(restockInput, { target: { value: "10" } });

    fireEvent.click(screen.getByText("Restock"));

    await waitFor(() => {
      expect(screen.getByText("Quantity: 15")).toBeInTheDocument(); // previous 5 + restocked 10
    });
  });

  test("shows alert when sweet not found during restock", async () => {
    server.use(
      rest.post("http://localhost:5000/api/sweets/:id/restock", (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ message: "Sweet not found" }));
      })
    );

    renderWithRouter(<AdminDashboard />);

    const restockInput = await screen.findByPlaceholderText("Restock qty") as HTMLInputElement;
    fireEvent.change(restockInput, { target: { value: "10" } });

    window.alert = vi.fn();
    fireEvent.click(screen.getByText("Restock"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Sweet not found");
    });
  });
});
