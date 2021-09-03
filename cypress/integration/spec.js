/// <reference types="cypress" />

import { mockInBundle } from 'mock-in-bundle'

it('vibrates', () => {
  mockInBundle('expo-haptics/build/Haptics.js', {
    impactAsync: cy.stub().as('impactAsync'),
    ImpactFeedbackStyle: JSON.stringify({
      Light: 'light',
      Medium: 'medium',
      Heavy: 'heavy',
    }),
  })
  cy.visit('/')
  cy.get('[aria-label="Favorite"]').should('be.visible').delay().click()
  cy.get('@impactAsync').should('be.calledWith', 'medium')

  cy.contains('[aria-label="Quantity"]', '1')
    .should('be.visible')
    .delay()
    .click()
  cy.get('@impactAsync').should('be.calledWith', 'light')

  cy.contains('[aria-label="Quantity"]', '3')
    .should('be.visible')
    .delay()
    .click()
  cy.get('@impactAsync').should('be.calledWith', 'heavy')

  cy.get('[aria-label="Add to cart"]').delay().click()
  cy.get('[aria-label="Add to cart"]')
    .find('[aria-label=Loading]')
    .should('be.visible')
  // the loading indicator then goes away
  cy.get('[aria-label=Loading]').should('not.exist')
  cy.get('@impactAsync').should('be.calledWith', 'heavy')
})
