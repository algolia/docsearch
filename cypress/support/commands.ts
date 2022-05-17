Cypress.Commands.add('modalIsVisibleAndFocused', () => {
  cy.get('.DocSearch-Modal').should('be.visible');
  cy.get('.DocSearch-Input').should('be.focus');
});

Cypress.Commands.add('modalIsNotVisible', () => {
  cy.get('body').should('not.have.class', 'DocSearch--active');
  cy.get('.DocSearch-Modal').should('not.exist');
});

Cypress.Commands.add('darkmode', () => {
  cy.get('.react-toggle').click({ force: true });
  cy.get('.react-toggle-screenreader-only').blur();
  cy.get('html.dark').should('be.visible');
});

Cypress.Commands.add('openModal', () => {
  cy.get('.DocSearch-Button').should('be.visible').click();
  cy.modalIsVisibleAndFocused();
});

Cypress.Commands.add('closeModal', () => {
  cy.get('body').type('{esc}');
  cy.modalIsNotVisible();
});

Cypress.Commands.add('search', (query: string) => {
  cy.get('.DocSearch-Input').should('be.visible').type(query);
});

Cypress.Commands.add('typeQueryMatching', () => {
  cy.search('g');
});

Cypress.Commands.add('typeQueryNotMatching', () => {
  cy.search('zzz');
});
