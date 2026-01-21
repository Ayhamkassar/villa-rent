const { Resend } = require('resend');

let resend = null;

const getResendClient = () => {
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

/**
 * Send email using Resend API
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const resendClient = getResendClient();

  if (!resendClient) {
    throw new Error('Email service is not configured. RESEND_API_KEY missing.');
  }

  const fromEmail =
    process.env.EMAIL_FROM || 'onboarding@resend.dev';

  try {
    const response = await resendClient.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    console.log('Email sent successfully via Resend:', response.id);
    return { success: true, id: response.id };

  } catch (error) {
    console.error('Resend email error:', error);
    throw error;
  }
};

/**
 * Booking confirmation email
 */
const sendBookingConfirmation = async ({
  to,
  userName,
  villaName,
  fromDate,
  toDate,
  totalPrice,
}) => {
  const subject = `✅ تأكيد الحجز - ${villaName}`;

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0077b6;">✅ تم استلام طلب الحجز</h2>
      <p>مرحباً ${userName}،</p>
      <p>تم استلام طلب حجزك بنجاح. إليك التفاصيل:</p>

      <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:20px 0;">
        <p><strong>🏡 الفيلا:</strong> ${villaName}</p>
        <p><strong>📅 من:</strong> ${new Date(fromDate).toLocaleDateString('ar-SA')}</p>
        <p><strong>📅 إلى:</strong> ${new Date(toDate).toLocaleDateString('ar-SA')}</p>
        <p><strong>💰 السعر الإجمالي:</strong> ${totalPrice} $</p>
      </div>

      <p>سيتم التواصل معك قريباً لتأكيد الحجز.</p>
      <hr>
      <p style="font-size:12px;color:#666;">
        هذا البريد مرسل تلقائياً من نظام حجز الفلل.
      </p>
    </div>
  `;

  return sendEmail({ to, subject, html });
};

/**
 * Booking status update
 */
const sendBookingStatusUpdate = async ({
  to,
  userName,
  villaName,
  status,
  fromDate,
  toDate,
}) => {
  const statuses = {
    confirmed: { text: 'تم تأكيد', emoji: '✅', color: '#28a745' },
    cancelled: { text: 'تم إلغاء', emoji: '❌', color: '#dc3545' },
    pending: { text: 'قيد الانتظار', emoji: '⏳', color: '#ffc107' },
  };

  const s = statuses[status] || statuses.pending;

  const subject = `${s.emoji} ${s.text} حجزك - ${villaName}`;

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2 style="color:${s.color};">${s.emoji} ${s.text} حجزك</h2>
      <p>مرحباً ${userName}،</p>

      <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:20px 0;">
        <p><strong>🏡 الفيلا:</strong> ${villaName}</p>
        <p><strong>📅 من:</strong> ${new Date(fromDate).toLocaleDateString('ar-SA')}</p>
        <p><strong>📅 إلى:</strong> ${new Date(toDate).toLocaleDateString('ar-SA')}</p>
        <p><strong>📌 الحالة:</strong>
          <span style="color:${s.color};font-weight:bold;">
            ${s.text}
          </span>
        </p>
      </div>

      <hr>
      <p style="font-size:12px;color:#666;">
        هذا البريد مرسل تلقائياً من نظام حجز الفلل.
      </p>
    </div>
  `;

  return sendEmail({ to, subject, html });
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendBookingStatusUpdate,
};
