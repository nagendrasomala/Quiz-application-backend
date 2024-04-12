const express = require('express');
const quiz = express.Router();
const Quiz = require('../model/question'); 
const moment = require('moment');
const cors = require('cors');
const question = require('../model/question');
const mongoose = require('mongoose');
var fs = require("fs");

const ExcelJS = require('exceljs');

quiz.use(cors());

quiz.post('/create', async (req, res) => {
  try {
    
    console.log(req.body);
    const newQuiz = new Quiz({
      faculty: req.body.facultyId, 
      quizName: req.body.quizName,
      quizCode: req.body.quizCode,
      description: req.body.quizDescription,
      questionsCount: req.body.numberOfQuestions,
      duration: req.body.time,
      date: req.body.date,
      questions: [],
      studentsId:[],
    });

    const savedQuiz = await newQuiz.save();

    res.json(savedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// quiz.get('/:id', async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       const quiz = await Quiz.findById(id);
  
//       if (!quiz) {
//         return res.status(404).json({ message: 'Quiz not found' });
//       }
  
//       res.status(200).json(quiz);
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

quiz.get('/gets/:quizCode/:userId', async (req, res) => {
  try {
    const { quizCode, userId } = req.params; // Extract quizCode and userId
    // Find the quiz by quiz code
    const quiz = await Quiz.findOne({ quizCode });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if userId is present in the studentsId array
    const isParticipant = quiz.studentsId.includes(userId);
    console.log(userId);
    console.log(isParticipant);
    // Respond with the result
    res.status(200).json({ isParticipant });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



quiz.get('/tabswitch/:quizCode/:userId', async (req, res) => {
  const { quizCode, userId } = req.params;

  try {
    // Query the database to find the quiz based on the quizCode
    const quiz = await Quiz.findOne({ quizCode: quizCode });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Find the participant with the specified userId in the participants array
    const participant = quiz.participants.find(participant => participant.student.toString() === userId);

    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found for the user' });
    }

    // Send the tabswitch value of the participant
    res.json({ success: true, tabSwitchCount: participant.tabswitch });
  } catch (error) {
    console.error('Error retrieving tab switch count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




quiz.put('/tab-switch-count/:quizCode/:userId', async (req, res) => {
  const { quizCode, userId } = req.params;
  const { tabSwitchCount } = req.body;

  try {
    // Find the quiz based on the quizCode
    const quiz = await Quiz.findOne({ quizCode: quizCode });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found for the user' });
    }

    // Find the participant with the specified userId in the participants array
    const participantIndex = quiz.participants.findIndex(participant => participant.student.toString() === userId);

    if (participantIndex === -1) {
      return res.status(404).json({ success: false, message: 'Participant not found for the user' });
    }

    // Update the tabswitch value of the participant
    quiz.participants[participantIndex].tabswitch = tabSwitchCount;
    await quiz.save();

    res.json({ success: true, message: 'Tab switch count updated successfully' });
  } catch (error) {
    console.error('Error updating tab switch count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});






//   quiz.get('/all/:userId', async (req, res) => {
//     try {
//         const userId = req.params.userId;

//         // Find all quizzes
//         const quizzes = await Quiz.find();

//         // Array to store quizzes where the user participated
//         const userQuizzes = [];

//         // Iterate through each quiz
//         quizzes.forEach(quiz => {
//             // Check if the user participated in the current quiz
//             const participantIndex = quiz.participants.findIndex(participant => participant.student.toString() === userId);
//             if (participantIndex !== -1) {
//                 // If the user participated, extract necessary information and push to userQuizzes array
//                 const userQuiz = {
//                     quizName: quiz.quizName,
//                     marks: quiz.participants[participantIndex].marks
//                 };
//                 userQuizzes.push(userQuiz);
//             }
//         });

//         console.log('User Quizzes:', userQuizzes); // Log userQuizzes array for debugging

//         res.json(userQuizzes); // Send the quizzes where the user participated to the frontend
//     } catch (error) {
//         console.error('Error fetching quiz data:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

quiz.get('/sall/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all quizzes
    const quizzes = await Quiz.find();

    // Array to store quizzes where the user participated
    const userQuizzes = [];

    // Iterate through each quiz
    quizzes.forEach(quiz => {
      // Check if quiz.participants is not undefined
      if (quiz.participants) {
        // Check if the user participated in the current quiz
        const participantIndex = quiz.participants.findIndex(participant => participant.student && participant.student.toString() === userId);
        if (participantIndex !== -1) {
          // If the user participated, extract necessary information and push to userQuizzes array
          const userQuiz = {
            quizName: quiz.quizName,
            description: quiz.description,
            date: quiz.date,
            marks: quiz.participants[participantIndex].marks
          };
          userQuizzes.push(userQuiz);
        }
      }
    });

    res.json(userQuizzes); // Send the quizzes where the user participated to the frontend
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  


  quiz.get('/quizstart/:code', async (req, res) => {
    const { code } = req.params;
  
    try {
      const quiz = await Quiz.findOne({ quizCode: code });
  
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
      res.status(200).json(quiz);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});



  quiz.post('/add/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text, options, correctAnswer } = req.body;

        // Find the quiz document by ID
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Add the new question to the questions array
        quiz.questions.push({ text, options, correctAnswer });
        
        // Save the updated quiz document
        await quiz.save();

        res.status(201).json(quiz); // Return the updated quiz document
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


quiz.get('/fall/:facultyId', async (req, res) => {
    const { facultyId } = req.params;

    try {
        // Find all quizzes with the specified faculty ID
        const quizzes = await Quiz.find({ faculty: facultyId });

        res.status(200).json(quizzes);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});








quiz.post('/submit-quiz/:code', async (req, res) => {
  const { code } = req.params;
  const { student, name, startTime, endTime, marks, score, tabswitch } = req.body;

  try {
    const quiz = await Quiz.findOne({ quizCode: code });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Push student ID into studentsId array
    if (!quiz.studentsId.includes(student.toString())) {
      quiz.studentsId.push(student.toString());
    }
    else{
      return res.status(500).json({ error: 'Quiz Already submitted!!!!' });
    }

    // Update participant's details in the participants array
    const participantIndex = quiz.participants.findIndex(participant => participant.student === student);
    if (participantIndex !== -1) {
      quiz.participants[participantIndex].startTime = startTime;
      quiz.participants[participantIndex].endTime = endTime;
      quiz.participants[participantIndex].marks = marks;
      quiz.participants[participantIndex].score = score;
      
    }

    await quiz.save();

    return res.status(200).json({ message: 'Quiz submitted successfully' });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});




quiz.post('/pcreate/:code', async (req, res) => {
  const { code } = req.params;
  const { student, name, tabswitch } = req.body; 
   

  try {
      const quiz = await Quiz.findOne({ quizCode: code });

      if (!quiz) {
          return res.status(404).json({ message: 'Quiz not found' });
      }

      // Check if student ID already exists in the studentsId array
      if (quiz.studentsId.includes(student.toString())) {
          return res.status(400).json({ error: 'Student ID already exists' });
      }

      const participantIndex = quiz.participants.findIndex(participant => participant.student === student);

      if (participantIndex === -1) {
          quiz.participants.push({ student, name, startTime:'', endTime:'', marks:'', score:'',tabswitch });
      } else {
          quiz.participants[participantIndex] = { student, name, startTime:'', endTime:'', marks:'', score:'',tabswitch };
      }
    

    await quiz.save();

    return res.status(200).json({ message: 'Participant created successfully' });
  } catch (error) {
    console.error('Error creating participant:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



quiz.get('/participants/:quizId', async (req, res) => {
  try {
    const quizId = req.params.quizId;

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if participants list exists for the quiz
    if (!quiz.participants || quiz.participants.length === 0) {
      return res.status(404).json({ message: 'No participants found for this quiz' });
    }

    // Sort participants in descending order by their marks
    quiz.participants.sort((a, b) => b.marks - a.marks);

    // Send the participants list to the frontend
    res.json(quiz.participants);
  } catch (error) {
    console.error('Error fetching participants list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


const XLSX = require('xlsx');

quiz.post('/generateExcel', async (req, res) => {
  try {
    // Extract quizData from the request body
    const { quizData } = req.body;

    // Validate the format of quizData
    if (!Array.isArray(quizData) || quizData.length === 0) {
      throw new Error('Invalid quiz data format or empty data array');
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert quizData to worksheet
    const worksheetData = quizData.map(data => ({
      'Student Name': data.name,
      'Marks': data.marks,
      'Score': data.score,
      'Tab Switch': Math.abs(data.tabswitch - 2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Add worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'QuizData');

    // Write workbook to a buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment;filename=quizdata.xlsx');

    // Send the Excel file as the response
    res.end(excelBuffer);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = quiz;
