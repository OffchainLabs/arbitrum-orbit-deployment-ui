describe('Login Account', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show connect wallet if not logged in', () => {
    cy.findByText('Connect Wallet').should('be.visible').click();

    cy.findByText('MetaMask').should('be.visible').click();
    cy.acceptMetamaskAccess();
  });
});
