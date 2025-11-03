define(function (require) {

  let AllplanUserManager = require('allplanUserManager');
  let WebClient = require("bimplus/webclient");

  console.log('Callback page loaded, processing OIDC callback...');

  let environment = WebClient.getUrlParameter("env");
  // Create the UserManager
  const userManager = AllplanUserManager.createUserManager(environment);

  // Update status message
  $("#statusMessage").text("Processing authentication callback...");

  // Handle the OIDC callback
  userManager.signinRedirectCallback().then(function(user) {
    console.log('Signin callback successful:', user);
    
    // Update status message
    $("#statusMessage").text("Login successful! Redirecting...");
    
    // Brief delay to show success message, then redirect
    setTimeout(function() {
      window.location.href = '/projectSelection.html?env=' + environment;
    }, 1500);
    
  }).catch(function(error) {
    console.error('Error handling callback:', error);
    
    // Update status message with error
    $("#statusMessage").html(`
      <span style="color: #f44336;">
        <strong>Login Error:</strong> ${error.message}
      </span>
      <br><br>
      <a href="/index.html" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
        Return to Login
      </a>
    `);
    
    // Also display error in the page body for debugging
    $(".loginCardMedia").append(`
      <div style="padding: 20px; background-color: #ffebee; margin-top: 10px; border-radius: 4px;">
        <h4 style="color: #c62828; margin-top: 0;">Technical Details:</h4>
        <pre style="font-size: 12px; color: #666; white-space: pre-wrap;">${error.stack || error.message}</pre>
      </div>
    `);
  });

});