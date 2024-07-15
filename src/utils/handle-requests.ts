export async function handleRequests<T extends unknown[]>(
  requests: readonly [...T],
): Promise<{
  [K in keyof T]: Awaited<T[K]>;
}> {
  const results = await Promise.allSettled(requests);

  return results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      // Use string as the error reason
      throw { error: result.reason as string };
    }
  }) as {
    [K in keyof T]: Awaited<T[K]>;
  };
}
