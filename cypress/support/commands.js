import './requests/product'
import './assertions/shoppingCartModel'
import './assertions/billingSummaryModel'
import './assertions/purchaseOrder'

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

Cypress.Commands.add('login', (usuario, password) => {
    cy.request({
        method: "POST",
        url: `${Cypress.env().baseUrlAPI}/login`,
        body: {
            username: usuario,
            password: password
        },
    }).then(respuesta => {
        window.localStorage.setItem('token', respuesta.body.token);
        window.localStorage.setItem('user', respuesta.body.user.username);
        window.localStorage.setItem('userId', respuesta.body.user._id);
        Cypress.env().token = respuesta.body.token;
    });
});

Cypress.Commands.add('loginSave', (usuario, password) => {
    cy.session('loginSession', () => {
        cy.request({
            method: "POST",
            url: `${Cypress.env().baseUrlAPI}/login`,
            body: {
                username: usuario,
                password: password
            },
        }).then(respuesta => {
            window.localStorage.setItem('token', respuesta.body.token);
            window.localStorage.setItem('user', respuesta.body.user.username);
            window.localStorage.setItem('userId', respuesta.body.user._id);
            Cypress.env().token = respuesta.body.token;
        });
    }, {
        cacheAcrossSpecs: true
    });
});

Cypress.Commands.add('getByDataCy', (selector) => {
    return cy.get(`[data-cy=${selector}]`)
})

Cypress.Commands.add('formatNumberToUSCurrency', (number) => {
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
});
