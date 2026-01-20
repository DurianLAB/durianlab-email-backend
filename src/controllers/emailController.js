const nodemailer = require('nodemailer');

const sendContactEmail = async ({ name, email, message }) => {
  // Configure email transporter for Zoho Mail
  const transporter = nodemailer.createTransporter({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'admin@durianlab.tech', // or process.env.ADMIN_EMAIL
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail };