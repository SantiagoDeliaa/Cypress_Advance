/// <reference types="cypress" />

describe('Second Challenge', () => {

    before(() => {
        cy.login(Cypress.env().usuario, Cypress.env().password);
        cy.fixture('./Desafios/Desafio-2/datos.json').as('data');
        cy.visit('');
    });

    it('API & Frontend', () => {
        cy.get('@data').then((data) => {
            cy.deleteProduct(data.product.id);
            cy.createProduct(data.product);
            cy.editProduct(data.product.id, data.updatedFields);
            cy.getByDataCy("onlineshoplink").click();
            cy.getByDataCy("search-type").select('ID');
            cy.getByDataCy("search-bar").type(`${data.product.id} {enter}`);
            cy.getByDataCy("edit-1237").click();

            cy.get('[data-cy="productName"]').invoke('val').then(name => {
                expect(name).to.be.equal(data.updatedFields.name)
            });
            cy.getByDataCy("productPrice").invoke('val').then(price => {
                expect(parseInt(price)).to.be.equal(data.updatedFields.price)
            });
            cy.getByDataCy("productCard").invoke('val').then(img => {
                expect(img).to.be.equal(data.updatedFields.img)
            });
        });
    });
})