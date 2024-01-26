describe('Blogs app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')
    const user = {
      name: 'maskim',
      username: 'maskim',
      password: 'password',
    }

    cy.request('POST', 'http://localhost:3000/api/users', user)

    cy.visit('http://localhost:3000')
  })
  it('front page can be opened', () => cy.contains('login'))
  it('login form can be opened', () => cy.contains('login').click())

  // wrong login information

  it('login failure', () => {
    cy.contains('login').click()
    cy.get('#username').type('123455')
    cy.get('#password').type('password')
    cy.get('#submit-btn').click()

    cy.get('.error')
      .should('contain', 'Wrong username or password!')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Bienvenido Maskim!')
  })

  // login
  describe('user logged in', () => {
    beforeEach(() => {
      cy.contains('login').click()
      cy.get('#username').type('maskim')
      cy.get('#password').type('password')
      cy.get('#submit-btn').click()
    })

    it('user can login', () => {
      cy.contains('Bienvenido maskim!')
    })

    describe('new blog exists', () => {
      beforeEach(() => {
        cy.contains('create').click()
        cy.get('#title').type('Some random content')
        cy.get('#author').type('Author Deogracious')
        cy.get('#url').type('deogracious.dev')
        cy.get('#add').click()
      })

      describe('blog already exists', () => {
        beforeEach(() => {
          cy.contains('Some random content')
          cy.contains('view').click()
        })
        it('like button works', () => {
          cy.contains('like').click()
          cy.contains(1)
        })
        it('delete blog', () => {
          cy.contains('delete').click()
          cy.contains('Some random content deleted successfully!')
        })
      })
      // test like button

      // test delete button
    })
  })
})
