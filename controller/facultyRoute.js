const express = require('express');
const faculty = express.Router();
const User = require('../model/faculty');
const moment = require('moment');
const cors = require('cors');
faculty.use(cors());

faculty.post('/fregister', async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      
    });

    const savedUser = await newUser.save();

    res.json({ name: savedUser.name, email: savedUser.email, password: savedUser.password });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

faculty.post('/flogin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (user) {
      res.json({ success: true, id: user._id });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// userRoute.get('/get/:userId', async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     const user = await User.findById(userId);

//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });





// userRoute.post('/updateScore/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const { score, marks } = req.body; 
//     // Check if userId is defined
//     if (!userId){
//       return res.status(400).json({ error: 'Invalid userId' });
//     }

//     // You can add score and marks to the update
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: { score, marks } },
//       { new: true } 
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json({ success: true, updatedUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error', message: error.message });
//   }
// });


// userRoute.get('/getall', async (req, res) => {
//   try {
//     // Find all users and sort them in descending order based on the 'marks' key
//     const users = await User.find().sort({ score: -1 });
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });





// userRoute.get('/st/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ error: 'Invalid userId' });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json({ startTime: user.startTime });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error', message: error.message });
//   }
// });


// userRoute.post("/quiz/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Check if userId is defined
//     if (!userId) {
//       return res.status(400).json({ error: 'Invalid userId' });
//     }

//     const startTime = moment().format('HH:mm:ss');
//     await User.updateOne({ _id: userId }, { $set: { startTime } });

//     res.json({ success: true, startTime });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error", message: error.message });
//   }
// });


// userRoute.post('/et/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Validate userId
//     if (!userId) {
//       return res.status(400).json({ error: 'Invalid userId' });
//     }

//     // Update the user's end time
//     const endTime = moment().format('HH:mm:ss');
//     await User.updateOne({ _id: userId }, { $set: { endTime } });

//     res.json({ success: true, endTime });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error', message: error.message });
//   }
// });


module.exports = faculty;
