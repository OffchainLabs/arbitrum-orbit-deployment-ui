describe('Login Account', () => {
  before(() => {
    cy.visit('/deployment/');
    cy.findByText('Connect Wallet').should('be.visible').click();
    cy.findByText('MetaMask').should('be.visible').click();
    cy.acceptMetamaskAccess();
    cy.changeMetamaskNetwork('arbitrum-goerli');
  });
  beforeEach(() => {
    cy.visit('/deployment/');
  });

  it('should deploy', () => {
    cy.findByLabelText('Rollup').should('be.visible').click();
    cy.findByText('Next').should('be.visible').click();
    cy.findByText('Next').should('be.visible').click();
    cy.findByText('Next').should('be.visible').click();
    cy.findByText('Next').should('be.visible').click();
    cy.findByText('Next').should('be.visible').click();
    cy.findByText('Deploy').should('be.visible').click();
    cy.confirmMetamaskTransaction();
  });
});
