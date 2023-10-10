const core = require("@actions/core");
const { App } = require("@octokit/app");
const { Octokit } = require("@octokit/rest");

async function main() {
  const appId = core.getInput("app_id");
  const privateKey = core.getInput("private_key");
  const installationId = core.getInput("installation_id");

  const app = new App({ appId, privateKey, Octokit });

  const response = await app.octokit.rest.apps.createInstallationAccessToken({
    installation_id: installationId,
  });

  const token = response.data.token;

  core.exportVariable("TOKEN", token);
  core.setSecret("TOKEN");
}

main();
