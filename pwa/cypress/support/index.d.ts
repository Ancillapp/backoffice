/// <reference types="cypress" />

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to clear indexedDB.

     * @example cy.clearIndexedDB()
     */
    clearIndexedDB(): Chainable<void>;
  }
}
