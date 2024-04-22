Cypress.Commands.add('verifyBillingSummary', (value) => {
    cy.formatNumberToUSCurrency(value).then(resultado => {
        cy.getByDataCy("subtotalAmount").should('have.text', resultado)
        cy.getByDataCy("freightAmount").should('have.text', 'Free')
        cy.getByDataCy("totalPriceAmount").should('have.text', resultado)
    });
});

Cypress.Commands.add('verifyBillingSummary2', (data) => {
    
    cy.get('.css-yz81d6').within(() => {
        Cypress._.forEach(data, (value, selector) => {
            cy.getByDataCy(selector).should('include.text', value)
        });
    });
});