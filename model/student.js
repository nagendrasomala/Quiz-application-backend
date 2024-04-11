// student.js - Schema for students
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  username: {
        type: String,
        required: true,
        unique: true
    },
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }
  // Other fields as needed
});


module.exports = mongoose.model('Student', studentSchema);
