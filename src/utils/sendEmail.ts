// src/utils/sendEmail.ts
import nodemailer from "nodemailer";

export default async function sendEmail({ to, subject, text }: { to: string, subject: string, text: string }) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
    from: `"Timer App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
    console.log(`Email sent to ${to} with subject "${subject}"`);
}

