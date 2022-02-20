import { getInput, setFailed } from "@actions/core";
import { generateLicenseFile } from "generate-license-file";
import { isValidEol } from "generate-license-file/dist/generateLicenseFile";

const main = async () => {
  try {
    await runGitHubAction();
  } catch (error: unknown) {
    handleErrorInGitHubAction(error);
  }
};

const runGitHubAction = async () => {
  const packageJsonLocation = getInput("input");
  const licenseFileLocation = getInput("output");
  const lineEnding = getInput("lineEnding");

  const validEol = isValidEol(lineEnding);
  if (!validEol) {
    setFailed("The given line ending is not valid");
    return;
  }

  await generateLicenseFile(packageJsonLocation, licenseFileLocation, lineEnding);
};

const handleErrorInGitHubAction = (thrown: unknown) => {
  if (thrown instanceof Error) {
    setFailed(thrown.message);
    return;
  }

  if (typeof thrown === "string") {
    setFailed(thrown);
    return;
  }

  setFailed("Unknown error in Generate-License-File");
};

(async () => {
  await main();
})();
