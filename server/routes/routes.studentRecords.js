const express = require('express');
const router = express.Router();
const Credentials = require('../models/Credentials');

// GET student data by admission number
router.get('/:admissionNumber', async (req, res) => {
  try {
    const { admissionNumber } = req.params;

    // Find credentials by admission number and populate the studentRecord field
    const credentials = await Credentials.findOne({ admissionNumber }).populate('studentRecord');

    if (!credentials || !credentials.studentRecord) {
      return res.status(404).json({ message: 'Student data is not available.' });
    }

    res.json({ student: credentials.studentRecord });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Failed to load student data.' });
  }
});

module.exports = router;
