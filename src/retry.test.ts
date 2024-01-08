import {Retry} from "./retry";

describe('retry', () => {
  it('should call a function', async () => {
    let changeVariable = 1;
    const retry = Retry.RetryBuilder()
      .withMaxRetry(1)
      .withCallbackFunction(async () => {
        changeVariable = 2;
      })
      .build();

    await retry.execute();
    expect(changeVariable).toEqual(2);
  });
});
