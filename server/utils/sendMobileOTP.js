import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE) {
  console.error("❌ Missing Twilio credentials in environment variables.");
}

const sendMobileOTP = async (phone, otp) => {
  console.log("sendMobileOTP called with:", phone, otp);
  const phoneRegex = /^\+\d{10,15}$/;

  if (!phone || !phoneRegex.test(phone)) {
    throw new Error('Invalid phone number format. Must start with "+" followed by country code and digits.');
  }

  await client.messages.create({
    body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
};

export default sendMobileOTP;
