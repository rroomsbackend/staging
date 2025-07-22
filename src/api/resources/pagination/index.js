export const getPagination = (page, size) => {
  //console.log('page, size',page, size)
  const limit = size ? + size : 25;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

export const getPagingData = (result, page, limit) => {
  const { count: totalItems, rows: data } = result;
  const currentPage = page ? + page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, data, totalPages, currentPage };
};