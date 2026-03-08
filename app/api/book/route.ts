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

function buildEmailHtml(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  services: string[];
  tattooStyle?: string;
  tattooStyleOther?: string;
  piercingPlacement?: string;
  piercingPlacementOther?: string;
  artistName: string;
  description?: string;
  preferredDate?: string;
  referenceUrl?: string | null;
}) {
  const serviceList = data.services.join(', ');
  const style = data.tattooStyle === 'Others' ? data.tattooStyleOther : data.tattooStyle;
  const placement = data.piercingPlacement === 'Others' ? data.piercingPlacementOther : data.piercingPlacement;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation — InkSmith Studios</title>
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
            <td style="background:#d4af37;padding:14px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;font-weight:900;color:#000;letter-spacing:0.3em;text-transform:uppercase;">
                Booking Request Received
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
                Thank you for reaching out to InkSmith Studios. We've received your booking request and our team will review it shortly. You can expect a confirmation call or message within <strong style="color:#d4af37;">24–48 hours</strong>.
              </p>

              <!-- Divider -->
              <div style="border-top:1px solid #222;margin:28px 0;"></div>

              <!-- Summary heading -->
              <p style="margin:0 0 20px;font-size:10px;font-weight:900;color:#d4af37;letter-spacing:0.3em;text-transform:uppercase;">
                Your Booking Summary
              </p>

              <!-- Details table -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${row('Full Name', `${data.firstName} ${data.lastName}`)}
                ${row('Email', data.email)}
                ${row('Phone', data.phone)}
                ${row('Service(s)', serviceList)}
                ${data.services.includes('Tattoo') && style ? row('Tattoo Style', style) : ''}
                ${placement ? row('Piercing Placement', placement) : ''}
                ${data.artistName ? row('Preferred Artist', data.artistName) : ''}
                ${data.preferredDate ? row('Preferred Date', data.preferredDate) : ''}
                ${data.description ? row('Description', data.description) : ''}
                ${data.referenceUrl ? `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;">
                    <span style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.15em;">Reference Image</span>
                  </td>
                  <td style="padding:10px 0 10px 16px;border-bottom:1px solid #1a1a1a;text-align:right;">
                    <a href="${data.referenceUrl}" style="color:#d4af37;font-size:13px;text-decoration:none;">View Image</a>
                  </td>
                </tr>` : ''}
              </table>

              <!-- Divider -->
              <div style="border-top:1px solid #222;margin:28px 0;"></div>

              <p style="margin:0 0 8px;font-size:13px;color:#777;line-height:1.7;">
                Please note this is a <strong style="color:#fff;">request</strong>, not a confirmed booking. A member of our team will contact you to finalise your appointment, discuss pricing, and answer any questions.
              </p>

              <!-- CTA -->
              <div style="text-align:center;margin-top:32px;display:flex;flex-direction:column;gap:12px;align-items:center;">
                <a href="https://ink-smith.vercel.app/" style="display:inline-block;background:#d4af37;color:#000;font-size:11px;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;text-decoration:none;padding:14px 32px;">
                  Visit Our Website
                </a>
                <a href="https://www.instagram.com/inksmithtattoobda" style="display:inline-block;background:transparent;color:#d4af37;font-size:11px;font-weight:900;letter-spacing:0.25em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border:1px solid #d4af37;">
                  Follow Us on Instagram
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

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    firstName, lastName, email, phone, ageVerification,
    services, tattooStyle, tattooStyleOther, piercingPlacement,
    piercingPlacementOther, artistId, artistName, description,
    preferredDate, referenceUrl,
  } = body;

  // ── Save to Supabase (using service role to bypass RLS) ──────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const { error: dbError } = await supabase.from('bookings').insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    age_verification: ageVerification,
    services,
    tattoo_style: tattooStyle || null,
    tattoo_style_other: tattooStyleOther || null,
    piercing_placement: piercingPlacement || null,
    piercing_placement_other: piercingPlacementOther || null,
    artist_id: artistId || null,
    description: description || null,
    preferred_date: preferredDate || null,
    reference_url: referenceUrl || null,
    status: 'pending',
  });

  if (dbError) {
    console.error('DB error:', dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // ── Send confirmation email ───────────────────────────────────────────────
  try {
    await transporter.sendMail({
      from: `"InkSmith Studios" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Booking Request Received — InkSmith Studios',
      html: buildEmailHtml({
        firstName, lastName, email, phone, services,
        tattooStyle, tattooStyleOther, piercingPlacement, piercingPlacementOther,
        artistName, description, preferredDate, referenceUrl,
      }),
    });
  } catch (emailErr) {
    // Email failure should not block the booking from saving
    console.error('Email send failed:', emailErr);
  }

  return NextResponse.json({ success: true });
}
