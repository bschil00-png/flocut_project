// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, title, message } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"FloCut 문의" <${process.env.CONTACT_EMAIL}>`,
    to: process.env.CONTACT_EMAIL,
    replyTo: email,
    subject: `[FLOCUT 문의] ${title}`,
    html: `
      <p><b>이름</b>: ${name}</p>
      <p><b>이메일</b>: ${email}</p>
      <p><b>내용</b></p>
      <p>${message}</p>
    `,
  });

  return NextResponse.json({ success: true });
}
