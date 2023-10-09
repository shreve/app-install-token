const core = require("@actions/core");
const { App } = require("@octokit/app");

async function main() {
  const appId = core.getInput("app_id");
  const privateKey = core.getInput("private_key");
  const installationId = core.getInput("installation_id");

  const app = new App({ appId, privateKey });
  const octokit = await app.getInstallationOctokit(installationId);

  const token = octokit.rest.apps.createInstallationAccessToken();

  core.exportVariable("TOKEN", token);
  core.setSecret("TOKEN");
}

main();
