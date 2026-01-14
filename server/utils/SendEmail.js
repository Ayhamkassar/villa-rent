const { Resend } = require('resend');

let resend = null;

// Lazy initialization of Resend - only create instance when needed
const getResend = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.');
      return null;
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const resendInstance = getResend();
  
  if (!resendInstance) {
    console.error('Cannot send email: RESEND_API_KEY is not configured');
    throw new Error('Email service is not configured. Please set RESEND_API_KEY in your environment variables.');
  }

  if (!process.env.EMAIL_FROM) {
    console.error('Cannot send email: EMAIL_FROM is not configured');
    throw new Error('Email service is not configured. Please set EMAIL_FROM in your environment variables.');
  }

  return await resendInstance.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });
};

module.exports = sendEmail;
