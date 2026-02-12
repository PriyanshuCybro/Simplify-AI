import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Ya jo bhi aap use karein
    auth: {
      user: process.env.EMAIL_USER, // Aapka email
      pass: process.env.EMAIL_PASS, // Aapka App Password
    },
  });

  const mailOptions = {
    from: `"AI Learning Assistant" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;