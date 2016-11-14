const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  Topic:String
});
const Topic = mongoose.model('topic', TopicSchema);
module.exports = Topic;
