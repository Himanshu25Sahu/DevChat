import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

export const sendMail = async (ReciverMail) => {
  try {
    const verificationCode = generateVerificationCode();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'devchatapplication@gmail.com' || process.env.TEAM_EMAIL,
          pass: 'lrlp wbvm lhlx rmxc' || process.env.PASSWORD
      }
    });

    await transporter.sendMail({
      from: '"🌐 DevChat Support Team 📬" <devchatapplication@gmail.com>',
    //   to: "basavesh484@gmail.com",
      to: ReciverMail,
      subject: "Your Verification Code", 
      text: `Your verification code is: ${verificationCode}`,
      html: `<b>Your verification code is: ${verificationCode}</b>`
    });
    console.log("Verification code sent successfully:", verificationCode);
    return verificationCode;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};