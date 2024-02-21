const directorioName = __dirname.replaceAll('\\', '/');
const module = directorioName.split(/[/]/)[2]
const scenarioName = directorioName.slice(directorioName.lastIndexOf('/') + 1).split('-').slice(0, -1).join('-');
const testCaseId = directorioName.split(/[-]/).pop();

describe(`${scenarioName} - ${module} `, () => {

    it('Deberia permitir al usuario editar un producto', () => {
        cy.fixture(`${module}/${scenarioName}-${testCaseId}/data`).then(data => {
            data.producto = `${data.producto}-${testCaseId}`
            cy.log(`Eliminar el producto ${data.producto} si existe`)
            cy.log(`Crear el producto ${data.producto}`)
            cy.log(`editar el producto ${data.producto}`)
        });
    })
});