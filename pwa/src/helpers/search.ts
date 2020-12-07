export const mergeSearchParams = (
  params: URLSearchParams,
  entries: Record<string, any>,
) => {
  const newParams = new URLSearchParams(params);

  Object.entries(entries).forEach(([key, value]) => {
    if (typeof value === 'undefined' || value === null) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
  });

  return newParams;
};
