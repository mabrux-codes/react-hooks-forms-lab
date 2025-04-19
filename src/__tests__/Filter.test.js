import "@testing-library/jest-dom";
import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Filter from "../components/Filter";
import ShoppingList from "../components/ShoppingList";

const testData = [
  { id: 1, name: "Yogurt", category: "Dairy" },
  { id: 2, name: "Pomegranate", category: "Produce" },
  { id: 3, name: "Lettuce", category: "Produce" },
  { id: 4, name: "String Cheese", category: "Dairy" },
  { id: 5, name: "Swiss Cheese", category: "Dairy" },
  { id: 6, name: "Cookies", category: "Dessert" },
];

function TestApp() {
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(testData);

  function handleSearchChange(event) {
    const searchValue = event.target.value;
    setSearch(searchValue);
    setFilteredItems(
      testData.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }

  return (
    <>
      <Filter search={search} onSearchChange={handleSearchChange} />
      <ShoppingList items={filteredItems} />
    </>
  );
}

// Filter
const noop = () => {};
test("uses a prop of 'search' to display the search term in the input field", () => {
  render(<Filter search="testing" onSearchChange={noop} />);

  expect(screen.queryByPlaceholderText(/Search/).value).toBe("testing");
});

test("calls the onSearchChange callback prop when the input is changed", () => {
  const onChange = jest.fn();
  render(<Filter search="testing" onSearchChange={onChange} />);

  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "testing123" },
  });

  expect(onChange).toHaveBeenCalled();
});

test("the input field acts as a controlled input", () => {
  render(<TestApp />);

  const searchInput = screen.queryByPlaceholderText(/Search/);

  fireEvent.change(searchInput, {
    target: { value: "testing 123" },
  });

  expect(searchInput.value).toBe("testing 123");
});

// Shopping List
test("the shopping list displays all items when initially rendered", () => {
  const { container } = render(<ShoppingList items={testData} />);
  expect(container.querySelector(".Items").children).toHaveLength(
    testData.length
  );
});

test("the shopping filters based on the search term to include full matches", () => {
  render(<TestApp />);

  const searchInput = screen.queryByPlaceholderText(/Search/);

  fireEvent.change(searchInput, {
    target: { value: "Yogurt" },
  });

  expect(screen.queryByText("Yogurt")).toBeInTheDocument();
  expect(screen.queryByText("Lettuce")).not.toBeInTheDocument();
});

test("the shopping filters based on the search term to include partial matches", () => {
  render(<TestApp />);

  const searchInput = screen.queryByPlaceholderText(/Search/);

  fireEvent.change(searchInput, {
    target: { value: "Cheese" },
  });

  expect(screen.queryByText("String Cheese")).toBeInTheDocument();
  expect(screen.queryByText("Swiss Cheese")).toBeInTheDocument();
});
