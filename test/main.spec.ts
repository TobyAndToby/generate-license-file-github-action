import { getInput, setFailed } from "@actions/core";
import { generateLicenseFile } from "generate-license-file";
import { when } from "jest-when";

jest.mock("@actions/core");
jest.mock("generate-license-file", () => ({
  generateLicenseFile: jest.fn()
}));

describe("main", () => {
  const mockedGetInput = jest.mocked(getInput);
  const mockedSetFailed = jest.mocked(setFailed);
  const mockedGenerateLicenseFile = jest.mocked(generateLicenseFile);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should get the input input", async () => {
    jest.isolateModules(() => {
      jest.requireActual("../src/main");
    });

    expect(mockedGetInput).toHaveBeenCalledWith("input", { required: true });
  });

  it("should get the output input", async () => {
    jest.isolateModules(() => {
      jest.requireActual("../src/main");
    });

    expect(mockedGetInput).toHaveBeenCalledWith("output", { required: true });
  });

  it("should get the lineEnding input", async () => {
    jest.isolateModules(() => {
      jest.requireActual("../src/main");
    });

    expect(mockedGetInput).toHaveBeenCalledWith("lineEnding");
  });

  it("should call generate-licence-file with valid arguments", async () => {
    const input = "./package.json";
    const output = "./third-party-licenses.txt";
    const lineEnding = "posix";

    mockInput(input);
    mockOutput(output);
    mockLineEnding(lineEnding);

    jest.isolateModules(() => {
      jest.requireActual("../src/main");
    });

    expect(mockedGenerateLicenseFile).toHaveBeenCalledTimes(1);
    expect(mockedGenerateLicenseFile).toHaveBeenCalledWith(input, output, lineEnding);
  });

  it("should call generate-licence-file with an undefined lineEnding when it's given as an empty string", async () => {
    const input = "./package.json";
    const output = "./third-party-licenses.txt";
    const lineEnding = "";

    mockInput(input);
    mockOutput(output);
    mockLineEnding(lineEnding);

    jest.isolateModules(() => {
      jest.requireActual("../src/main");
    });

    expect(mockedGenerateLicenseFile).toHaveBeenCalledTimes(1);
    expect(mockedGenerateLicenseFile).toHaveBeenCalledWith(input, output, undefined);
  });

  it("should not call generate-licence-file when the lineEnding is invalid", async () => {
    const input = "./package.json";
    const output = "./third-party-licenses.txt";
    const lineEnding = "not a valid line ending";

    mockInput(input);
    mockOutput(output);
    mockLineEnding(lineEnding);

    jest.isolateModules(() => {
      jest.requireActual("../src/main");
    });

    expect(mockedGenerateLicenseFile).toHaveBeenCalledTimes(0);
  });

  it("should fail the pipeline when the lineEnding is invalid", async () => {
    const input = "./package.json";
    const output = "./third-party-licenses.txt";
    const lineEnding = "not a valid line ending";

    mockInput(input);
    mockOutput(output);
    mockLineEnding(lineEnding);

    jest.isolateModules(() => {
      jest.requireActual("../src/main");
    });

    await cycleEventLoop();

    expect(mockedSetFailed).toHaveBeenCalledTimes(1);
    expect(mockedSetFailed).toHaveBeenCalledWith(
      "The given line ending 'not a valid line ending' is not valid"
    );
  });

  it("should fail the pipeline when generate-license-file throws with an Error", async () => {
    const expectedErrorMessage = "Error in Generate-License-File";

    const input = "./package.json";
    const output = "./third-party-licenses.txt";
    const lineEnding = "posix";

    mockInput(input);
    mockOutput(output);
    mockLineEnding(lineEnding);

    mockedGenerateLicenseFile.mockRejectedValue(new Error(expectedErrorMessage));

    jest.isolateModules(() => {
      jest.requireActual("../src/main");
    });

    await cycleEventLoop();

    expect(mockedSetFailed).toHaveBeenCalledTimes(1);
    expect(mockedSetFailed).toHaveBeenCalledWith(expectedErrorMessage);
  });

  it("should fail the pipeline when generate-license-file throws with a string", async () => {
    const expectedErrorMessage = "Error in Generate-License-File";

    const input = "./package.json";
    const output = "./third-party-licenses.txt";
    const lineEnding = "posix";

    mockInput(input);
    mockOutput(output);
    mockLineEnding(lineEnding);

    mockedGenerateLicenseFile.mockRejectedValue(expectedErrorMessage);

    jest.isolateModules(() => {
      jest.requireActual("../src/main");
    });

    await cycleEventLoop();

    expect(mockedSetFailed).toHaveBeenCalledTimes(1);
    expect(mockedSetFailed).toHaveBeenCalledWith(expectedErrorMessage);
  });

  it("should fail the pipeline when generate-license-file throws an unknown object", async () => {
    const expectedErrorMessage = "Unknown error in Generate-License-File";

    const input = "./package.json";
    const output = "./third-party-licenses.txt";
    const lineEnding = "posix";

    mockInput(input);
    mockOutput(output);
    mockLineEnding(lineEnding);

    mockedGenerateLicenseFile.mockRejectedValue({ some: "Unknown Error" });

    jest.isolateModules(() => {
      jest.requireActual("../src/main");
    });

    await cycleEventLoop();

    expect(mockedSetFailed).toHaveBeenCalledTimes(1);
    expect(mockedSetFailed).toHaveBeenCalledWith(expectedErrorMessage);
  });

  const mockInput = (value: string) => {
    when(mockedGetInput).calledWith("input", { required: true }).mockReturnValue(value);
  };

  const mockOutput = (value: string) => {
    when(mockedGetInput).calledWith("output", { required: true }).mockReturnValue(value);
  };

  const mockLineEnding = (value: string) => {
    when(mockedGetInput).calledWith("lineEnding").mockReturnValue(value);
  };
});

const cycleEventLoop = () => new Promise(resolve => setTimeout(resolve, 0));
