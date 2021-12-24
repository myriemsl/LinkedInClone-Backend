const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "user"
},
  text: {
    type: String,
    required: true
  },
  name: String,
  avatar: String,

  likes: [
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
      }
    }
  ],
  comments: [
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
      },
      text: {
        type: String,
        required: true
      },
      name: String,
      avatar: String,
      created_at : {
        type: Date,
        default: Date.now
      }
    }
  ],
  created_at : {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('post', PostSchema);