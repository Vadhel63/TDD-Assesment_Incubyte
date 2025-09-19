interface SweetInput {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export function validateSweet(input: SweetInput) {
  const { name, category, price, quantity } = input;

  if (!name || !category || price == null || quantity == null) {
    return "All fields (name, category, price, quantity) are required";
  }

  if (typeof price !== "number" || price < 0) {
    return "Price must be a number >= 0";
  }

  if (typeof quantity !== "number" || quantity < 0) {
    return "Quantity must be a number >= 0";
  }

  return null; 
}
