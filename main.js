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

  const data = response.data;
  const token = data.token;
  delete data.token;

  core.info(
    "Returned a token with the following attributes:\n" +
      JSON.stringify(data, null, 2),
  );

  core.debug(`The token starts with '${token.slice(0, 10)}'...`);

  core.setOutput("token", token);
  core.setSecret(token);
}

main();
