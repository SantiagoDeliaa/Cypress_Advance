/// <reference types="cypress" />

describe('Third Challenge', () => {

    before(() => {
        cy.login(Cypress.env().usuario, Cypress.env().password);
        cy.fixture('./Desafios/Desafio-3/datos.json').as('data');
        cy.then(function () {
            cy.deleteProduct(this.data.product1.id);
            cy.deleteProduct(this.data.product2.id);
            cy.createProduct(this.data.product1);
            cy.createProduct(this.data.product2);
        });
    });

    it('API, Frontend and DB conection', function () {

        cy.visit('');
        cy.getByDataCy("onlineshoplink").click();
        cy.intercept('GET', '/api/products?page=**').as('getProducts')
        cy.wait('@getProducts').its('response.statusCode').should('be.equal', 200);
        cy.getByDataCy("search-type").select('ID');
        cy.getByDataCy("search-bar").type(`${this.data.product1.id} {enter}`);
        cy.get('[name="test-product-1"]').click();
        cy.getByDataCy('closeModal').click();
        cy.get('[name="test-product-1"]').click();
        cy.getByDataCy('closeModal').click();
        cy.getByDataCy("search-type").select('ID');
        cy.getByDataCy("search-bar").clear().type(`${this.data.product2.id} {enter}`);
        cy.get('[name="test-product-2"]').click();
        cy.getByDataCy('closeModal').click();
        cy.get('[name="test-product-2"]').click();
        cy.getByDataCy('closeModal').click();
        cy.getByDataCy("goShoppingCart").click();
        cy.getByDataCy("goBillingSummary").click();
        cy.getByDataCy("goCheckout").click();
        cy.getByDataCy("firstName").type(this.data.client.name);
        cy.getByDataCy("lastName").type(this.data.client.lastName);
        cy.getByDataCy("cardNumber").type(this.data.client.card);
        cy.getByDataCy("purchase").click();
        cy.intercept('POST', '/api/purchase').as('postPurchase')
        cy.wait('@postPurchase').its('response.statusCode').should('be.equal', 200);
        cy.getByDataCy("name").contains(this.data.client.name + ' '+ this.data.client.lastName);
        cy.get('#test-product-1').should('have.text', '2 x test-product-1');
        cy.get('#test-product-2').should('have.text', '2 x test-product-2');
        
        //-------DB test assertions-----
        cy.getByDataCy("sellId").invoke('text').then((idCompra) => {
            const query = `SELECT * FROM "purchaseProducts" pp JOIN sells s ON pp.sell_id = s.id WHERE s.id = ${idCompra}`
            cy.task("connectDB", query)
                .then((result) => {
                    expect(result[0].quantity).to.equal(2);
                    expect(result[0].total_price).to.equal('28.00');
                    expect(result[0].price).to.equal('14.00');
                    expect(result[0].sell_id).to.equal(parseInt(idCompra));

                    expect(result[1].quantity).to.equal(2);
                    expect(result[1].total_price).to.equal('32.00');
                    expect(result[1].price).to.equal('16.00');
                    expect(result[1].sell_id).to.equal(parseInt(idCompra));
            });
        })
    });
});


