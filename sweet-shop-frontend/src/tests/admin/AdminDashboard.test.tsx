import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../../components/AdminDashboard";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Admin Dashboard Sweet Management (TDD)", () => {
  beforeEach(() => {
    localStorage.setItem("role", "admin");
    localStorage.setItem("token", "fake-jwt-token");
    mockedAxios.get.mockResolvedValue({ data: { sweets: [] } });
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("displays admin dashboard title", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome! You are logged in as/i)).toBeInTheDocument();
  });

  it("adds a new sweet successfully", async () => {
    const sweet = { _id: "1", name: "Chocolate", category: "Candy", price: 50, quantity: 20 };
    mockedAxios.post.mockResolvedValue({ data: { sweet } });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText(/Sweet Name/i);
    const categoryInput = screen.getByRole("combobox"); // assuming category is a <select>
    const priceInput = screen.getByPlaceholderText(/Price/i);
    const quantityInput = screen.getByPlaceholderText(/Quantity/i);
    const addButton = screen.getByRole("button", { name: /Add Sweet/i });

    await userEvent.type(nameInput, sweet.name);
    await userEvent.selectOptions(categoryInput, sweet.category);
    await userEvent.type(priceInput, sweet.price.toString());
    await userEvent.type(quantityInput, sweet.quantity.toString());
    await userEvent.click(addButton);

    await waitFor(() => {
      const row = screen.getByTestId(`sweet-${sweet._id}`);
      expect(within(row).getByText(sweet.name)).toBeInTheDocument();
      expect(within(row).getByText(sweet.category)).toBeInTheDocument();
      expect(within(row).getByText(sweet.price.toFixed(2))).toBeInTheDocument();
      expect(within(row).getByText(sweet.quantity.toString())).toBeInTheDocument();
    });
  });

  it("updates an existing sweet", async () => {
    const sweet = { _id: "1", name: "Chocolate", category: "Candy", price: 50, quantity: 20 };
    mockedAxios.get.mockResolvedValue({ data: { sweets: [sweet] } });
    mockedAxios.put.mockResolvedValue({ data: { sweet: { ...sweet, price: 60 } } });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    const editButton = await screen.findByTestId("edit-1");
    await userEvent.click(editButton);

    const priceInput = screen.getByPlaceholderText(/Price/i);
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, "60");

    const saveButton = screen.getByRole("button", { name: /Update Sweet/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      const row = screen.getByTestId("sweet-1");
      expect(within(row).getByText("60.00")).toBeInTheDocument();
    });
  });

  it("deletes a sweet", async () => {
    const sweet = { _id: "1", name: "Chocolate", category: "Candy", price: 50, quantity: 20 };
    mockedAxios.get.mockResolvedValue({ data: { sweets: [sweet] } });
    mockedAxios.delete.mockResolvedValue({ data: { message: "Sweet deleted successfully" } });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    const deleteButton = await screen.findByTestId("delete-1");

    // Mock window.confirm to always return true
    vi.spyOn(window, "confirm").mockReturnValue(true);

    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByTestId("sweet-1")).not.toBeInTheDocument();
    });
  });
});
