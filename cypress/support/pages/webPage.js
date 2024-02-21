export class WebPage {
    
    clickByDataCy(dataCy) {
        return cy.get(`[data-cy=${dataCy}]`).should('be.visible').click();
    }
}