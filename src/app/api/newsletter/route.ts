// ============================================================
// app/api/newsletter/route.ts — POST /api/newsletter
// Handles newsletter subscription form submissions
// ============================================================
import { isValidEmail } from '@/utilities/validators';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // TODO: connect to Mailchimp / Klaviyo / Resend here
    console.log('[Newsletter] New subscriber:', email);

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
