const core = require("@actions/core");
const fs = require("fs");
const os = require("os");
const path = require("path");

async function main() {
  const saveCredential = core.getInput("save_credential");

  if (saveCredential) {
    core.info("Removing ~/.git-credentials file");
    const homeDir = os.homedir();
    const gitCredentialsPath = path.join(homeDir, ".git-credentials");
    if (fs.existsSync(gitCredentialsPath)) {
      fs.unlinkSync(gitCredentialsPath);
    }
  }
}

main();
