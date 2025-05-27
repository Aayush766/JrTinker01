const nodeMailer = require("nodemailer");

const sendMail = async (date, time, email,userName,courseName) => {
  console.log("got date and time is: ", date, time, email);

  if (!date || !time) {
    throw new Error("no booking allowed from node mailer");
  }

  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    throw new Error("Missing email credentials in environment variables.");
  }

  try { 
    const transport = nodeMailer.createTransport({
      secure: true,
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

   // Assuming date = "2025-05-01" and time = "14:00"
const startDateTime = `${date}T${time}:00`;
const endDateTime = `${date}T${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:${time.split(':')[1]}:00`;

const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(courseName)}+Slot+Booking&dates=${startDateTime.replace(/[-:]/g, '')}Z/${endDateTime.replace(/[-:]/g, '')}Z&details=${encodeURIComponent(
  `Slot booked with JRtinker.\nName: ${userName}\nEmail: ${email}`
)}&location=Online&sf=true&output=xml`;

const mailOptions = {
  from: process.env.EMAIL,
  to: email,
  subject: "Your Slot Booking Confirmation - JRtinker",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <div style="text-align: center;">
        <img src="https://res.cloudinary.com/priyank-cloud/image/upload/v1745922792/nav-logo_qvb3ym.png" alt="JRtinker Logo" style="max-width: 150px; margin-bottom: 20px; display: block;" />
      </div>
      <h2 style="color: #2c3e50;">Hello ${userName},</h2>
      <p style="font-size: 16px; color: #333;">We're excited to confirm your slot booking. Below are your booking details:</p>

      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #2c3e50;">Name:</td>
          <td style="padding: 10px; color: #333;">${userName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #2c3e50;">Email:</td>
          <td style="padding: 10px; color: #333;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #2c3e50;">Course:</td>
          <td style="padding: 10px; color: #333;">${courseName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #2c3e50;">Date:</td>
          <td style="padding: 10px; color: #333;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #2c3e50;">Time:</td>
          <td style="padding: 10px; color: #333;">${time}</td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${calendarLink}" target="_blank" style="background-color: #3498db; color: #fff; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
          📅 Add to Google Calendar
        </a>
      </div>

      <p style="font-size: 16px; color: #333; margin-top: 30px;">If you have any questions or need to make changes, feel free to contact us.</p>

      <p style="font-size: 14px; color: #999;">Thank you,<br/>JRtinker Team</p>

      <hr style="margin: 30px 0;" />
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        If you did not make this booking, please ignore this email.<br/>
        Contact us at <a href="mailto:contact@jrtinker.com" style="color: #3498db;">contact@jrtinker.com</a>
      </p>
    </div>
  `,
};

    
    

    const info = await transport.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);

    return { success: true, response: info.response };
  } catch (error) {
    console.log("Failed to send mail:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendMail;
