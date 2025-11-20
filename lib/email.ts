"use server";

import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: parseInt(process.env.NODEMAILER_PORT!),
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_MAILER,
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error: unknown) {
    return false;
  }
}
