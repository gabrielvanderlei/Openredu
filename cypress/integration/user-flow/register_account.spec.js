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

    it('should create a new account', async () => {
        cy.visit('http://localhost')
        cy.get('.criarconta').click()

        cy.get('#ck-modal').should('be.checked')

        cy.get('#user_first_name').type(config.name, { force: true });
        cy.get('#user_last_name').type(config.lastname, { force: true });
        cy.get('#user_email').type(config.email, { force: true });
        cy.get('#user_email_confirmation').type(config.email, { force: true });
        cy.get('#user_login').type(config.user, { force: true });
        cy.get('.mail #user_password').type(config.password, { force: true });
        cy.get('.mail #user_password_confirmation').type(config.password, { force: true });

        cy.get('#user_tos').check();

        const humanizer= await new Promise((success, error) => {
            cy.readFile("./config/locales/humanizer.pt-BR.yml", {encoding: 'utf-8'}).then(value => {
                const humanizerData = YAML.parse(value)
                success(humanizerData)
            })
        });

        cy.get('.captcha .title').then($question => {
            humanizer["pt-BR"]["humanizer"]["questions"].forEach(captcha => {
                if (captcha["question"] == $question.text()) {
                    let answer = null

                    if (captcha["answers"]) answer = captcha["answers"][0]
                    else answer = captcha["answer"]

                    cy.get('#user_humanizer_answer').type(answer, { force: true });

                    cy.get('#bt_enviar').click();
                    cy.wait(25000)

                    cy.get('#painel-cadastro .modal-body h3').should('have.text', "Olá, Seu cadastro foi efetuado com sucesso.");
                    cy.wait(3000)
                    cy.get('#painel-cadastro .modal-body .button-success-modal').click();
                    cy.wait(30000)

                    cy.url().should("contains", `pessoas/${config.user}/home`)
                    cy.wait(20000)
                }
            })
        })
    })
})