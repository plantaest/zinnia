export const diffArrays = (origin: string[], after: string[]) => {
  const kept = origin.filter((item) => after.includes(item));
  const removed = origin.filter((item) => !after.includes(item));
  const added = after.filter((item) => !origin.includes(item));

  return { kept, removed, added };
};
