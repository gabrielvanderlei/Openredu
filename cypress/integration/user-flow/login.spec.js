/// <reference types="cypress" />

describe('Login with account', () => {
    var config = {}

    before(() => {
        cy.fixture("basic").then((t) => {
            config = t
        })
    })

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it('should login', async () => {
        cy.login(config.email, config.password)
        cy.url().should("contains", `pessoas/${config.user}/home`)
    })
})
  