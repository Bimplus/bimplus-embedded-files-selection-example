define(function (require) {
  
  // Import dependencies using RequireJS
  let oidc = require('oidc-client-ts');
  
  // Extract the specific classes we need from the oidc global object
  let UserManager = oidc.UserManager;
  let WebStorageStateStore = oidc.WebStorageStateStore;

  // Configure the client (unchanged)
  const config = {
    authority: 'https://login-stage.allplan.com/realms/allplan/',
    client_id: 'bimplus-demo-client', // EXAMPLE CLIENT - Replace with your own client_id for production
    redirect_uri: `${window.location.origin}/callback.html`,
    post_logout_redirect_uri: `${window.location.origin}/index.html`,
    silent_redirect_uri: `${window.location.origin}/silent-renew.html`,
    response_type: 'code',
    scope: 'openid profile email',
    
    // Storage configuration
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    
    // Additional settings
    loadUserInfo: true,
    automaticSilentRenew: true,
    monitorSession: false, // Disable session monitoring to avoid iframe issues
    filterProtocolClaims: true,
    accessTokenExpiringNotificationTime: 30, // seconds before expiry
    revokeAccessTokenOnSignout: true,
      
    // Silent renew specific settings
    silentRequestTimeout: 10000, // 10 seconds timeout
    includeIdTokenInSilentRenew: true,
    
    // Disable check session to avoid Chrome iframe issues
    checkSessionInterval: 0 // Disable session checking
  };

  // Create the user manager function
  function createUserManager(environment) {
    let configCopy = { ...config };

    if(environment) {
      // Adjust authority based on environment parameter
      if(environment === 'prod') {
        configCopy.authority = 'https://login.allplan.com/realms/allplan/';
      } else {
        configCopy.authority = `https://login-${environment}.allplan.com/realms/allplan/`;
      }

      configCopy.redirect_uri += `?env=${environment}`;
    }

    return new UserManager(configCopy);
  }

  // Return the public API (RequireJS module export)
  return {
    createUserManager: createUserManager,
    config: config // Optionally expose config if needed elsewhere
  };
});