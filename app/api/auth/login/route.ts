import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { verifyRecaptcha } from '../../../../lib/recaptcha';

export async function POST(req: NextRequest) {
  const { email, password, recaptchaToken } = await req.json();

  const { success } = await verifyRecaptcha(recaptchaToken, 'login');
  if (!success) {
    return NextResponse.json(
      { error: 'Security check failed. Please refresh and try again.' },
      { status: 403 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ user: data.user, session: data.session });
}
