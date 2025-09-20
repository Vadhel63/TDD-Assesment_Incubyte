import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { describe, it, beforeEach, expect } from "vitest";

describe("Auth Flow - Red", () => {
  beforeEach(() => {
    localStorage.clear(); // Reset storage before each test
  });

  it("shows error if registration fields are empty", async () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/all fields are required/i)
    );
  });

  it("registers new user and redirects to login", async () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/name/i), "Test Admin");
    await userEvent.type(screen.getByLabelText(/email/i), "admin10@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.selectOptions(screen.getByLabelText(/role/i), "admin");

    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument()
    );
  });

  it("shows error if login fields are empty", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/email and password required/i)
    );
  });

  it("fails login with wrong credentials", async () => {
    // Pre-register user in localStorage to simulate backend
    localStorage.setItem(
      "users",
      JSON.stringify([{ name: "Test Admin", email: "admin@example.com", password: "password123", role: "admin" }])
    );

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "admin@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/invalid email or password/i)
    );
  });

  it("logs in successfully and redirects to dashboard based on role", async () => {
    // Pre-register user in localStorage
    localStorage.setItem(
      "users",
      JSON.stringify([{ name: "Test Admin", email: "admin@example.com", password: "password123", role: "admin" }])
    );

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "admin@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    
  });
});
