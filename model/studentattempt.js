// studentAttempt.js - Schema for student attempts
const mongoose = require('mongoose');

const studentAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentID: {
    type: String,
    required: true
  },
  marks: {
    type: Number
  },
  score: {
    type: Number
  },
  startTime: {
    type: String
  }, 
  endTime: {
    type: String
  },  
  answers: [{
    // Define your answer schema here
    // For example:
    questionIndex: {
      type: Number,
      required: true
    },
    selectedOptionIndex: {
      type: Number,
      required: true
    }
  }],
  // Other fields as needed
});

module.exports = mongoose.model('StudentAttempt', studentAttemptSchema);
