/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Ensures the modal is visible and focused.
     */
    modalIsVisibleAndFocused: () => void;
    /**
     * Ensures the modal not visible.
     */
    modalIsNotVisible: () => void;
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
     * Search for a given query.
     */
    search: (query: string) => void;
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
