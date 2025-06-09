import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account with that email exists, we've sent you a password reset link.",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // In a real app, you would send an email here
    // For development, we'll log the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    console.log('🔐 Password Reset Link:', resetUrl);
    console.log('📧 Send this to:', email);

    // TODO: Replace with actual email sending
    // Example with nodemailer:
    /*
        import nodemailer from 'nodemailer';
        
        const transporter = nodemailer.createTransporter({
          // your email service config
        });
        
        await transporter.sendMail({
          to: email,
          subject: 'Reset your BoardSource password',
          html: `
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
          `
        });
        */

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, we've sent you a password reset link.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
