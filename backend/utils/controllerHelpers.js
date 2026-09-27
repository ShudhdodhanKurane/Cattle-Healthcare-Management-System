function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function getProfile(Model, userId, label = 'Profile') {
  const profile = await Model.findOne({ user: userId });
  if (!profile) {
    throw httpError(404, `${label} not found. Complete your profile first.`);
  }
  return profile;
}

function pickFields(source, fields) {
  return Object.fromEntries(fields
    .filter((field) => source[field] !== undefined)
    .map((field) => [field, source[field]]));
}

function pagination(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 20, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
}

module.exports = { getProfile, httpError, pagination, pickFields };