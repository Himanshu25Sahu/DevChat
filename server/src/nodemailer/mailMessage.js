import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
export const sendMessage = async (ReceiverMail, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'devchatapplication@gmail.com' || process.env.TEAM_EMAIL,
        pass: 'lrlp wbvm lhlx rmxc' || process.env.PASSWORD
      }
    });

    const fullMessage = `
      Hello from DevChat Support Team! 👋

      We hope you're having a great day!

      Here’s the message you requested:

      "${message}"

      If you have any questions or need further assistance, feel free to reach out to us.

      Best regards,
      The DevChat Support Team
      🌐📬
    `;
    await transporter.sendMail({
      from: '"🌐 DevChat Support Team 📬" <devchatapplication@gmail.com>',
      to: ReceiverMail,
      subject: "Message from DevChat Support", 
      text: fullMessage, 
      html: `<p>Hello from DevChat Support Team! 👋</p>
             <p>We hope you're having a great day!</p>
             <p>Here’s the message you requested:</p>
             <p><em>"${message}"</em></p>
             <p>If you have any questions or need further assistance, feel free to reach out to us.</p>
             <p>Best regards,</p>
             <p>The DevChat Support Team 🌐📬</p>`, 
    });

    console.log("Message sent successfully:", message);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send message");
  }
};