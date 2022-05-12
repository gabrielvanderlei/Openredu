/// <reference types="cypress" />

const YAML = require('yamljs')

describe('Create account', () => {
    var config = {}

    before(() => {
        cy.fixture("basic").then((t) => {
            config = t
        })
    })

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it('should create a new learning environment', async () => {
        cy.login(config.email, config.password)

        cy.visit(`http://localhost/ensine`)

        // Set step zero
        cy.get('#environment_name').type(config.environment, { force: true });
        cy.wait(3000)
        cy.get('#environment_courses_attributes_0_name').type(config.class_name, { force: true });
        cy.wait(3000)
        cy.get('input[type="submit"].next').click();

        cy.wait(20000)

        // Set step one
        cy.get('#environment_initials').type(config.environment_initials, { force: true });
        cy.wait(10000)
        cy.get('input[type="submit"].next').click();

        cy.wait(25000)

        // Confirm all fields
        cy.get('input[type="submit"]').click();

        cy.wait(40000)
    })
})