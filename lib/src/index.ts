import { v4 as uuidv4 } from 'uuid';
import assert = require('assert');
import lodash = require('lodash');
import { serializeError } from 'serialize-error';

const parallel = require('mocha.parallel');

// By design, there can be only one apiTestSuite; thus, global properties are acceptable in this context.
let testRunId: string = null;

export function apiTestSuite(
  testSuiteName: string,
  estimatedTestingTime: string,
  environment: string,
  maxTestConcurrency: number,
  maxRetries: number,
  retryTimeoutInMiliseconds: number,
  apiTests: () => void,
  _skippedTests?: () => void
): void {
  parallel.limit(maxTestConcurrency);
  parallel.maxRetries(maxRetries);
  parallel.retryTimeoutInMiliseconds(retryTimeoutInMiliseconds);
  const testRunLabel = getTestRunLabel(testSuiteName, estimatedTestingTime, environment, maxTestConcurrency, maxRetries, retryTimeoutInMiliseconds,getTestRunId());

  console.log(testRunLabel);
  parallel(testSuiteName, logFlakyTestsAfter(maxRetries, apiTests));
}

function logFlakyTestsAfter(maxRetries:number, apiTests:() => void){
  return ()=>{
    apiTests();
    after(() => { console.log(getFlakyTestReport(maxRetries))})
  }
}

export function getTestRunId() {
  if (!testRunId) {
    // With the prefix zApiTest, it's easy to identify data created by the api tests.
    // The purpose z in zApiTest is to list data created by the api tests at the end.
    // Most system use alphabetical order as default sort order. Api tests tends to
    // create a lot of data. In general, listing manually created data before the data
    // created by api tests is better.
    testRunId = `zApiTest-${uuidv4()}`;
  }
  return testRunId;
}

export function aFewSeconds(delayInSeconds: number): Promise<void> {
  const delayInMiliseconds = delayInSeconds * 1000;
  return new Promise(resolve => {
    setTimeout(async () => {
      resolve();
    }, delayInMiliseconds);
  });
}

export async function shouldThrow<T>(act: () => Promise<T>, customAssert: (err: any) => void): Promise<void> {
  let haveTrown = true;
  try {
    await act();
    haveTrown = false;
  } catch (err) {
    customAssert(err);
  }
  if (!haveTrown) {
    assert.fail('It should have thrown an exception, but it succeeded unexpectedly.');
  }
}

export type InitTemplate<T> = (templateCopy: T) => void;
export type CopyTemplate<T> = (init?: InitTemplate<T>) => T;
export function defineCopyTemplate<T>(template: T): CopyTemplate<T> {
  return (init?: InitTemplate<T>) => {
    const templateCopy = lodash.cloneDeep<T>(template);
    if (init) {
      init(templateCopy);
    }
    return templateCopy;
  };
}

export function defineCopyTemplateVariation<T>(
  originalCopyTemplate: CopyTemplate<T>,
  variation: InitTemplate<T>
): CopyTemplate<T> {
  return (init?: InitTemplate<T>) => {
    return originalCopyTemplate((templateCopy: T) => {
      variation(templateCopy);
      if (init) {
        init(templateCopy);
      }
    });
  };
}

export type CreateSharedFixture<TRootEntity> = () => Promise<TRootEntity>;
export type GetSharedFixture<TRootEntity> = () => Promise<TRootEntity>;
export function defineGetSharedFixture<TRootEntity>(
  createSharedFixture: CreateSharedFixture<TRootEntity>
): GetSharedFixture<TRootEntity> {
  // defineGetSharedFixtureByKey is adapted for the case where a single share fixture is required.
  const getSharedFixtureByKey = defineGetSharedFixtureByKey<string, TRootEntity>(key => createSharedFixture());
  return () => getSharedFixtureByKey('single-key');
}

export type CreateSharedFixtureByKey<TKey, TRootEntity> = (key: TKey) => Promise<TRootEntity>;
export type GetSharedFixtureByKey<TKey, TRootEntity> = (key: TKey) => Promise<TRootEntity>;
export function defineGetSharedFixtureByKey<TKey, TRootEntity>(
  createSharedFixtureByKey: CreateSharedFixtureByKey<TKey, TRootEntity>
): GetSharedFixtureByKey<TKey, TRootEntity> {
  const map: Map<TKey, Promise<TRootEntity>> = new Map();

  return (key: TKey) => {
    // The shared fixture promise will only be created on the first call.
    // Next calls will await for the same share fixture promise;
    // thus, the same fixture is shared between many test cases.
    if (!map.has(key)) {
      const sharedFixturePromise = createSharedFixtureByKey(key)
        // Share fixture must be immutable. Here we enforce it.
        .then(x => Object.freeze(x));

      map.set(key, sharedFixturePromise);
    }

    return map.get(key);
  };
}


//*******************************************************************************************
// Reporting
//*******************************************************************************************
interface IRetriedTestFailure {
  specName: string;
  testExecutionIndex: number;
  err: any;
}

function getTestRunLabel(
  testSuiteName: string,
  estimatedTestingTime: string,
  environment: string,
  maxTestConcurrency: number,
  maxRetries: number,
  retryTimeoutInMiliseconds: number,  
  testRunId: string
) {
  return `  ----------------------------------------------------------
Test suite name: 
${testSuiteName}
----------------------------------------------------------
Estimated execution time: 
${estimatedTestingTime}
----------------------------------------------------------
Environment: 
${environment}
----------------------------------------------------------
Max test concurrency: 
${maxTestConcurrency}
----------------------------------------------------------
Max retries: 
${maxRetries}
----------------------------------------------------------
Retry timeout in miliseconds: 
${retryTimeoutInMiliseconds}
----------------------------------------------------------
Test run id: 
${testRunId}
----------------------------------------------------------`;
}

//Pre condition: each test in the suite must have a unique name.
function getFlakyTestReport(maxRetries:number){
  const retriedTestFailures = parallel.getRetriedTestFailures() as IRetriedTestFailure[];
  const retriedTestFailuresGroupBySpecName = lodash.groupBy(retriedTestFailures,x=>x.specName);
  const flakySpecNames = Object.keys(lodash.pickBy(retriedTestFailuresGroupBySpecName, x =>x.length<=maxRetries));
  flakySpecNames.sort();

  if(flakySpecNames.length>0){
    return "\nFlaky tests:\n" +
      flakySpecNames
        .map((flakySpecName) =>
          `- ${flakySpecName} failed ${retriedTestFailuresGroupBySpecName[flakySpecName].length} times before succeding.\n${getRetriedTestFailuresReport(retriedTestFailuresGroupBySpecName[flakySpecName])}`
        )
        .join("\n");
  }
  else{
      return "  No flaky tests!";
  }
}

function getRetriedTestFailuresReport(retriedTestFailuresForOneTest:IRetriedTestFailure[]){
  return retriedTestFailuresForOneTest.map(x=>
      `\nFailure ${x.testExecutionIndex+1}:\n${fullErrorAsString(x.err)}\n`
  ).join("")
}  

function fullErrorAsString(error:any){
  const serializedError = serializeError(error);
  return JSON.stringify(serializedError,null, "  ");
}
