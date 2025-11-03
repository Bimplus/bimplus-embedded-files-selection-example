define(function (require) {
  // Load websdk
  let WebSdk = require("bimplus/websdk");

  // Load Client integration
  let WebClient = require("bimplus/webclient");

  let AllplanUserManager = require('allplanUserManager');

  // Use environment dev,stage or prod
  let environment = WebClient.getUrlParameter("env");

  // Initalize api wrapper
  let api = new WebSdk.Api(WebSdk.createDefaultConfig(environment));

  // Create the UserManager
  let userManager = AllplanUserManager.createUserManager(environment);

  let currentProject;
  let currentTeam;

  // Create the external client for communication with the bimplus controls
  let externalClient = new WebClient.ExternalClient("MyClient");

  let initializePage = async function () {
    let user = await userManager.getUser();
    if (!user || !user.access_token) {
      window.location.href = "/index.html"
    }

    api.setAccessToken(user.access_token);

    let projects = new WebClient.BimPortal(
      "projects",
      api.getAccessToken(),
      externalClient,
      environment
    );

    // Initialize the client to listen for messages
    externalClient.initialize();

    projects.onTeamChanged = (teamId) => {
      currentTeam = teamId;
      console.debug("onTeamChanged newTeam = " + teamId);
    };

    projects.onProjectSelected = (prjId) => {
      currentProject = prjId;
      console.debug("onProjectSelected newProjectId = " + prjId);
      window.location.href =
        "/fileSelection.html" +
        "?env=" +
        environment +
        "&team=" +
        currentTeam +
        "&project=" +
        currentProject;
    };

    // Load the project selection
    projects.load();
  };

  initializePage();
});
