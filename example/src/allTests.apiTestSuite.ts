import { blogPostApiTests } from './blogPosts/blogPost.apiTest';
import { apiUnderTestConfig } from './shared/apiUnderTest/apiUnderTestConfig';
import { userApiTests } from './users/user.apiTest';
import { apiTestSuite, getFlakyTestReport } from '@villedemontreal/mocha-concurrent-api-tests';

apiTestSuite(
  'sample test suite',
  '3 seconds',
  apiUnderTestConfig.apiBaseUrl,
  30,
  2,
  5000,
  () => {
    userApiTests();
    blogPostApiTests();

    // after hook is a simplistic approach to building a reporter for flaky tests.
    // Consider using .getRetriedTestFailures() to build a proper mocha reporter
    // For more details, see https://mochajs.org/api/tutorial-custom-reporter.html
    after(()=> console.log(getFlakyTestReport()));  
  },
  () => {
    // mocha.parallel does not support nested test suites.
    // As a simple work around, move skip tests in this section.
  }
);
