import * as _ from 'lodash';
import { serializeError } from 'serialize-error';
const parallel = require('mocha.parallel');

interface IRetriedTestFailure {
    specName: string;
    testExecutionIndex: number;
    err: any;
}

export function getTestRunLabel(
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
export function getFlakyTestReport(maxRetries:number){
    const retriedTestFailures = parallel.getRetriedTestFailures() as IRetriedTestFailure[];
    const retriedTestFailuresGroupBySpecName = _.groupBy(retriedTestFailures,x=>x.specName);
    const flakySpecNames = Object.keys(_.pickBy(retriedTestFailuresGroupBySpecName, x =>x.length<=maxRetries));
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