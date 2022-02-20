import { getInput, setFailed } from "@actions/core";
import { generateLicenseFile, LineEnding } from "generate-license-file";
import { isValidEol } from "generate-license-file/dist/generateLicenseFile";

const main = async () => {
  try {
    await runGitHubAction();
  } catch (error: unknown) {
    handleErrorInGitHubAction(error);
  }
};

const runGitHubAction = async () => {
  const packageJsonLocationInput = getInput("input", { required: true });
  const licenseFileLocationInput = getInput("output");
  const lineEndingInput = getInput("lineEnding");

  const lineEnding = parseLineEnding(lineEndingInput);

  await generateLicenseFile(packageJsonLocationInput, licenseFileLocationInput, lineEnding);
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

const parseLineEnding = (lineEndingInput: string): LineEnding | undefined => {
  if (lineEndingInput === "") {
    return undefined;
  }

  const validEol = isValidEol(lineEndingInput);
  if (!validEol) {
    throw new Error("The given line ending is not valid");
  }

  return lineEndingInput;
};

(async () => {
  await main();
})();
