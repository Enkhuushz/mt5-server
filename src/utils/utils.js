function toTimestamp(dateStr) {
  const dateObj = new Date(dateStr);

  dateObj.setTime(dateObj.getTime() + 8 * 60 * 60 * 1000);

  const timestamp = dateObj.getTime();

  return timestamp / 1000;
}

function toDatee(timestamp) {
  const dateObj = new Date(timestamp);
  return dateObj;
}

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

  // Generate the remaining characters
  const remainingLength = length - 4; // Subtract 4 for the required characters
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
};
