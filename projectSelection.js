define(function (require) {
  // Load websdk
  let WebSdk = require("bimplus/websdk");

  // Load Client integration
  let WebClient = require("bimplus/webclient");

  // Use environment dev,stage or prod
  let environment = WebClient.getUrlParameter("env");

  // Initalize api wrapper
  let api = new WebSdk.Api(WebSdk.createDefaultConfig(environment));

  // Get the token from the url paremter list and set api token
  let token = WebClient.getUrlParameter("token");
  api.setAccessToken(token);

  let currentProject;
  let currentTeam;

  // Create the external client for communication with the bimplus controls
  let externalClient = new WebClient.ExternalClient("MyClient");

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
      "?token=" +
      token +
      "&env=" +
      environment +
      "&team=" +
      currentTeam +
      "&project=" +
      currentProject;
  };

  // Load the project selection
  projects.load();
});
