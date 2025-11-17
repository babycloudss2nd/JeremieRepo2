describe("Cart Page E2E Tests", () => {
  const mockCart = [
    {
      _id: "1",
      name: "Product 1",
      price: 100,
      quantity: 2,
      image: "/BACK1.jpg",
    },
    {
      _id: "2",
      name: "Product 2",
      price: 200,
      quantity: 1,
      image: "/BACK1.jpg",
    },
  ];

  beforeEach(() => {
    // Stub all image requests to prevent load timeout
    cy.intercept("GET", "**/*.{jpg,jpeg,png,webp}", { fixture: "BACK1.jpg" }).as("image");

    // Clear storage and cookies
    cy.clearLocalStorage();
    cy.clearCookies();

    // Set mock localStorage and visit cart page
    cy.visit("/cart", {
      onBeforeLoad(win) {
        win.localStorage.setItem("isAuthenticated", "true");
        win.localStorage.setItem("user", JSON.stringify({ email: "test@example.com" }));
        win.localStorage.setItem("cart", JSON.stringify(mockCart));
      },
    });

    // Wait for cart items to render
    cy.get(".cart-item-wrapper", { timeout: 10000 }).should("exist");
  });

  it("renders cart items correctly", () => {
    cy.get(".cart-item-wrapper").should("have.length", mockCart.length);
    cy.get(".item-name").first().should("contain.text", "Product 1");
    cy.get(".item-price").first().should("contain.text", "R100.00");
    cy.get(".quantity-display").first().should("contain.text", "2");
    cy.get(".total-price").first().should("contain.text", "R200.00");
    cy.get(".cart-item-wrapper img").first().should("have.attr", "src").and("include", "/BACK1.jpg");
  });

  it("increases and decreases quantity correctly", () => {
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

  it("calculates totals correctly", () => {
    cy.get(".cart-total").eq(0).should("contain.text", "Subtotal: R400.00");
    cy.get(".cart-total").eq(1).should("contain.text", "Shipping: R50.00");
    cy.get(".cart-total").eq(2).should("contain.text", "Total: R450.00");
  });

  it("shows empty cart message when no items", () => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.visit("/cart", {
      onBeforeLoad(win) {
        win.localStorage.setItem("isAuthenticated", "true");
        win.localStorage.setItem("user", JSON.stringify({ email: "test@example.com" }));
        win.localStorage.setItem("cart", JSON.stringify([]));
      },
    });

    cy.get(".empty-cart", { timeout: 10000 }).should("contain.text", "Your cart is empty.");
  });

  it("navigates with buttons correctly", () => {
    cy.get(".continue-shopping-btn").first().click();
    cy.url({ timeout: 10000 }).should("include", "/products");

    cy.go("back");
    cy.get(".cart-item-wrapper", { timeout: 10000 }).should("exist");

    cy.get(".checkout-btn").click();
    cy.url({ timeout: 10000 }).should("include", "/checkout");
  });
});
