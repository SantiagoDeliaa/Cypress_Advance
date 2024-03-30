/// <reference types="cypress" />

import { WebPage } from "../../../support/pages/webPage";
import { ProductsPage } from "../../../support/pages/productsPage";

describe('First challenge', () => {
    let datos;
    const webPage = new WebPage
    const productsPage = new ProductsPage

    before('Before', () => {
        cy.fixture('archivoFixture').then(archivoFixtureParametro => {
            datos = archivoFixtureParametro;
        })
    });

    it('Add, serch, delete and validate product', () => {
        const idAleatorio = Math.floor(100000 + Math.random() * 900000);

        cy.visit('');
        cy.get('#registertoggle').dblclick();
        cy.doType('#user', datos.login.user);
        cy.doType('#pass', datos.login.password);
        webPage.clickByDataCy('submitForm');
        webPage.clickByDataCy('onlineshoplink');
        webPage.clickByDataCy('add-product');
        cy.doType('#productName', 'test-product');
        cy.doType('#productPrice', '14.000'); 
        cy.doType('#productCard', 'https://images.app.goo.gl/SUs7a3GG1nabhqyy5')
        cy.doType('#productID', idAleatorio);
        cy.doClick('#createProduct');
        cy.get('#chakra-modal--body-\\:r58\\:').should('have.text', 'test-product has been added');
        cy.doClick('#closeModal');
        cy.get('#search-type').select('ID')
        cy.doType('#search-bar', `${idAleatorio}{enter}`);
        cy.get('#name').should('have.text', 'test-product');
        cy.get(`#delete-${idAleatorio}`).click();
        cy.doClick('#saveEdit');
        cy.get('#chakra-modal--body-\\:r58\\:').should('have.text', 'test-product has been deleted');
        cy.doClick('#closeModal');
        cy.get('#search-type').select('ID');
        cy.get('#search-bar').clear().type(`${idAleatorio}{enter}`);
        cy.contains('Nombre del Producto').should('not.exist');
        cy.get(`#producto-${idAleatorio}`).should('not.exist');
    });
});