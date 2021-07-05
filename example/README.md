# mocha-concurrent-api-tests example

The mocha-concurrent-api-tests example shows how apply the [Concurrent API Tests](https://medium.com/@stphaneleblanc/d84f7a29f0dc?source=friends_link&sk=843339381eaf77195f8522449c907550) approach of with [Mocha](https://mochajs.org/).

Concurrent API tests are as easy to read as standard Mocha tests. Here are some test case for the [blog posts](https://github.com/VilledeMontreal/mocha-concurrent-api-tests/blob/master/example/src/blogPosts/blogPost.apiTest.ts) and [users](https://github.com/VilledeMontreal/mocha-concurrent-api-tests/blob/master/example/src/users/user.apiTest.ts). 

These test cases are grouped in a test suite. Running the test suite produce this test report.
```
----------------------------------------------------------
Test suite name: 
sample test suite
----------------------------------------------------------
Estimated execution time: 
3 seconds
----------------------------------------------------------
Environment: 
http://localhost:$port
----------------------------------------------------------
Test run id: 
zApiTest-e0eb7662-6163-4d46-b716-ee2a97a508ff
----------------------------------------------------------
    ✓ users - create (1002ms)
    ✓ blogPosts - create (2004ms)
    ✓ blogPosts - title is required (2003ms)
    ✓ blogPosts - search by author (3004ms)
    ✓ Anti-pattern: Asserting on default values (3004ms)


  5 passing (3s)
```



The folder ./example can be use as a template for starting new test projects.

## To execute

Under /example, run these npm commands:

- `npm install`
- `npm start`

## Features

- Usage examples of [mocha-concurrent-api-tests functions](https://github.com/VilledeMontreal/mocha-concurrent-api-tests/blob/master/lib/README.md#functions)
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
