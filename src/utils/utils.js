function toTimestamp(dateStr) {
  const dateObj = new Date(dateStr);
  const timestamp = dateObj.getTime();
  return timestamp / 1000;
}

function toDatee(timestamp) {
  const dateObj = new Date(timestamp);
  return dateObj;
}

module.exports = {
  toTimestamp,
  toDatee,
};
