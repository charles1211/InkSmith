import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { verifyRecaptcha } from '../../../lib/recaptcha';

export async function POST(req: NextRequest) {
  const { name, email, subject, message, recaptchaToken } = await req.json();

  // Verify captcha first — before any further processing
  const { success } = await verifyRecaptcha(recaptchaToken, 'contact');
  if (!success) {
    return NextResponse.json(
      { error: 'Security check failed. Please refresh and try again.' },
      { status: 403 }
    );
  }

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"InkSmith Studios" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `[Contact] ${subject}`,
    html: `
      <h2>New message from InkSmith contact form</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `,
  });

  return NextResponse.json({ success: true });
}
