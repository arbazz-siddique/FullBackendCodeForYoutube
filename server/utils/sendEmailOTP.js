import nodemailer from "nodemailer";

// Optional: Log to confirm environment variables are loaded



const sendEmailOTP = async(email, otp)=>{
  const transporter= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    
    auth:{
        user:process.env.SMTP_MAIL,
        pass:process.env.SMTP_PASSWORD,
    },
});
console.log("SMTP_MAIL:", process.env.SMTP_MAIL);
console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "Exists ✅" : "Missing ❌");
console.log("Trying to connect to SMTP:", process.env.SMTP_HOST, process.env.SMTP_PORT);
console.log("SMTP_HOST is", process.env.SMTP_HOST);
const mailOptions= {
  from: `"YouTube Clone OTP" <${process.env.SMTP_MAIL}>`,
  to: email,
  subject: "Your OTP Code",
  text: `Your OTP is: ${otp}`,

}
await transporter.sendMail(mailOptions)
}
export default sendEmailOTP;
