export const shortenId = (id: number) => {
  const idStr = String(id);
  return idStr.length > 3 ? `${idStr.slice(0, 1)}..${idStr.slice(-2)}` : id;
};
