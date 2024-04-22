/// <reference types="cypress" />

describe('Final Challenge', () => {

    before(() => {
        cy.loginSave(Cypress.env().usuario, Cypress.env().password);
        cy.fixture('./Desafios/Desafio-4/datos.json').as('data');
        cy.then(function () {
            cy.deleteProduct(this.data.product1.id);
            cy.deleteProduct(this.data.product2.id);
            cy.createProduct(this.data.product1);
            cy.createProduct(this.data.product2);
        });
    });

    it('API, Frontend validation and DB conection', function () {
        this.data.products.product1.totalPrice = this.data.products.product1.quantity * this.data.products.product1.price
        this.data.products.product2.totalPrice = this.data.products.product2.quantity * this.data.products.product2.price
        this.data.totalPriceSum = this.data.products.product1.totalPrice + this.data.products.product2.totalPrice;
        cy.wrap(this.data.totalPriceSum).as('totalPriceSum');

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
        cy.verifyShoppingCart(0, this.data.products.product1)
        cy.verifyShoppingCart(1, this.data.products.product2)
        cy.contains('Show total price').click();
        cy.get('#price').should('have.text', this.data.totalPriceSum)
        cy.getByDataCy("goBillingSummary").click();
        cy.verifyBillingSummary2({
            'subtotalAmount': this.data.totalPriceSum,
            'freightAmount': 'Free',
            'totalPriceAmount': this.data.totalPriceSum
        })
        cy.get('@totalPriceSum').then(totalPriceSum => {
            // Assertion made with the first custom command
            cy.verifyBillingSummary(totalPriceSum)
        });
            // Assertion made with the second custom command
        cy.verifyBillingSummary2({
            'subtotalAmount': this.data.totalPriceSum,
            'freightAmount': 'Free',
            'totalPriceAmount': this.data.totalPriceSum
        });
        cy.getByDataCy("goCheckout").click();
        cy.getByDataCy("firstName").type(this.data.client.name);
        cy.getByDataCy("lastName").type(this.data.client.lastName);
        cy.getByDataCy("cardNumber").type(this.data.client.card);
        cy.getByDataCy("purchase").click();
        cy.intercept('POST', '/api/purchase').as('postPurchase')
        cy.wait('@postPurchase').its('response.statusCode').should('be.equal', 200);
        cy.verifyPurchaseUsingParagraph({
            'name': this.data.client.name +' '+ this.data.client.lastName,
            'producto1': '2 x '+ this.data.product1.name,
            'producto2': '2 x '+ this.data.product2.name,
            'creditCard': this.data.client.card,
            'totalPrice': this.data.totalPriceSum
        });
        
        //-------DB test assertions-----
        cy.getByDataCy("sellId").invoke('text').then((idCompra) => {
            const query = `SELECT * FROM "purchaseProducts" pp JOIN sells s ON pp.sell_id = s.id WHERE s.id = ${idCompra}`
            cy.task("connectDB", query)
                .then((result) => {
                    expect(result[0].quantity).to.equal(2);
                    expect(result[0].total_price).to.equal('28.68');
                    expect(result[0].price).to.equal('14.34');
                    expect(result[0].sell_id).to.equal(parseInt(idCompra));

                    expect(result[1].quantity).to.equal(2);
                    expect(result[1].total_price).to.equal('32.86');
                    expect(result[1].price).to.equal('16.43');
                    expect(result[1].sell_id).to.equal(parseInt(idCompra));
            });
        });
    });
});


