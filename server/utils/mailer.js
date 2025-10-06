import nodemailer from 'nodemailer';

export async function sendEmail(data) {
  // Create transporter object with SMTP server
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT), 
    secure: true, 
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_EMAIL_PASSWORD,
    },
  });

  // Define the mail options
  let mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: data.toEmail,
    subject: data.subject,
    text: data.text,
    html: data.html ? data.html : '', // html is a string, not an object
  };

  // Send email and handle errors
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Email send failed:', err);
    return false;
  }
}
