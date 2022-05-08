Cypress.Commands.add('modalIsVisibleAndFocused', () => {
  cy.wait(1000);
  cy.get('.DocSearch-Modal').should('be.visible');
  cy.get('.DocSearch-Input').should('be.focus');
});

Cypress.Commands.add('modalIsNotVisible', () => {
  cy.wait(1000);
  cy.get('body').should('not.have.class', 'DocSearch--active');
  cy.get('.DocSearch-Modal').should('not.exist');
});

Cypress.Commands.add('darkmode', () => {
  cy.get('.react-toggle').click({ force: true });
  cy.get('.react-toggle-screenreader-only').blur();
  cy.wait(1000);
});

Cypress.Commands.add('openModal', () => {
  cy.get('.DocSearch-Button').click();
  cy.wait(1000);
});

Cypress.Commands.add('closeModal', () => {
  cy.get('body').type('{esc}');
  cy.wait(1000);
});

Cypress.Commands.add('search', (query: string) => {
  cy.wait(1000);
  cy.get('.DocSearch-Input').type(query);
});

Cypress.Commands.add('typeQueryMatching', () => {
  cy.search('the checklist');
});

Cypress.Commands.add('typeQueryNotMatching', () => {
  cy.search('zzzzz');
});
