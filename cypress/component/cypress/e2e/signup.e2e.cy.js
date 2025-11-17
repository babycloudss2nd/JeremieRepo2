describe("Signup Page E2E Tests", () => {
  beforeEach(() => {
    // Use full URL pointing to your running Vite dev server
    cy.visit("http://localhost:5173/signup");
  });

  it("renders signup form correctly", () => {
    cy.get("input[name='name']").should("exist");
    cy.get("input[name='email']").should("exist");
    cy.get("input[name='password']").should("exist");
    cy.get("button[type='submit']").should("contain.text", "Create Account");
  });

  it("shows error message when signup fails", () => {
    cy.intercept("POST", "**/api/signup", {
      statusCode: 400,
      body: { message: "Email already exists" },
    }).as("signupFail");

    cy.get("input[name='name']").type("Test User");
    cy.get("input[name='email']").type("test@example.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").click();

    cy.wait("@signupFail");
    cy.get(".message").should("contain.text", "Email already exists");
  });

  it("signs up successfully and shows message", () => {
    cy.intercept("POST", "**/api/signup", {
      statusCode: 200,
      body: { message: "Signup successful" },
    }).as("signupSuccess");

    cy.get("input[name='name']").type("New User");
    cy.get("input[name='email']").type("newuser@example.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").click();

    cy.wait("@signupSuccess");
    cy.get(".message").should("contain.text", "Signup successful");
  });

  it("redirects to login page when redirect button is clicked", () => {
    cy.get(".login-redirect").click();
    cy.url().should("include", "/login");
  });
});
