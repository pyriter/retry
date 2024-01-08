import {sleep} from './sleep';
import {isNullOrUndefined} from "./helper";

const MAX_RETRY = 100;

type CallBackFunction<T> = () => T;
type ExecuteFunctionResults<T> = {
  result: boolean;
  response: T;
};

export class Retry<T> {
  constructor(private retry: number, private callbackFunction: CallBackFunction<T>) {
  }

  static RetryBuilder<T>() {
    return new RetryBuilder<T>();
  }

  async execute(): Promise<T> {
    let retryCount = 0;
    let timeout = 1;
    let totalTime = 0;
    let lastResponse;
    while (retryCount < Math.min(MAX_RETRY, this.retry)) {
      console.debug(`Retry Executor. retryCount: ${retryCount} with timeout: ${timeout} and totalTime: ${totalTime}`);
      const {result, response} = await this.executeFunction();
      lastResponse = response;
      if (result) {
        return response;
      }
      await sleep(timeout); // Exponential backoff
      retryCount++;
      totalTime += timeout;
      timeout = Math.pow(2, retryCount);
    }
    throw new Error(`Failed to execute function with error: ${JSON.stringify(lastResponse)}`);
  }

  private async executeFunction(): Promise<ExecuteFunctionResults<T>> {
    try {
      const results = await this.callbackFunction();
      return {result: true, response: results};
    } catch (e: any) {
      console.error(`Failed to execute retry function with error: ${e.message}`);
      return {result: false, response: e};
    }
  }
}

export class RetryBuilder<T> {
  private maxRetry: number = 0;
  // @ts-ignore
  private callBackFunction: CallBackFunction<T>;

  withMaxRetry(retry: number) {
    this.maxRetry = retry;
    return this;
  }

  withCallbackFunction(callbackFunction: CallBackFunction<T>) {
    this.callBackFunction = callbackFunction;
    return this;
  }

  build() {
    if (isNullOrUndefined(this.callBackFunction)) {
      throw new TypeError('callBackFunction needs to be defined');
    }
    return new Retry(this.maxRetry, this.callBackFunction);
  }
}
