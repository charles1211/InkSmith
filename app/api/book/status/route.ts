import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

type Status = 'pending' | 'confirmed' | 'completed' | 'cancelled';

const STATUS_META: Record<Status, { subject: string; banner: string; bannerColor: string; headline: string; body: string }> = {
  pending: {
    subject: 'Booking Under Review — InkSmith Studios',
    banner: 'Booking Under Review',
    bannerColor: '#d97706',
    headline: 'We\'re reviewing your request',
    body: 'Your booking request is currently being reviewed by our team. We\'ll reach out within <strong style="color:#d4af37;">24–48 hours</strong> to confirm your appointment.',
  },
  confirmed: {
    subject: 'Your Booking is Confirmed — InkSmith Studios',
    banner: 'Booking Confirmed',
    bannerColor: '#2563eb',
    headline: 'You\'re all set!',
    body: 'Great news — your booking has been <strong style="color:#d4af37;">confirmed</strong>! Please review your appointment details below. Arrive on time and follow our preparation guide to ensure the best experience.',
  },
  completed: {
    subject: 'Session Complete — InkSmith Studios',
    banner: 'Session Completed',
    bannerColor: '#16a34a',
    headline: 'Thank you for your visit!',
    body: 'Your session at InkSmith Studios is now marked as complete. We hope you love your new ink! Remember to follow the <strong style="color:#d4af37;">aftercare instructions</strong> and don\'t hesitate to reach out if you have any questions.',
  },
  cancelled: {
    subject: 'Booking Cancelled — InkSmith Studios',
    banner: 'Booking Cancelled',
    bannerColor: '#dc2626',
    headline: 'Your booking has been cancelled',
    body: 'Unfortunately, your booking has been cancelled. If you believe this is a mistake or would like to reschedule, please don\'t hesitate to <strong style="color:#d4af37;">book a new session</strong> or contact us directly.',
  },
};

function row(label: string, value: string) {
  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;white-space:nowrap;">
      <span style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.15em;">${label}</span>
    </td>
    <td style="padding:10px 0 10px 16px;border-bottom:1px solid #1a1a1a;text-align:right;">
      <span style="font-size:13px;color:#e0e0e0;">${value}</span>
    </td>
  </tr>`;
}

function buildStatusEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  services: string[];
  artistName: string | null;
  preferredDate: string | null;
  status: Status;
}) {
  const meta = STATUS_META[data.status];
  const serviceList = data.services.join(', ');
  const dateStr = data.preferredDate
    ? new Date(data.preferredDate).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.subject}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#111111;border:1px solid #222;padding:40px 40px 32px;text-align:center;">
              <div style="width:48px;height:2px;background:#d4af37;margin:0 auto 20px;"></div>
              <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:0.08em;text-transform:uppercase;">
                Ink<span style="color:#d4af37;">Smith</span>
              </h1>
              <p style="margin:6px 0 0;font-size:10px;color:#666;letter-spacing:0.3em;text-transform:uppercase;">Studios</p>
              <div style="width:48px;height:2px;background:#d4af37;margin:20px auto 0;"></div>
            </td>
          </tr>

          <!-- Status banner -->
          <tr>
            <td style="background:${meta.bannerColor};padding:14px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;font-weight:900;color:#fff;letter-spacing:0.3em;text-transform:uppercase;">
                ${meta.banner}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#111111;border:1px solid #222;border-top:none;padding:40px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;">
                Hey ${data.firstName},
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#999;line-height:1.7;">
                ${meta.body}
              </p>

              <div style="border-top:1px solid #222;margin:28px 0;"></div>

              <p style="margin:0 0 20px;font-size:10px;font-weight:900;color:#d4af37;letter-spacing:0.3em;text-transform:uppercase;">
                Booking Summary
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                ${row('Client', `${data.firstName} ${data.lastName}`)}
                ${row('Email', data.email)}
                ${row('Service(s)', serviceList)}
                ${data.artistName ? row('Artist', data.artistName) : ''}
                ${dateStr ? row('Appointment', dateStr) : ''}
                ${row('Status', meta.banner)}
              </table>

              <div style="border-top:1px solid #222;margin:28px 0;"></div>

              <!-- CTA -->
              <div style="text-align:center;margin-top:32px;">
                <a href="https://ink-smith.vercel.app/my-bookings" style="display:inline-block;background:#d4af37;color:#000;font-size:11px;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;text-decoration:none;padding:14px 32px;margin-bottom:12px;">
                  View My Bookings
                </a>
                <br />
                <a href="https://ink-smith.vercel.app/" style="display:inline-block;margin-top:12px;background:transparent;color:#d4af37;font-size:11px;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border:1px solid #d4af37;">
                  Visit Our Website
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;color:#444;letter-spacing:0.15em;text-transform:uppercase;">
                InkSmith Studios · Bahrain
              </p>
              <p style="margin:0;font-size:11px;color:#333;">
                If you did not make this request, please ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json() as { id: string; status: Status };

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  // 1. Update the status in DB
  const { error: dbError } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // 2. Fetch the booking record to build the email
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('first_name, last_name, email, services, artist_id, preferred_date, artists(name)')
    .eq('id', id)
    .single();

  if (!fetchError && booking) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const artistName = (booking.artists as any)?.name ?? null;
      await transporter.sendMail({
        from: `"InkSmith Studios" <${process.env.GMAIL_USER}>`,
        to: booking.email,
        subject: STATUS_META[status].subject,
        html: buildStatusEmail({
          firstName: booking.first_name,
          lastName: booking.last_name,
          email: booking.email,
          services: booking.services ?? [],
          artistName,
          preferredDate: booking.preferred_date ?? null,
          status,
        }),
      });
    } catch (emailErr) {
      // Email failure should not block the status update
      console.error('Status email send failed:', emailErr);
    }
  }

  return NextResponse.json({ success: true });
}
