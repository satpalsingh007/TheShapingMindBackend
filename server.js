const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());


app.use(cors({
    origin: 'https://theshapingmind.in' // Allow only your domain to make requests
}));



// require('dotenv').config();
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });



// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to other providers (SendGrid, etc.)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST route to handle form submission
app.post('/send-email', (req, res) => {
  const { firstName, lastName, email, location, comment } = req.body;

  // 1. Send email to the user (confirmation email)
  const userMailOptions = {
    from: 'theshapingmind@gmail.com',  // Your email (or no-reply email)
    to: email,                     // Send to the user's email
    subject: 'Thank you for contacting us!',
    text: `
      Hi ${firstName} ${lastName},
      Thank you for reaching out! We have received your message, and our team will get back to you shortly. Here's what we received:
      - Name: ${firstName} ${lastName}
      - Email: ${email}
      - Location: ${location}
      - Comment: ${comment}

      We appreciate your patience, and we'll respond to your inquiry as soon as possible.

      Best regards,
      The Shaping Mind
    `,
  };

  // 2. Send email to you (the admin) with the user's details
  const adminMailOptions = {
    from: email,  // The user's email address (the sender's email)
    to: 'theshapingmind@gmail.com',  // Your email address (where you receive submissions)
    subject: `New Contact Form Submission from ${firstName} ${lastName}`,
    text: `
      You have a new contact form submission:

      - First Name: ${firstName}
      - Last Name: ${lastName}
      - Email: ${email}
      - Location: ${location}
      - Comment: ${comment}
    `,
  };

  // Send both emails
  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.log('Error sending confirmation email:', error);
      return res.status(500).json({ message: 'Error sending confirmation email.' });
    }

    // Now send the email to admin (you)
    transporter.sendMail(adminMailOptions, (error, info) => {
      if (error) {
        console.log('Error sending admin email:', error);
        return res.status(500).json({ message: 'Error sending admin email.' });
      }

      console.log('Confirmation and admin emails sent:', info.response);
      res.status(200).json({ message: 'Emails sent successfully.' });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
