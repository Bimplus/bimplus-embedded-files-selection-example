define(function (require) {
  // Load websdk
  let WebSdk = require("bimplus/websdk");

  // Define api wrapper
  let api = null;

  $("#loginButton").click(function (event) {
    // Use environment dev,stage or prod
    let environment = document.querySelector(
      'input[name="options"]:checked'
    )?.value;

    let user = $("#user").val();
    let password = $("#password").val();

    api = new WebSdk.Api(WebSdk.createDefaultConfig(environment));

    // Make authorization request to Bimplus, providing user name, password and application id
    api.authorize
      .post(user, password, "5F43560D-9B0C-4F3C-85CB-B5721D098F7B")
      .done(function (data, status, xhr) {
        window.location.href =
          "/projectSelection.html" +
          "?token=" +
          data.access_token +
          "&env=" +
          environment;
      })
      .fail(function (data) {
        // Authorization failed
        alert("Login to Bimplus failed!");
      });
  });
});
