Cypress.Commands.add('verifyPurchase', (data) => {
    cy.get('.css-1tcqc9o').within(() => {
        Cypress._.forEach(data, (value, selector) => {
            cy.get(`[id='${selector}']`).should('include.text', value);
        });
    });
});

Cypress.Commands.add('verifyPurchaseUsingParagraph', (data) => {
    let index = 0;
    cy.get('.css-1tcqc9o').within(() => {
        Cypress._.forEach(data, (value) => {
            if (index === 4) {
                cy.get(`p`).eq(5).should('include.text', value);
            } else {
                cy.get(`p`).eq(index).should('include.text', value);
                index++
            }
        });
    });
});