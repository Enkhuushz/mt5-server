const BAD_REQUEST = (res, error) => {
  return res.status(400).json({
    success: false,
    error,
  })
}








module.exports = {
  BAD_REQUEST,
}