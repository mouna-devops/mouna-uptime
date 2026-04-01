import nodemailer from "nodemailer";

export async function sendPersonalEmailAlert(
  to: string,
  subject: string,
  html: string
) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  try {
    const emails = to.split(",").map(e => e.trim()).filter(e => e);
    const primaryTo = emails[0];
    const ccEmails = emails.slice(1).join(", ");

    await transporter.sendMail({
      from: `"MouNa Monitoring" <${user}>`,
      to: primaryTo,
      ...(ccEmails ? { cc: ccEmails } : {}),
      subject,
      html,
    });
    console.log(`[email] Personal alert sent to ${to}`);
  } catch (error) {
    console.error("[email] Error sending personal alert:", error);
  }
}
