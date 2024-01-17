const crypto = require('crypto');

const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
      if (err) reject(err);
      else resolve(hashedPassword.toString('hex'));
    });
  });
};

const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Using crypto to generate an order number 
const generateOrderNumber = () => {
    return crypto.randomBytes(4).toString('hex');
}

module.exports = {
  hashPassword,
  generateSalt,
  generateOrderNumber
};