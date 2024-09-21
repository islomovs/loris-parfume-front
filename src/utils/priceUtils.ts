export const formatPrice = (price: any): string => {
  if (typeof price === "string") {
    price = parseFloat(price);
  }

  if (isNaN(price)) {
    return "0"; // Return a default value if price is not a valid number
  }

  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Add spaces every 3 digits
};
