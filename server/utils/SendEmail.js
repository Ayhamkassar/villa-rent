const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    
    if (!smtpUser || !smtpPass) {
      console.warn('SMTP credentials are not set. Email functionality will be disabled.');
      console.warn('Please set SMTP_USER and SMTP_PASS in your environment variables.');
      return null;
    }
    
    // Create SMTP transporter for Gmail
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    });
    
    // Verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP connection error:', error.message);
      } else {
        console.log('SMTP server is ready to send emails');
      }
    });
  }
  return transporter;
};

/**
 * Send email using SMTP
 * @param {Object} options - Email options
 * @param {string|string[]} options.to - Recipient email address(es)
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} - Nodemailer send result
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transporterInstance = getTransporter();
  
  if (!transporterInstance) {
    console.error('Cannot send email: SMTP is not configured');
    throw new Error('Email service is not configured. Please set SMTP_USER and SMTP_PASS in your environment variables.');
  }

  const fromEmail = process.env.SMTP_USER || 'kassaraeham067@gmail.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'Villa Rent';

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
  };

  try {
    const info = await transporterInstance.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

/**
 * Send booking confirmation email
 * @param {Object} options - Booking details
 */
const sendBookingConfirmation = async ({ to, userName, villaName, fromDate, toDate, totalPrice }) => {
  const subject = `تأكيد الحجز - ${villaName}`;
  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0077b6;">✅ تم استلام طلب الحجز</h2>
      <p>مرحباً ${userName}،</p>
      <p>تم استلام طلب حجزك بنجاح. إليك تفاصيل الحجز:</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>🏡 الفيلا:</strong> ${villaName}</p>
        <p><strong>📅 من:</strong> ${new Date(fromDate).toLocaleDateString('ar-SA')}</p>
        <p><strong>📅 إلى:</strong> ${new Date(toDate).toLocaleDateString('ar-SA')}</p>
        <p><strong>💰 السعر الإجمالي:</strong> ${totalPrice} $</p>
      </div>
      <p>سيتم التواصل معك قريباً لتأكيد الحجز.</p>
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">هذا البريد مرسل تلقائياً من نظام حجز الفلل.</p>
    </div>
  `;
  
  return sendEmail({ to, subject, html });
};

/**
 * Send booking status update email
 * @param {Object} options - Status update details
 */
const sendBookingStatusUpdate = async ({ to, userName, villaName, status, fromDate, toDate }) => {
  const statusMessages = {
    confirmed: { text: 'تم تأكيد', emoji: '✅', color: '#28a745' },
    cancelled: { text: 'تم إلغاء', emoji: '❌', color: '#dc3545' },
    pending: { text: 'قيد الانتظار', emoji: '⏳', color: '#ffc107' }
  };
  
  const statusInfo = statusMessages[status] || statusMessages.pending;
  const subject = `${statusInfo.emoji} ${statusInfo.text} حجزك - ${villaName}`;
  
  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${statusInfo.color};">${statusInfo.emoji} ${statusInfo.text} حجزك</h2>
      <p>مرحباً ${userName}،</p>
      <p>تم تحديث حالة حجزك:</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>🏡 الفيلا:</strong> ${villaName}</p>
        <p><strong>📅 من:</strong> ${new Date(fromDate).toLocaleDateString('ar-SA')}</p>
        <p><strong>📅 إلى:</strong> ${new Date(toDate).toLocaleDateString('ar-SA')}</p>
        <p><strong>📌 الحالة:</strong> <span style="color: ${statusInfo.color}; font-weight: bold;">${statusInfo.text}</span></p>
      </div>
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">هذا البريد مرسل تلقائياً من نظام حجز الفلل.</p>
    </div>
  `;
  
  return sendEmail({ to, subject, html });
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendBookingStatusUpdate
};
