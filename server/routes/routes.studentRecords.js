const express = require('express');
const router = express.Router();
const cors = require('cors')
const app = express();
const Credentials = require('../models/Credentials');


app.use(cors());



router.get('/:admissionNumber', async (req, res) => {
  res.json({ message: 'This route is accessible.' });



  try {
    const { admissionNumber } = req.params;

    
    const credentials = await Credentials.findOne({ admissionNumber }).populate('studentRecord');

    if (!credentials || !credentials.StudentModel) {
      return res.status(404).json({ message: 'Student data is not available.' });
    }

    res.json({ student: credentials.StudentModel});
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Failed to load student data.' });
  }
});

module.exports = router;
