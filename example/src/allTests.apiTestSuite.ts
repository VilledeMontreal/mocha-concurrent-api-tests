import { apiTestSuite } from '../../lib/src';
import { blogPostApiTests } from './blogPosts/blogPost.apiTest';
import { apiUnderTestConfig } from './shared/apiUnderTest/apiUnderTestConfig';
import { userApiTests } from './users/user.apiTest';

apiTestSuite(
  'sample test suite',
  '3 seconds',
  apiUnderTestConfig.apiBaseUrl,
  30,
  () => {
    userApiTests();
    blogPostApiTests();
  },
  () => {
    // mocha.parallel does not support nested test suites.
    // As a simple work around, move skip tests in this section.
  }
);
