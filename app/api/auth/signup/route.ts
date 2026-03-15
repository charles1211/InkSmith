import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { verifyRecaptcha } from '../../../../lib/recaptcha';

export async function POST(req: NextRequest) {
  const { name, email, password, recaptchaToken } = await req.json();

  const { success } = await verifyRecaptcha(recaptchaToken, 'signup');
  if (!success) {
    return NextResponse.json(
      { error: 'Security check failed. Please refresh and try again.' },
      { status: 403 }
    );
  }

  const supabase = await createClient();
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 });
  }

  return NextResponse.json({ user: data.user });
}
