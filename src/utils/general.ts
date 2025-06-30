export const getPagination = (limitRaw: any, pageRaw: any) => {
  const limit = parseInt(limitRaw);
  const page = parseInt(pageRaw);

  return {
    limit: Number.isNaN(limit) || limit <= 0 ? 10 : limit,
    page: Number.isNaN(page) || page < 0 ? 0 : page,
  };
};
