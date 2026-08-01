const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;
  let testAccount = null;

  // Check if real SMTP credentials exist
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // If no credentials are provided in .env, automatically create a fake test email account
    console.log('⚠️ No SMTP credentials found in .env. Falling back to Ethereal Email for testing...');
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Message object
  const message = {
    from: `${process.env.FROM_NAME || 'AnimVerse AI'} <${process.env.FROM_EMAIL || (testAccount ? testAccount.user : process.env.SMTP_USER)}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  console.log('✅ Message sent: %s', info.messageId);

  // If using ethereal, log the URL to view the email
  if (testAccount) {
    console.log('📧 Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;
