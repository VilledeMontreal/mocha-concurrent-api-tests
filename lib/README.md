# mocha-concurrent-api-tests

Mocha-concurrent-api-tests provides the core functions required to implement [Concurrent API Tests](\$todo:blogpost url) with [Mocha](https://mochajs.org/). Thanks to [mocha.parallel](https://github.com/danielstjules/mocha.parallel) for providing a [single threaded event loop architecture](https://medium.com/@sgd.daran/node-js-single-threaded-event-loop-model-dbeccf6a7c34) for Mocha tests.

## To Install

In your project, run this npm command:

`npm install mocha-concurrent-api-tests --save-dev`

## Functions

### apiTestSuite(testSuiteName, estimatedTestingTime, environment, maxTestConcurrency, apiTests, skippedTests?)

Execute a mocha concurrent api test suite. Mocha [describe function](https://mochajs.org/#getting-started) and nested describe functions are not supported by mocha-concurrent-api-tests. Instead, a mocha concurrent api test suite executes many Mocha [it function](https://mochajs.org/#getting-started) concurrently in the same thread.

**Arguments**

- testSuiteName: The name of the test suite.
- estimatedTestingTime: The estimated time required to execute the test suite (Ex: "45 seconds").
- environment: The environment against wish the test suite is executeed (Ex: "dev").
- maxTestConcurrency: The maximum number of tests that can be executed concurrently (Ex: 30).
- apiTests: A function that invoke many [it function](https://mochajs.org/#getting-started). Mocha [describe function](https://mochajs.org/#getting-started) can be emulated by grouping [it functions](https://mochajs.org/#getting-started) into standard functions. See [mocha-concurrent-api-tests example](../example/src/allTests.apiTestSuite.ts#L11-L14).
- skippedTests?: [optionnal] A function that invoke many skipped [it function](https://mochajs.org/#getting-started). Allows to skip a group of [it functions](https://mochajs.org/#getting-started). See [mocha-concurrent-api-tests example](../example/src/allTests.apiTestSuite.ts#L15-L18).

**Returns**

void

**Example**

See [mocha-concurrent-api-tests example](../example/src/allTests.apiTestSuite.ts#L6-L19).

### defineCopyTemplate<T>(template: T): CopyTemplate<T>

Define a function that provide a default payload template and that allow to specify only the parts of the payload that are meaningful for the test case. This way, test cases are easier to read since only the parts that matter are specified. Moreover, if a change in a payload is required, only the default payload template and the related tests need to be changed.

**Arguments**

- template: A default payload template.

**Returns**

A function that provide a default payload template and allow to specify only the parts of the payload that are meaningful for the test case.

**Example**

See [mocha-concurrent-api-tests example](../example/src/blogPosts/blogPost.template.ts#L4-L17).

### defineCopyTemplateVariation<T>(

Define a copy template variation to avoid duplication when the same template is used in many test cases.

**Arguments**

- originalCopyTemplate: The original copy template function. See defineCopyTemplate \$todo.
- variation: A function that specifies only the parts of the payload that are meaningful for the variation.

**Returns**

A function that provide a default payload template and allow to specify only the parts of the payload that are meaningful for the test case.

**Example**

See [mocha-concurrent-api-tests example](../example/src/blogPosts/blogPost.template.ts#L19-L23).

### shouldThrow(act, customAssert)

Assert against an API request that is expected to throw an error.

**Arguments**

- act: A function that send the API request.
- customAssert: A function that assert against the error.
  **Returns**

void

**Example**

See [mocha-concurrent-api-tests example](../example/src/blogPosts/blogPost.apiTest.ts#L29-L36).

### aFewSeconds(delayInSeconds)

Some test cases must rely on the timing between API requests. These test cases are likely to be [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359) if the timing is not managed with care.

If the precision of the timing has to be less than a seconds, then mocha-concurrent-api-tests is not the right tool for this test case. For more guidance, see [Concurrent API Tests]($todo).

**Arguments**

- delayInSeconds: The number of secondes to wait for. (Ex: 5).

**Returns**

void

**Example**

`await aFewSeconds(5);`

### defineGetSharedFixture(createSharedFixture)

Define a function that perform lazy initialization of a fixture. This allow to share the same fixture between many tests cases and to initialize it only once.

A fixture may be shared between the test cases of the same test run if

1. the attribute of the user are not meaningful for the test
2. the fixture is immutable

Although shared fixture can speed up test runs and reduce the amount of data created
on the server, they must be used with care since they can produce flaky test cases
if the two points above are not respected.

In doubt, create a new fixture for each test case.

Fast tests are important, but reliable tests are even more important.

**Arguments**

- createSharedFixture: A function that initialize the shared fixture.

**Returns**

A function that perform lazy initialization of the shared fixture.

**Example**

See [mocha-concurrent-api-tests example](../example/src/users/user.fixture.ts#L14).

### defineGetSharedFixtureByKey(createSharedFixture)

Same as defineGetSharedFixture, but allow to pass a key as argument. Useful when there are many similar shared fixture to be defined.

**Arguments**

- createSharedFixture: A function that initialize the shared fixture for a specific key.

**Returns**

A function that perform lazy initialization of the shared fixture for a specific key.

**Example**

See [mocha-concurrent-api-tests example](../example/src/users/user.fixture.ts#L16).

## Testing mocha-concurrent-api-tests itself

Run all unit tests, run this npm command:

`npm start`

Debug all unit tests, run this npm command:

`npm run watch` (to activate incremental transpilation) and use the Visual Studio Code launcher **Debug**.
