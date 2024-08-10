"use server";

type HandleRequestsReturnType<T> = {
  [K in keyof T]: Awaited<T[K]>;
};

export async function handleRequests<T extends unknown[]>(
  requests: readonly [...T],
): Promise<HandleRequestsReturnType<T>> {
  const results = await Promise.allSettled(requests);

  console.log("ger out of hero", results);

  return results.map((result) => {
    if (result.status === "fulfilled") return result.value;
    throw { error: result.reason as string };
  }) as HandleRequestsReturnType<T>;
}
