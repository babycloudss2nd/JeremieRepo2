
describe("Cart Page E2E Tests", () => {
  const mockCart = [
    { _id: "1", name: "Product 1", price: 100, quantity: 2, image: "" },
    { _id: "2", name: "Product 2", price: 200, quantity: 1, image: "" },
  ];

  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("isAuthenticated", "true");
        win.localStorage.setItem(
          "user",
          JSON.stringify({ email: "test@example.com" })
        );
        win.localStorage.setItem("cart", JSON.stringify(mockCart));
      },
    });

    // Navigate to /cart via direct visit to avoid missing React Router links
    cy.visit("/cart");
    // Wait for cart items to render
    cy.get(".cart-item-wrapper", { timeout: 15000 }).should("exist");
  });

  it("renders cart items correctly", () => {
    cy.get(".cart-item-wrapper").should("have.length", mockCart.length);
    cy.get(".item-name").first().should("contain.text", "Product 1");
    cy.get(".item-price").first().should("contain.text", "R100.00");
    cy.get(".quantity-display").first().should("contain.text", "2");
    cy.get(".total-price").first().should("contain.text", "R200.00");
  });

  it("increases and decreases quantity", () => {
    cy.get(".cart-item-wrapper").first().find(".quantity-btn").last().click();
    cy.get(".quantity-display").first().should("contain.text", "3");
    cy.get(".total-price").first().should("contain.text", "R300.00");

    cy.get(".cart-item-wrapper").first().find(".quantity-btn").first().click();
    cy.get(".quantity-display").first().should("contain.text", "2");
    cy.get(".total-price").first().should("contain.text", "R200.00");
  });

  it("removes item from cart", () => {
    cy.get(".cart-item-wrapper").first().find(".remove-btn").click();
    cy.get(".cart-item-wrapper").should("have.length", mockCart.length - 1);
  });

  it("calculates subtotal, shipping, and total correctly", () => {
    cy.get(".cart-total").eq(0).should("contain.text", "Subtotal: R400.00");
    cy.get(".cart-total").eq(1).should("contain.text", "Shipping: R50.00");
    cy.get(".cart-total").eq(2).should("contain.text", "Total: R450.00");
  });

  it("shows empty cart message when cart is empty", () => {
    cy.window().then((win) =>
      win.localStorage.setItem("cart", JSON.stringify([]))
    );
    cy.visit("/cart");
    cy.get(".empty-cart").should("contain.text", "Your cart is empty.");
  });

  it("navigates correctly with buttons", () => {
    cy.get(".continue-shopping-btn").first().click();
    cy.url().should("include", "/products");

    cy.visit("/cart");
    cy.get(".checkout-btn").click();
    cy.url().should("include", "/checkout");
  });
});
