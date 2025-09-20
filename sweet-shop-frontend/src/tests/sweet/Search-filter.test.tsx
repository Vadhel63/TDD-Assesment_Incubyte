import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // <- import router wrapper
import UserDashboard from "../../components/UserDashboard";
import { vi, describe, test, expect } from "vitest";

const sweetsMock = [
  { _id: "1", name: "Chocolate Bar", category: "Chocolate", price: 5, quantity: 10 },
  { _id: "2", name: "Gulab Jamun", category: "Traditional", price: 2, quantity: 5 },
];

vi.mock("axios", () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: { sweets: sweetsMock } })),
  },
}));

describe("UserDashboard - Search and Filter", () => {
  test("filters sweets by search input", async () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    // Wait for sweets to render
    const chocolate = await screen.findByText("Chocolate Bar");
    expect(chocolate).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Search sweets...");
    fireEvent.change(searchInput, { target: { value: "Gulab" } });

    expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    expect(screen.queryByText("Chocolate Bar")).toBeNull();
  });

  test("filters sweets by category", async () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    const categorySelect = screen.getByTestId("category-filter");
    fireEvent.change(categorySelect, { target: { value: "Chocolate" } });

    expect(await screen.findByText("Chocolate Bar")).toBeInTheDocument();
    expect(screen.queryByText("Gulab Jamun")).toBeNull();
  });
});
