module.exports = function paginate(query) {
  if (!query) {
    return {};
  }
  const { sort, perPage, page } = query;
  if (page === undefined || !perPage || !sort) {
    return {};
  }
  const offset = page * perPage;
  const limit = perPage;

  return {
    order: [sort],
    offset,
    limit,
  };
}
