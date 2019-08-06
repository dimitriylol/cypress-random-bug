describe("just check buttons", () => {
  it("render buttons", () => {
    cy.visit("/");
    cy.contains("click 1")
    cy.matchImageSnapshot()
  });
});
