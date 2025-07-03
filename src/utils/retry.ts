export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= retries) throw error;
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  // Should never reach here, but TypeScript needs it
  throw new Error('Retry failed unexpectedly');
}
