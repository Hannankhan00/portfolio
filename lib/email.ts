import nodemailer from "nodemailer";

interface SendContactEmailParams {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}

export async function sendContactNotificationEmail({
  name,
  email,
  subject,
  message,
}: SendContactEmailParams): Promise<{ sent: boolean; reason?: string }> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const receiver = process.env.CONTACT_RECEIVER_EMAIL || "8hannankhan00@gmail.com";

  if (!host || !user || !pass) {
    console.info(
      "[Email] SMTP not configured yet. Message saved to database. Add SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local when ready."
    );
    return { sent: false, reason: "smtp_not_configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const emailSubject = subject?.trim()
      ? `Portfolio Message: ${subject.trim()}`
      : `New Portfolio Message from ${name}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #08080c; color: #f1f5f9; padding: 24px; margin: 0; }
            .card { max-width: 580px; margin: 0 auto; background-color: #0e0e14; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
            .header { border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 20px; margin-bottom: 24px; }
            .tag { display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #a855f7; font-weight: 600; margin-bottom: 8px; }
            .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 0; }
            .field { margin-bottom: 16px; }
            .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 4px; }
            .val { font-size: 15px; color: #ffffff; font-weight: 500; }
            .msg-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 18px; margin-top: 18px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #e2e8f0; }
            .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="tag">Portfolio Contact</span>
              <h2 class="title">New Message Received</h2>
            </div>
            
            <div class="field">
              <div class="label">Sender Name</div>
              <div class="val">${escapeHtml(name)}</div>
            </div>

            <div class="field">
              <div class="label">Sender Email</div>
              <div class="val"><a href="mailto:${escapeHtml(email)}" style="color: #a855f7; text-decoration: none;">${escapeHtml(email)}</a></div>
            </div>

            ${
              subject
                ? `<div class="field">
                    <div class="label">Subject</div>
                    <div class="val">${escapeHtml(subject)}</div>
                  </div>`
                : ""
            }

            <div class="field">
              <div class="label">Message</div>
              <div class="msg-box">${escapeHtml(message)}</div>
            </div>

            <div class="footer">
              This message was sent from your portfolio contact form. You can reply directly to this email.
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${name}" <${user}>`,
      to: receiver,
      replyTo: email,
      subject: emailSubject,
      text: `From: ${name} (${email})\nSubject: ${subject || "None"}\n\nMessage:\n${message}`,
      html: htmlContent,
    });

    return { sent: true };
  } catch (err: any) {
    console.error("[Email] Failed to send email via SMTP:", err?.message || err);
    return { sent: false, reason: err?.message || "Failed to send email" };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
