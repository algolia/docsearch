/// <reference path="../support/commands.d.ts" />

describe.skip('Ask AI', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
    cy.openModal();
  });

  it('Results are displayed after a query', () => {
    cy.typeQueryMatching();
    cy.get('.DocSearch-Hits').should('be.visible');
  });

  it('Shows Ask AI as a hit on search', () => {
    cy.typeQueryMatching();
    cy.get('.DocSearch-AskAi-Section').should('be.visible');
  });

  it('Opens Ask AI on enter key', () => {
    cy.typeQueryMatching();
    cy.get('.DocSearch-Input').type('{enter}');
    cy.get('.DocSearch-AskAiScreen').should('be.visible');
  });

  it('Opens Ask AI on click', () => {
    cy.typeQueryMatching();
    cy.get('#docsearch-askAI-item-0').click();
    cy.get('.DocSearch-AskAiScreen').should('be.visible');
  });

  it('Streams response after query', () => {
    cy.goToAskAi();
    cy.get('.DocSearch-AskAiScreen-Query').should('be.visible');
    cy.get('.DocSearch-AskAiScreen-Message').should('be.visible');
  });

  it('Copy button copies the response to the clipboard', () => {
    cy.goToAskAi();
    cy.get('.DocSearch-AskAiScreen-Response').should('be.visible');
    cy.window().its('navigator.permissions').invoke('query', { name: 'clipboard-read' }).its('state').then(cy.log);
    cy.window()
      .its('navigator.clipboard')
      .invoke('readText')
      .then((text) => {
        expect(text.length).to.be.greaterThan(0);
      });
  });
});
