const Notification = require('../models/Notification');
const { sendSuccess } = require('../utils/responseHandler');
const { httpError } = require('../utils/controllerHelpers');

async function list(req, res) {
  const notifications = await Notification.find({ recipient: req.user.sub })
    .sort({ createdAt: -1 })
    .limit(100);
  return sendSuccess(res, { data: notifications });
}

async function markRead(req, res) {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user.sub },
    { $set: { isRead: true, readAt: new Date() } },
    { new: true }
  );
  if (!notification) throw httpError(404, 'Notification not found.');
  return sendSuccess(res, { message: 'Notification marked as read.', data: notification });
}

async function markAllRead(req, res) {
  const result = await Notification.updateMany(
    { recipient: req.user.sub, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
  return sendSuccess(res, { message: 'Notifications marked as read.', data: { modifiedCount: result.modifiedCount } });
}

module.exports = { list, markAllRead, markRead };