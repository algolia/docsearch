/// <reference path="../../support/commands.d.ts" />

describe('Start', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
    cy.waitLoad();
  });

  it('Open modal on search button click', () => {
    cy.openModal();
    cy.modalIsVisibleAndFocused();

    // check that the scrollbar offset is compensated
    cy.get('body').should('have.css', 'overflow', 'hidden');
    cy.get('.DocSearch-Modal').should('be.visible');
  });

  it('Open modal with key shortcut on Windows/Linux', () => {
    cy.get('body').type('{ctrl}k');
    cy.modalIsVisibleAndFocused();
  });

  it('Open modal with key shortcut on Windows/Linux when caps lock is on', () => {
    cy.get('body').type('{ctrl}K');
    cy.modalIsVisibleAndFocused();
  });

  it('Open modal with key shortcut on macOS', () => {
    cy.get('body').type('{meta}k');
    cy.modalIsVisibleAndFocused();
  });

  it('Open modal with key shortcut on macOS when caps lock is on', () => {
    cy.get('body').type('{meta}K');
    cy.modalIsVisibleAndFocused();
  });

  it('Open modal with forward slash key shortcut', () => {
    cy.get('body').wait(1000).type('/');
    cy.modalIsVisibleAndFocused();
  });
});

describe('End', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
    cy.openModal();
  });

  it('Close modal with Esc key', () => {
    cy.closeModal();
    cy.modalIsNotVisible();
  });

  it('Close modal by clicking outside its container', () => {
    cy.get('body').click(0, 0);
    cy.modalIsNotVisible();
  });

  it('Close modal with key shortcut on Windows/Linux', () => {
    cy.get('body').type('{ctrl}k');
    cy.modalIsNotVisible();
  });

  it('Close modal with key shortcut on macOS', () => {
    cy.get('body').type('{meta}k');
    cy.modalIsNotVisible();
  });
});

describe('Search', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
    cy.openModal();
  });

  it('Results are displayed after a query', () => {
    cy.typeQueryMatching();
    cy.get('.DocSearch-Hits').should('be.visible');
  });

  it('Query can be cleared', () => {
    cy.typeQueryMatching();
    cy.get('.DocSearch-Clear').click();
    cy.get('.DocSearch-Hits').should('not.exist');
    cy.contains('No recent searches').should('be.visible');
  });

  it('Keyboard navigation leads to result', () => {
    const currentURL = cy.url();

    cy.typeQueryMatching();
    cy.get('.DocSearch-Input').type('{downArrow}{downArrow}{upArrow}');
    cy.get('.DocSearch-Input').type('{enter}');
    cy.on('url:changed', (newUrl) => {
      expect(newUrl).not.equal(currentURL);
    });
  });

  it('Pointer navigation leads to result', () => {
    const currentURL = cy.url();

    cy.typeQueryMatching();
    cy.get('.DocSearch-Hits #docsearch-hits0-item-1 > a').click({
      force: true,
    });
    cy.on('url:changed', (newUrl) => {
      expect(newUrl).not.equal(currentURL);
    });
  });

  it("No results are displayed if query doesn't match", () => {
    cy.typeQueryNotMatching();
    cy.contains('No results for').should('be.visible');
  });

  it('Should not refer to Recent/Favorite in aria-controls', () => {
    cy.get('.DocSearch-Input').should('not.have.attr', 'aria-controls');
  });
});

describe('Recent and Favorites', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
    cy.openModal();
    cy.typeQueryMatching();
    cy.get('#docsearch-hits0-item-0 > a').click({ force: true }).wait(1000);
    cy.openModal();
    cy.contains('Recent').should('be.visible');
  });

  it('Recent search is displayed after visiting a result', () => {
    cy.get('#docsearch-recentSearches-item-0').should('be.visible');
  });

  it('Recent search can be deleted', () => {
    cy.get('#docsearch-recentSearches-item-0').find('[title="Remove this search from history"]').trigger('click');
    cy.contains('No recent searches').should('be.visible');
  });

  it('Recent search can be favorited', () => {
    cy.get('#docsearch-recentSearches-item-0').find('[title="Save this search"]').trigger('click');
    cy.contains('Favorite').should('be.visible');
    cy.get('#docsearch-favoriteSearches-item-0').should('be.visible');
  });

  it('Favorite can be deleted', () => {
    cy.get('#docsearch-recentSearches-item-0').find('[title="Save this search"]').trigger('click');
    cy.contains('Favorite').should('be.visible');
    cy.get('#docsearch-favoriteSearches-item-0').find('[title="Remove this search from favorites"]').trigger('click');
    cy.contains('No recent searches').should('be.visible');
  });

  it('Input controls Recent and Favorite lists', () => {
    // Mark one result as favorite
    cy.get('#docsearch-recentSearches-item-0').find('[title="Save this search"]').trigger('click');
    cy.contains('Favorite').should('be.visible');
    // Search for something else to add a new recent search
    cy.typeQueryMatching();
    cy.get('#docsearch-hits1-item-5 > a').click({ force: true }).wait(1000);

    cy.openModal();
    cy.contains('Recent').should('be.visible');
    cy.contains('Favorite').should('be.visible');

    // Make sure the specified elements exist
    cy.get('.DocSearch-Input')
      .click()
      .invoke('attr', 'aria-controls')
      .then((value) => {
        const ids = value!.split(' ');
        expect(ids).to.have.length(2);
        ids.forEach((id) => cy.get(`#${id}`).should('exist'));
      });
  });
});
