import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  auth: {
    user: env.mail.user,
    pass: env.mail.pass
  }
});

export const sendMail = async ({ to, subject, html }) => {
  if (!to) {
    throw new Error('Recipient email missing');
  }
  await transporter.sendMail({
    from: env.mail.from,
    to,
    subject,
    html
  });
};

export const registrationTemplate = (name, verificationLink) => `
  <h1>Welcome to Ecotrackify</h1>
  <p>Hi ${name}, thanks for joining our community!</p>
  <p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>
`;

export const resetPasswordTemplate = (name, resetLink) => `
  <p>Hi ${name},</p>
  <p>You requested a password reset. Click <a href="${resetLink}">this link</a> to set a new password.</p>
  <p>If you didn't request this, you can safely ignore the message.</p>
`;
