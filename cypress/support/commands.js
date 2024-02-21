Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})

Cypress.Commands.add('doType', (locator, text) => { 
    cy.get(locator).should('be.visible')
    cy.get(locator).type(text)
});

Cypress.Commands.add('doClick', (locator) => {
    cy.get(locator).should('be.visible')
    cy.get(locator).click()
});