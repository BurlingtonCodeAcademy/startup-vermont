describe('app', function () {
  it('successfully visits the home page', function () {
    cy.visit('/');
  });

  it('logs in', function () {
    cy.get('#login-bar input[name=username]')
      .type('john')
    cy.get('#login-bar input[name=password]')
      .type('launchvt')
    cy.get('#login-bar form')
      .submit()
    cy.contains('Welcome, john!')
  });
});
