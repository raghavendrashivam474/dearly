import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!
const FROM = process.env.RESEND_FROM_EMAIL!

// ── Magic link email ──────────────────────────────────────────
export async function sendMagicLink(email: string, token: string) {
  const magicUrl = `${APP_URL}/api/auth/verify?token=${token}`

  // DEBUG — remove after testing
  console.log("=== MAGIC LINK DEBUG ===")
  console.log("APP_URL:", APP_URL)
  console.log("TOKEN:", token)
  console.log("FULL URL:", magicUrl)
  console.log("========================")

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your Dearly link",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style="
          background: #09090b;
          color: #f4f4f5;
          font-family: Georgia, serif;
          margin: 0;
          padding: 0;
        ">
          <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh;">
            <tr>
              <td align="center" valign="middle" style="padding: 60px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px;">

                  <!-- Wordmark -->
                  <tr>
                    <td align="center" style="padding-bottom: 48px;">
                      <p style="
                        font-family: Georgia, serif;
                        font-size: 28px;
                        font-style: italic;
                        font-weight: 300;
                        color: #f4f4f5;
                        margin: 0;
                        letter-spacing: -0.02em;
                      ">Dearly</p>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td align="center" style="padding-bottom: 48px;">
                      <div style="width: 40px; height: 1px; background: rgba(244,244,245,0.2);"></div>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td align="center" style="padding-bottom: 16px;">
                      <p style="
                        font-family: Georgia, serif;
                        font-size: 22px;
                        font-style: italic;
                        font-weight: 300;
                        color: #f4f4f5;
                        margin: 0;
                        line-height: 1.4;
                      ">
                        Here is your link.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding-bottom: 48px;">
                      <p style="
                        font-family: -apple-system, sans-serif;
                        font-size: 14px;
                        color: rgba(244,244,245,0.5);
                        margin: 0;
                        line-height: 1.6;
                      ">
                        Click below to sign in to Dearly.<br />
                        This link expires in 15 minutes.
                      </p>
                    </td>
                  </tr>

                  <!-- CTA -->
                  <tr>
                    <td align="center" style="padding-bottom: 48px;">
                      <a
                        href="${magicUrl}"
                        style="
                          display: inline-block;
                          padding: 14px 32px;
                          background: #f4f4f5;
                          color: #09090b;
                          font-family: -apple-system, sans-serif;
                          font-size: 13px;
                          font-weight: 500;
                          letter-spacing: 0.08em;
                          text-transform: uppercase;
                          text-decoration: none;
                          border-radius: 100px;
                        "
                      >
                        Open Dearly
                      </a>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td align="center" style="padding-bottom: 32px;">
                      <div style="width: 40px; height: 1px; background: rgba(244,244,245,0.2);"></div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center">
                      <p style="
                        font-family: -apple-system, sans-serif;
                        font-size: 11px;
                        color: rgba(244,244,245,0.25);
                        margin: 0;
                        line-height: 1.6;
                        letter-spacing: 0.05em;
                        text-transform: uppercase;
                      ">
                        If you didn't request this, ignore this email.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  })
}

// ── Resonance notification email ──────────────────────────────
// Called when recipient taps "This stayed with me"
// Phase 2 — wired up later
export async function sendResonanceNotification(
  creatorEmail: string,
  experienceTitle: string,
  experienceSlug: string
) {
  const experienceUrl = `${APP_URL}/p/${experienceSlug}`

  await resend.emails.send({
    from: FROM,
    to: creatorEmail,
    subject: "Someone carried this with them.",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style="
          background: #09090b;
          color: #f4f4f5;
          font-family: Georgia, serif;
          margin: 0;
          padding: 0;
        ">
          <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh;">
            <tr>
              <td align="center" valign="middle" style="padding: 60px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px;">

                  <!-- Wordmark -->
                  <tr>
                    <td align="center" style="padding-bottom: 48px;">
                      <p style="
                        font-family: Georgia, serif;
                        font-size: 28px;
                        font-style: italic;
                        font-weight: 300;
                        color: #f4f4f5;
                        margin: 0;
                        letter-spacing: -0.02em;
                      ">Dearly</p>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td align="center" style="padding-bottom: 48px;">
                      <div style="width: 40px; height: 1px; background: rgba(244,244,245,0.2);"></div>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td align="center" style="padding-bottom: 16px;">
                      <p style="
                        font-family: Georgia, serif;
                        font-size: 22px;
                        font-style: italic;
                        font-weight: 300;
                        color: #f4f4f5;
                        margin: 0;
                        line-height: 1.4;
                      ">
                        Someone carried this with them.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding-bottom: 16px;">
                      <p style="
                        font-family: Georgia, serif;
                        font-size: 16px;
                        font-style: italic;
                        color: rgba(244,244,245,0.6);
                        margin: 0;
                        line-height: 1.6;
                      ">
                        "${experienceTitle}"
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding-bottom: 48px;">
                      <p style="
                        font-family: -apple-system, sans-serif;
                        font-size: 14px;
                        color: rgba(244,244,245,0.4);
                        margin: 0;
                        line-height: 1.6;
                      ">
                        Someone reached the end of your experience<br />
                        and felt something worth keeping.
                      </p>
                    </td>
                  </tr>

                  <!-- CTA -->
                  <tr>
                    <td align="center" style="padding-bottom: 48px;">
                      <a
                        href="${experienceUrl}"
                        style="
                          display: inline-block;
                          padding: 14px 32px;
                          background: #f4f4f5;
                          color: #09090b;
                          font-family: -apple-system, sans-serif;
                          font-size: 13px;
                          font-weight: 500;
                          letter-spacing: 0.08em;
                          text-transform: uppercase;
                          text-decoration: none;
                          border-radius: 100px;
                        "
                      >
                        Revisit your experience
                      </a>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td align="center" style="padding-bottom: 32px;">
                      <div style="width: 40px; height: 1px; background: rgba(244,244,245,0.2);"></div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center">
                      <p style="
                        font-family: -apple-system, sans-serif;
                        font-size: 11px;
                        color: rgba(244,244,245,0.25);
                        margin: 0;
                        line-height: 1.6;
                        letter-spacing: 0.05em;
                        text-transform: uppercase;
                      ">
                        Made with stillness · Dearly
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  })
}