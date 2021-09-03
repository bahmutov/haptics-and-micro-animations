/// <reference types="cypress" />

// utility command to make the demo easier to see
Cypress.Commands.add(
  'delay',
  { prevSubject: 'optional' },
  (subject, ms = 1000) => {
    cy.wait(ms, { log: false })
    if (subject) {
      cy.wrap(subject, {
        log: false,
      })
    }
  },
)
