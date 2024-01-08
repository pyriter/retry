export async function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function sleepInSeconds(seconds: number): Promise<void> {
  return sleep(seconds * 1000);
}
