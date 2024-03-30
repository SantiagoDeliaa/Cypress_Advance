Cypress.Commands.add('deleteProduct', (id) => {
    cy.request({
        method: "GET",
        url: `${Cypress.env().baseUrlAPI}/products?id=${id}`,
        failsOnStatusCode: false,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        }
    }).its('body.products.docs').each((product) => {
        cy.request({
            method: "DELETE",
            url: `${Cypress.env().baseUrlAPI}/product/${product._id}`,
            headers: {
                Authorization: `Bearer ${Cypress.env().token}`,
            }
        });
    });
});

Cypress.Commands.add('createProduct', (body) => {
    cy.request({
        method: "POST",
        url: `${Cypress.env().baseUrlAPI}/create-product`,
        body: body,
    });
});

Cypress.Commands.add('updateProduct', (id, body) => {
    cy.request({
        method: "PUT",
        url: `${Cypress.env().baseUrlAPI}/products/${id}`,
        body: body,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        }
    });
});

Cypress.Commands.add('editProduct', (id, body) => {
    cy.request({
        method: "GET",
        url: `${Cypress.env().baseUrlAPI}/products?id=${id}`,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        }
    }).then((response) => {
        const product = response.body.products.docs[0]; 
        cy.request({
            method: "PUT",
            url: `${Cypress.env().baseUrlAPI}/product/${product._id}`,
            body: body,
            headers: {
                Authorization: `Bearer ${Cypress.env().token}`
            }
        });
    });
});

Cypress.Commands.add('getProduct', (productName) => {
    cy.request({
        method: "GET",
        url: `${Cypress.env().baseUrlAPI}/products?name=${productName}`,
        failsOnStatusCode: false,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        }
    })
})