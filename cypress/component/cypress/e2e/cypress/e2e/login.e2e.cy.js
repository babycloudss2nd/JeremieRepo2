/// <reference types="cypress" />

describe("Login Page E2E Tests", () => {
  const API_BASE_URL = "http://localhost:5000"; // make sure this matches your backend

  beforeEach(() => {
    cy.visit("/login"); // open the login page
  });

  it("renders login form correctly", () => {
    cy.get("h2").should("contain.text", "Login");
    cy.get("input[name='email']").should("exist");
    cy.get("input[name='password']").should("exist");
    cy.get("button[type='submit']").should("contain.text", "Log In");
    cy.get(".login-redirect").should("contain.text", "Don't have an account? Sign up");
  });

  it("shows error message for invalid login", () => {
    // intercept backend API call and simulate 401
    cy.intercept("POST", `${API_BASE_URL}/api/login`, {
      statusCode: 401,
      body: { message: "Invalid credentials" },
    }).as("loginFail");

    cy.get("input[name='email']").type("wrong@example.com");
    cy.get("input[name='password']").type("wrongpass");
    cy.get("button[type='submit']").click();

    cy.wait("@loginFail");
    cy.get(".message").should("contain.text", "Invalid credentials");
  });

  it("logs in successfully and stores user in localStorage", () => {
    const user = { email: "test@example.com" };

    cy.intercept("POST", `${API_BASE_URL}/api/login`, {
      statusCode: 200,
      body: { message: "Login successful", user },
    }).as("loginSuccess");

    cy.get("input[name='email']").type(user.email);
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").click();

    cy.wait("@loginSuccess");

    // Message displayed
    cy.get(".message").should("contain.text", "Login successful");

    // User saved in localStorage
    cy.window()
      .its("localStorage.user")
      .should("exist")
      .then((storedUser) => {
        expect(JSON.parse(storedUser).email).to.eq(user.email);
      });

    // Optional: confirm redirect to /home
    cy.url().should("include", "/home");
  });

  it("redirects to signup page when clicking redirect button", () => {
    cy.get(".login-redirect").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/"); // assuming "/" is signup
  });
});
