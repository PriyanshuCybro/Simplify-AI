import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

const sendEmail = async (options) => {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: options.email,
      from: {
        email: process.env.FROM_EMAIL || process.env.EMAIL_USER || process.env.EMAIL,
        name: 'AI Learning Assistant'
      },
      replyTo: process.env.FROM_EMAIL || process.env.EMAIL_USER || process.env.EMAIL,
      subject: options.subject,
      text: options.message,
      html: options.html,
      trackingSettings: {
        clickTracking: { enable: false },
        openTracking: { enable: false }
      }
    };
    
    try {
      const response = await sgMail.send(msg);
      console.log('✅ SendGrid email sent successfully:', response[0].statusCode);
      console.log('✅ Email sent to:', options.email);
    } catch (error) {
      console.error('❌ SendGrid Error:', error.response?.body || error.message);
      throw error;
    }
    return;
  }

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