# mocha-concurrent-api-tests example

The mocha-concurrent-api-tests example shows how apply the [Concurrent API Tests](\$todo:blogpost url) approach of with [Mocha](https://mochajs.org/).

The example can be use as a template for starting new test projects.

## To execute

Under /example, run these npm commands:

- `npm install`
- `npm start`

## Features

- Usage examples of [mocha-concurrent-api-tests](../lib/README.md) \$todo
- File extension convention
- Ability to test against the current and the latest stable version version of the system under test.
  - `npm run test-current`
  - `npm run test-latest-stable`
- When a test fails due to an unexpected error, the full error in JSON format is available in the test report. Thanks to [mocha-error-reporters](https://github.com/VilledeMontreal/mocha-error-reporters).
- Incremental compilation
  - `npm run watch`
- Debug launcher for Visual Studio Code
  - Launch `Test current (Launch npm run watch before)`
  - Launch `Test latest stable (Launch npm run watch before)`
- Default [linter](<https://en.wikipedia.org/wiki/Lint_(software)>)
  - `npm run lint`
  - `npm run lint-fix`

## File extension convention

- **.apiTests.ts**: Define a list of cohesive test cases related to the same feature. More than one .apiTests.ts file per feature may be required.

- **.apiTestSuite.ts**: Run many api tests concurrently. In general, having a single api test suite is recommanded. If your api tests run fast, why not always run them all? If needed, many api test suites can be created.

- **.fixture.ts**: Define functions that can be used as building blocks for [arranging](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/) the test cases.

- **.template.ts**: Define functions that provide a default payload template and that allow to specify only the parts of the payload that are meaningful for the test case.

## Required extensions for real-time linting with VSCode

- Prettier - code formatter for enforcing a consistent style
- TSLint - checks code for readability, maintainability
