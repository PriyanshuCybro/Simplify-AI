import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER || process.env.EMAIL;
  const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || undefined,
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      family: 4,
    },
    connectionTimeout: 10000,
  });

  const mailOptions = {
    from: `"AI Learning Assistant" <${emailUser}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;