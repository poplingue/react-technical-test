import React from "react";
import { describe, it, expect, test, beforeAll, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./../src/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let queryClient;

beforeEach(() => {
  queryClient = new QueryClient();
});

beforeAll(() => {
  // Mock matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("Regression Test Suite", () => {
  test("App renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
  });

  test("Core components render correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );

    const sidebar = screen.getByTestId("Sidebar");
    const messagesPan = screen.getByTestId("MessagesPane");
    expect(sidebar).toBeInTheDocument();
    expect(messagesPan).toBeInTheDocument();
  });

  test("Core functionality continues to work after changes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );

    const input = screen.getByPlaceholderText("7901");
    fireEvent.change(input, { target: { value: "8888" } });

    expect(input.value).toBe("8888");
  });
});
