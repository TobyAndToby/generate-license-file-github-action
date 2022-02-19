import { getInput, error } from "@actions/core";
import { isValidEol } from "generate-license-file/dist/generateLicenseFile";
import { generateLicenseFile } from "generate-license-file";

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
    error("The given line ending is not valid");
    return;
  }

  await generateLicenseFile(packageJsonLocation, licenseFileLocation, lineEnding);
};

const handleErrorInGitHubAction = (thrown: unknown) => {
  if (thrown instanceof Error) {
    error(thrown.message);
    return;
  }

  if (typeof thrown === "string") {
    error(thrown);
    return;
  }

  error("Unknown error in Generate-License-File");
};

(async () => {
  await main();
})();
