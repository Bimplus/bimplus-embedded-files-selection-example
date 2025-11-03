define(function (require) {
  // Load websdk
  let WebSdk = require("bimplus/websdk");

  // Load Client integration
  let WebClient = require("bimplus/webclient");
  let AllplanUserManager = require('allplanUserManager');

  // Get values from URL
  let environment = WebClient.getUrlParameter("env");
  let currentToken = WebClient.getUrlParameter("token");
  let currentTeam = WebClient.getUrlParameter("team");
  let currentProject = WebClient.getUrlParameter("project");

  // Initalize api wrapper
  let api = new WebSdk.Api(WebSdk.createDefaultConfig(environment));

   // Create the UserManager
  let userManager = AllplanUserManager.createUserManager(environment);

   let initializePage = async function () {
    let user = await userManager.getUser();
    if (!user || !user.access_token) {
      window.location.href = "/index.html"
    }

    currentToken = user.access_token;
    api.setAccessToken(currentToken);

    // Iframe element ID, where embedded window will be rendered
    let frameID = "bimplusFrame";

    // Create the external client for communication with the bimplus controls
    let externalClient = new WebClient.ExternalClient("MyClient");
    // Initialize the client to listen for messages
    externalClient.initialize();

    // set frame opener button function
    let openerButton = document.getElementById("frameOpener");
    openerButton && (openerButton.onclick = openFilesSelection);

    function openFilesSelection() {
      if (!currentToken) {
        alert("Login to Bimplus failed!");
        return;
      }

      // hide frame opener button
      let openerButton = document.getElementById("frameOpener");
      openerButton?.classList?.add("hidden");

      // create iframe element
      let iframeEl = document.createElement("iframe");
      iframeEl?.setAttribute("id", frameID);
      document.body.appendChild(iframeEl);

      // Create the proxy classes for files, binding it to an exisiting iframe id
      let files = new WebClient.BimFilesSelect(
        frameID,
        api.getAccessToken(),
        externalClient,
        environment
      );

      // handle messages for client/clients
      files.onAttachmentSelected = (ids) => {
        if (ids && ids.length > 0) {
          let message = "";
          ids.forEach((id, index) => {
            message = message + "\n" + (index + 1) + ". file id: " + id;
          });

          alert("Files: IDs of selected files: (" + ids.length + ")" + message);
        } else {
          alert("Files: Nothing selected - embedded frame can be closed");
          closeFilesSelection();
        }
      };

      console.debug(
        `Load files team-Id = ${currentTeam} project-Id = ${currentProject}`
      );
      files.load(currentTeam, currentProject);
    }

    function closeFilesSelection() {
      // remove iframe element
      let iframeEl = frameID && document.getElementById(frameID);
      iframeEl && document.body.removeChild(iframeEl);

      // Go back to project selection
      window.location.href =
        "/projectSelection.html" +
        "?env=" +
        environment;
    }
  };

  initializePage();
});
