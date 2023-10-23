const core = require("@actions/core");
const exec = require("@actions/exec");
const { App } = require("@octokit/app");
const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const os = require("os");
const path = require("path");

async function main() {
  const appId = core.getInput("app_id");
  const privateKey = core.getInput("private_key");
  const installationId = core.getInput("installation_id");
  const saveCredential = core.getInput("save_credential");

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

  core.info(
    "Saving token to output `token` and $GH_TOKEN environment variable",
  );
  core.setOutput("token", token);
  core.exportVariable("GH_TOKEN", token);
  core.setSecret(token);

  if (saveCredential) {
    core.info("Saving credentials to ~/.git-credentials file");
    const homeDir = os.homedir();
    const gitCredentialsPath = path.join(homeDir, ".git-credentials");
    const gitCredentials = `https://x-access-token:${token}@github.com`;
    fs.writeFileSync(gitCredentialsPath, gitCredentials);

    core.info("Configuring git to use ~/.git-credentials file");
    exec.exec(`git config --global credential.helper store`);
  }
}

main();
