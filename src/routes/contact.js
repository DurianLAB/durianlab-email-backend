const express = require('express');
const { sendContactEmail } = require('../controllers/emailController');
const { validateContact } = require('../middleware/validation');

const router = express.Router();

// POST /api/contact
router.post('/contact', validateContact, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await sendContactEmail({ name, email, message });
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

module.exports = router;