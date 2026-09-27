const mongoose = require('mongoose');

function isValidEmail(value) {
  return typeof value === 'string'
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidObjectId(value) {
  return mongoose.isValidObjectId(value);
}

function getMissingFields(value, requiredFields) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [...requiredFields];
  }

  return requiredFields.filter((field) => {
    const fieldValue = value[field];
    return fieldValue === undefined
      || fieldValue === null
      || (typeof fieldValue === 'string' && fieldValue.trim() === '');
  });
}

module.exports = { getMissingFields, isValidEmail, isValidObjectId };