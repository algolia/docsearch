/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Toggles the dark mode on the preview website.
     */
    darkmode: () => void;
    /**
     * Opens the DocSearch modal.
     */
    openModal: () => void;
    /**
     * Closes the DocSearch modal.
     */
    closeModal: () => void;
    /**
     * Types a query that returns results.
     */
    typeQueryMatching: () => void;
    /**
     * Types a query that returns no results.
     */
    typeQueryNotMatching: () => void;
  }
}
