/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import { internet } from 'faker';

describe('login', () => {
  beforeEach(() => cy.clearIndexedDB());

  it('logs in if the user exists and is authorized to access the backoffice', () => {
    cy.visit('/')
      .get('input[type="email"]')
      .type(Cypress.env('auth').email)
      .get('input[type="password"]')
      .type(Cypress.env('auth').password)
      .get('button[type="submit"]')
      .click()
      .location('pathname')
      .should('eq', '/');
  });

  it('shows an error if the user does not exist', () => {
    cy.visit('/')
      .get('input[type="email"]')
      .type(internet.email())
      .get('input[type="password"]')
      .type(internet.password())
      .get('button[type="submit"]')
      .click()
      .document()
      .findByText(/email o password non corretti/i)
      .should('exist');
  });
});
