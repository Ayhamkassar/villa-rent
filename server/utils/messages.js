const messages = require('../config/messages/ar.json');

const getMessage = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], messages);
};

module.exports = getMessage;
