import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("[email] SMTP is not configured — emails will be logged instead of sent.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

async function send(to: string, subject: string, html: string) {
  const from = process.env.MAIL_FROM || "Namoza India <no-reply@namozaindia.com>";
  const t = getTransporter();

  if (!t) {
    console.log(`[email:dry-run] To: ${to} | Subject: ${subject}\n${html}\n`);
    return;
  }

  try {
    await t.sendMail({ from, to, subject, html });
  } catch (err) {
    console.error("[email] failed to send:", err);
  }
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  quotedPriceInr: number;
}) {
  const { to, customerName, orderNumber, quotedPriceInr } = params;
  await send(
    to,
    `We've received your order — ${orderNumber}`,
    `<div style="font-family:sans-serif;color:#1C1F26">
      <h2>Thank you, ${customerName}!</h2>
      <p>Your custom statue order <strong>${orderNumber}</strong> has been received.</p>
      <p>Quoted price: <strong>₹${quotedPriceInr.toLocaleString("en-IN")}</strong></p>
      <p>Our studio team will review your photos and confirm within 24–48 hours. You can track
      your order anytime at namozaindia.com/track using your order number and email.</p>
      <p>— Namoza India</p>
    </div>`
  );
}

export async function sendAdminNewOrderAlert(params: { orderNumber: string; customerName: string }) {
  const alertTo = process.env.ADMIN_ALERT_EMAIL;
  if (!alertTo) return;
  await send(
    alertTo,
    `New order received — ${params.orderNumber}`,
    `<p>New order from ${params.customerName} (${params.orderNumber}). Open the admin dashboard to review.</p>`
  );
}

export async function sendContactFormAlert(params: { name: string; email: string; message: string }) {
  const alertTo = process.env.ADMIN_ALERT_EMAIL;
  if (!alertTo) return;
  await send(
    alertTo,
    `New contact form message from ${params.name}`,
    `<div style="font-family:sans-serif;color:#1C1F26">
      <p><strong>${params.name}</strong> (${params.email}) sent a message via the website:</p>
      <p>${params.message}</p>
    </div>`
  );
}

export async function sendStatusUpdateEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  status: string;
  note?: string | null;
}) {
  const { to, customerName, orderNumber, status, note } = params;
  await send(
    to,
    `Update on your order ${orderNumber}`,
    `<div style="font-family:sans-serif;color:#1C1F26">
      <p>Hi ${customerName},</p>
      <p>Your order <strong>${orderNumber}</strong> status is now: <strong>${status.replace(/_/g, " ")}</strong></p>
      ${note ? `<p>${note}</p>` : ""}
      <p>Track your order anytime at namozaindia.com/track.</p>
      <p>— Namoza India</p>
    </div>`
  );
}
