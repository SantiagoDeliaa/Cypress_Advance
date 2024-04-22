Cypress.Commands.add('verifyShoppingCart', (line, producto) => {
    let index = 0
    cy.get('li').eq(line).within(() => {
        Cypress._.forEach(producto, (value, atributo) => {
            if (atributo === 'price' || atributo === 'totalPrice') {
                cy.formatNumberToUSCurrency(value).then(resultado => {
                    cy.log(resultado)
                    cy.get('p').eq(index).should('have.text', resultado)
                    index++
                });
            } else {
                cy.get('p').eq(index).should('have.text', value);
                index++
            };
        });
    });
});

