const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datetime: { type: Date, default: Date.now },
  content: { type: String, required: true },
  deliveredStatus: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', MessageSchema);
