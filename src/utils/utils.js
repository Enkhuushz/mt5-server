/**
 * Converts a date string to a Unix timestamp.
 * @param {string} dateStr - The date string to convert.
 * @returns {number} The Unix timestamp in seconds.
 */
function toTimestamp(dateStr) {
  const dateObj = new Date(dateStr);

  dateObj.setTime(dateObj.getTime() + 8 * 60 * 60 * 1000);

  const timestamp = dateObj.getTime();

  return timestamp / 1000;
}

/**
 * Converts a date object to a Unix timestamp.
 * @param {Date} date - The date object to convert.
 * @returns {number} The Unix timestamp in seconds.
 */
function toTimestampFromDate(date) {
  const dateObj = date;

  dateObj.setTime(dateObj.getTime() + 8 * 60 * 60 * 1000);

  const timestamp = dateObj.getTime();

  return timestamp / 1000;
}

/**
 * Converts a timestamp to a Date object.
 * @param {number} timestamp - The timestamp to convert.
 * @returns {Date} The Date object representing the timestamp.
 */
function toDatee(timestamp) {
  const dateObj = new Date(timestamp);
  return dateObj;
}
/**
 * Generates a random password with the specified length.
 * The password will contain at least one lowercase letter, one uppercase letter,
 * one number, and one special character.
 *
 * @param {number} length - The length of the password to generate.
 * @returns {string} The generated password.
 */
function generate(length) {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*_+|?/~";

  let password = "";

  // Ensure at least one character from each category
  password += lowercaseChars.charAt(
    Math.floor(Math.random() * lowercaseChars.length)
  );
  password += uppercaseChars.charAt(
    Math.floor(Math.random() * uppercaseChars.length)
  );
  password += numberChars.charAt(
    Math.floor(Math.random() * numberChars.length)
  );
  password += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );

  const remainingLength = length - 4;
  const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars;
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars.charAt(randomIndex);
  }

  // Shuffle the password to mix up the characters
  password = shuffleString(password);

  return password;
}

// Function to shuffle a string (Fisher-Yates algorithm)
function shuffleString(str) {
  const array = str.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

module.exports = {
  toTimestamp,
  toDatee,
  generate,
  toTimestampFromDate,
};
