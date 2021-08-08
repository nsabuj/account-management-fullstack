const apiUrl = `${Cypress.env("apiUrl")}`

describe('Account Management Backend - Level 1', () => {

  it('should create a transaction and fetch the updated account balance', () => {
    cy.request({ // create transaction
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/amount`,
      headers: {
        "Content-Type": "application/json",
        "Transaction-Id": "7943f961-a733-43cf-ba3d-905a5856f6da"
      },
      body: {
        account_id: "a40bcc03-6f39-418c-ad0b-97e14f522ec1",
        amount: 7
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    }).request({ // read account balance
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/balance/a40bcc03-6f39-418c-ad0b-97e14f522ec1`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.balance).to.eq(7)
    })
  })

  it('should create transactions with negative and zero amounts', () => {
    cy.request({ // positive amount
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/amount`,
      headers: {
        "Content-Type": "application/json",
        "Transaction-Id": "3dc5b8b7-55b3-4c7e-bd34-3c1f2aedf0c2"
      },
      body: {
        account_id: "0b230303-0156-45a9-b996-16574b6be525",
        amount: 4
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    }).request({ // read account balance
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/balance/0b230303-0156-45a9-b996-16574b6be525`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.balance).to.eq(4)
    }).request({ // negative amount
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/amount`,
      headers: {
        "Content-Type": "application/json",
        "Transaction-Id": "05a9b3c7-6e4e-4e7b-b161-cf64188a7ec9"
      },
      body: {
        account_id: "0b230303-0156-45a9-b996-16574b6be525",
        amount: -3
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    }).request({ // read account balance
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/balance/0b230303-0156-45a9-b996-16574b6be525`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.balance).to.eq(1)
    }).request({ // zero amount
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/amount`,
      headers: {
        "Content-Type": "application/json",
        "Transaction-Id": "e5c8e767-54c3-4156-acf3-617a5a15c053"
      },
      body: {
        account_id: "0b230303-0156-45a9-b996-16574b6be525",
        amount: 0
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    }).request({ // read account balance
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/balance/0b230303-0156-45a9-b996-16574b6be525`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.balance).to.eq(1)
    })
  })

  it('should return NOT_FOUND for non-existent accounts', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/balance/96a11d04-4a69-47be-9e40-923d962eb7b4`,
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it('should handle invalid requests gracefully', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'PUT', // wrong method
      url: `${apiUrl}/amount`,
      headers: {
        "Content-Type": "application/json",
        "Transaction-Id": "417a48dd-b73e-45fc-9ee0-c5d97c46748f"
      },
      body: {
        account_id: "a40bcc03-6f39-418c-ad0b-97e14f522ec1",
        amount: 10
      }
    }).then((response) => {
      expect(response.status).to.eq(405)
    }).request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/amount`,
      headers: {
        "Content-Type": "application/xml", // wrong Content-Type
        "Transaction-Id": "59b2917e-6407-40eb-8fbf-287435fcd6f8"
      },
      body: {
        account_id: "a40bcc03-6f39-418c-ad0b-97e14f522ec1",
        amount: 10
      }
    }).then((response) => {
      expect(response.status).to.eq(415)
    }).request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/amount`,
      headers: {
        "Content-Type": "application/json",
        "Transaction-Id": "6eadf15c-fc8a-4584-b708-31a56df13563"
      },
      body: { // missing account_id
        amount: 7
      }
    }).then((response) => {
      expect(response.status).to.eq(400)
    }).request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/amount`,
      headers: {
        "Content-Type": "application/json",
        "Transaction-Id": "a02beed9-c81f-4030-a868-b9cb308d961c"
      },
      body: { // missing amount
        account_id: "a40bcc03-6f39-418c-ad0b-97e14f522ec1"
      }
    }).then((response) => {
      expect(response.status).to.eq(400)
    }).request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/amount`,
      headers: {
        "Content-Type": "application/json",
        "Transaction-Id": "29b0370f-05c0-4d17-a406-3f825997b0f5"
      },
      body: {
        account_id: 10, // bad format
        amount: 7
      }
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })
})

describe('Account Management Frontend - Level 1', () => {
  it('should load and submit transactions', () => {
    cy.visit('/')

    // submit a transaction & verify the position on the list
    cy.get('[data-type=account-id]').type('70ad2f95-aa52-4e04-a085-c5cc2a4d4ee4')
    cy.get('[data-type=amount]').type('30')
    cy.get('[data-type=transaction-form]').submit()
    cy.get('[data-type=transaction]').first().get('[data-account-id=70ad2f95-aa52-4e04-a085-c5cc2a4d4ee4][data-amount=30][data-balance=30]').should('exist')

    // submit another transaction & verify the position on the list
    cy.get('[data-type=account-id]').type('aaad2f95-aa52-4e04-a085-c5cc2a4d4ee4')
    cy.get('[data-type=amount]').type('7')
    cy.get('[data-type=transaction-form]').submit()
    cy.get('[data-type=transaction]').first().get('[data-account-id=aaad2f95-aa52-4e04-a085-c5cc2a4d4ee4][data-amount=7][data-balance=7]').should('exist')

    // submit a transaction with a negative amount & verify the position on the list
    cy.get('[data-type=account-id]').type('aaad2f95-aa52-4e04-a085-c5cc2a4d4ee4')
    cy.get('[data-type=amount]').type('-7')
    cy.get('[data-type=transaction-form]').submit()
    cy.get('[data-type=transaction]').first().get('[data-account-id=aaad2f95-aa52-4e04-a085-c5cc2a4d4ee4][data-amount=-7][data-balance=0]').should('exist')
  })

  it('should reject invalid input data', () => {
    cy.visit('/')

    // submit a regular transaction
    cy.get('[data-type=account-id]').type('6113255d-318f-4128-9e2a-a1c1b796a29e')
    cy.get('[data-type=amount]').type('9')
    cy.get('[data-type=transaction-form]').submit()
    cy.get('[data-type=transaction]').first().get('[data-account-id=6113255d-318f-4128-9e2a-a1c1b796a29e][data-amount=9][data-balance=9]').should('exist')

    // invalid account_id
    cy.get('[data-type=account-id]').type('123')
    cy.get('[data-type=amount]').type('12')
    cy.get('[data-type=transaction-form]').submit()
    // still the previous transaction at the top of the list
    cy.get('[data-type=transaction]').first().get('[data-account-id=6113255d-318f-4128-9e2a-a1c1b796a29e][data-amount=9][data-balance=9]').should('exist')

    cy.get('[data-type=account-id]').type('0708c2b1-e1c9-4c31-8647-c2f44b7664e7')
    // invalid amount
    cy.get('[data-type=amount]').type('abc')
    cy.get('[data-type=transaction-form]').submit()
    // still the previous transaction at the top of the list
    cy.get('[data-type=transaction]').first().get('[data-account-id=6113255d-318f-4128-9e2a-a1c1b796a29e][data-amount=9][data-balance=9]').should('exist')

  })
})