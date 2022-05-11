/// <reference types="cypress" />

const YAML = require('yamljs')

describe('example to-do app', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
    })
  
    it('displays register account btn', () => {
      cy.get('.criarconta')

      cy.get('#modal-sign-up')
    })

    it('should create a new account', async () => {
        cy.get('.criarconta').click()

        cy.get('#ck-modal').should('be.checked')

        let user  =`usersasdfadsf`
        let email = `${user}@sandro.com`

        cy.get('#user_first_name').type('Alex', { force: true });
        cy.get('#user_last_name').type('Sandro', { force: true });
        cy.get('#user_email').type(email, { force: true });
        cy.get('#user_email_confirmation').type(email, { force: true });
        cy.get('#user_login').type(user, { force: true });
        cy.get('.mail #user_password').type('1234567890n', { force: true });
        cy.get('.mail #user_password_confirmation').type('1234567890n', { force: true });

        cy.get('#user_tos').check();

        // console.log(await cy.readFile("./config/locales/humanizer.pt-BR.yml", {encoding: 'utf-8'}))

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
                }
            })
        })

        // cy.readFile("./config/locales/humanizer.pt-BR.yml", {encoding: 'utf-8'}).then(value => {
        //     const humanizer = YAML.parse(value)


        //     cy.get('.captcha .title').then($question => {
                
        //         humanizer["pt-BR"]["humanizer"]["questions"].forEach(captcha => {
        //             if (captcha["question"] == $question.text()) {
        //                 let answer = null

        //                 if (captcha["answers"]) answer = captcha["answers"][0]
        //                 else answer = captcha["answer"]

        //                 cy.get('#user_humanizer_answer').type(answer, { force: true });

        //                 cy.get('#bt_enviar').click();
        //             }
        //         })
        //     })
        // })

    })
  })
  