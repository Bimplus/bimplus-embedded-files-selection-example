define(function (require) {

  let AllplanUserManager = require('allplanUserManager');

  $("#loginButton").click(function (event) {

    let environment = document.querySelector('input[name="options"]:checked')?.value;
    let userManager = AllplanUserManager.createUserManager(environment);

    userManager.signinRedirect();
  });

  $("#logoutButton").click(function (event) {
    let environment = document.querySelector('input[name="options"]:checked')?.value;
    let userManager = AllplanUserManager.createUserManager(environment);

    userManager.signoutRedirect().then(function () {
      console.log("User logged out");
      window.location.href = "/index.html"
    }).catch(function (err) {
      console.error(err);
    });
  });
});