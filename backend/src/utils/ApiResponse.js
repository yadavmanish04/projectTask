const ApiResponse = (res, statusCode, message, data = null, meta = null) => {
  const body = { success: statusCode < 400, message };
  if (data !== null) body.data = data;
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
};

module.exports = ApiResponse;
