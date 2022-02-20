# generate-license-file GitHub Action

GitHub Action to generate a text file asset containing all of the licenses for your production npm third-party dependencies.

<p>
  <a href="https://github/TobyAndToby/generate-license-file-github-action/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/TobyAndToby/generate-license-file-github-action?label=GitHub%20Action">
  </a>
  <a href="https://codecov.io/github/TobyAndToby/generate-license-file-github-action">
    <img src="https://codecov.io/github/TobyAndToby/generate-license-file-github-action/branch/main/graph/badge.svg"/>
  </a>
</p>

Based on the npm package [generate-licence-file](https://www.npmjs.com/package/generate-license-file).

## Usage

To run the Action, supply your package.json path as `input`, and your desired output file as `output`.

```yaml
jobs:
  myJob:
    steps:
      - uses: actions/checkout@v2

      - uses: generate-licence-file@latest
        name: Generate License File
        with:
          input: "./package.json"
          output: "./third-party-licenses.txt"
```

You can also specify which line ending you would like it to use, either `windows` for ` crlf` or `posix` for `lf`. If you don't supply one it will use the build agents default.

```yaml
jobs:
  myJob:
    steps:
      - uses: actions/checkout@v2

      - uses: generate-licence-file@latest
        name: Generate License File
        with:
          input: "./package.json"
          output: "./third-party-licenses.txt"
          lineEnding: posix
```

## Building the action yourself

```bash
npm install
npm run build
```

A Husky pre-commit hook will automatically build and commit the dist directory on each commit to ensure that the committed JavaScript code is always up to date.

## License

generate-license-file-github-action is licensed under the [ISC License](./LICENSE.md).
