describe("Products Page E2E Tests", () => {
  beforeEach(() => {
    // Simulate logged-in user for ProtectedRouteWrapper
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("isAuthenticated", "true");
        win.localStorage.setItem(
          "user",
          JSON.stringify({ email: "test@example.com" })
        );
        win.localStorage.setItem("cart", JSON.stringify([]));
      },
    });

    // Intercept API response for products
    cy.intercept("GET", "**/api/products", {
      statusCode: 200,
      body: [
        {
          _id: "1",
          name: "Product 1",
          description: "Desc 1",
          benefit: "Benefit 1",
          price: 100,
          category: "Category A",
          image: "",
        },
        {
          _id: "2",
          name: "Product 2",
          description: "Desc 2",
          benefit: "Benefit 2",
          price: 200,
          category: "Category B",
          image: "",
        },
      ],
    }).as("getProducts");

    // Now visit the products page
    cy.visit("/products");
  });

  it("renders products correctly", () => {
    cy.wait("@getProducts");
    cy.get(".page-title").should("contain.text", "Our Products");

    cy.get(".category-title").should("have.length", 2);
    cy.get(".product-card").should("have.length", 2);

    cy.get(".product-name").first().should("contain.text", "Product 1");
    cy.get(".product-price").first().should("contain.text", "R100");
  });

  it("filters products when searching", () => {
    cy.wait("@getProducts");

    cy.get(".search-bar input").type("Product 1");
    cy.get(".product-card").should("have.length", 1);
    cy.get(".product-name").first().should("contain.text", "Product 1");
  });

  it("adds products to cart", () => {
    cy.wait("@getProducts");

    cy.window().then((win) => {
      win.alert = cy.stub(); // Stub alert
    });

    cy.get(".product-card").first().find(".add-to-cart").click();
    cy.window().its("alert").should("have.been.calledWith", "Product 1 added to cart ✅");

    // Add the same product again
    cy.get(".product-card").first().find(".add-to-cart").click();
    cy.window().its("alert").should("have.been.calledWith", "Product 1 quantity updated in cart ✅");
  });

  it("displays error message if API fails", () => {
    cy.intercept("GET", "**/api/products", {
      statusCode: 500,
      body: { message: "Server error" },
    }).as("getProductsFail");

    cy.visit("/products");
    cy.wait("@getProductsFail");
    cy.get(".error-message").should("contain.text", "Backend connection failed");
  });

  it("shows 'No products found' if filtered search has no results", () => {
    cy.wait("@getProducts");

    cy.get(".search-bar input").type("Nonexistent Product");
    cy.get(".no-products").should("contain.text", "No products found");
  });
});
