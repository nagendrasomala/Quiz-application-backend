// quiz.js - Schema for quizzes
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  faculty: {
    type: String,
  },
  quizCode: {
    type: String,
    unique: true
  },
  description:{
    type: String,
    unique: true
  },
  quizName: {
    type: String,
  },
  questionsCount:{
    type: Number,

  },
  duration: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now()
  },
  
  studentsId:[

],
  questions: [{
    text: {
      type: String,
    },
    options: [{
      type: String,
    }],
    correctAnswer: {
      type: String,
    }
  }],
  participants: [{
    student: {
        type: String,
      },
    name: {
      type: String,
    },
    tabswitch:{
      type:Number,
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
  }],
  
  // Other fields as needed
});

module.exports = mongoose.model('Quiz', quizSchema);
