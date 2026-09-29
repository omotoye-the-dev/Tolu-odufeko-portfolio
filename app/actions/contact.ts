"use server";

import { z } from "zod";
import { Resend } from "resend";

const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(100, "Name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(150, "Email cannot exceed 150 characters."),
  subject: z
    .string()
    .trim()
    .min(1, "Please enter a subject.")
    .max(200, "Subject cannot exceed 200 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters.")
    .max(5000, "Message cannot exceed 5000 characters."),
  category: z.enum(["general", "donate_drive"]).default("general"),
});

export type ContactFormData = z.infer<typeof ContactSchema>;

export interface ContactActionResult {
  success: boolean;
  error?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendContactMessage(
  data: ContactFormData
): Promise<ContactActionResult> {
  const parsed = ContactSchema.safeParse(data);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? "Invalid form data.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      success: false,
      error:
        "The message service is currently being initialized. Please try again soon.",
    };
  }

  const isDonateDrive = parsed.data.category === "donate_drive";

  // Dedicated routing based on inquiry category
  const receiverEmail = isDonateDrive
    ? process.env.DONATE_DRIVE_RECEIVER_EMAIL?.trim() ||
      "odufeko.hephzibah@donate-drive.org"
    : process.env.CONTACT_RECEIVER_EMAIL?.trim() ||
      "isrealdufeks@gmail.com";

  const senderEmail =
    process.env.CONTACT_SENDER_EMAIL?.trim() ||
    "Portfolio Contact <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey.trim());

    const { name, email, subject, message } = parsed.data;
    const sanitizedName = escapeHtml(name);
    const sanitizedEmail = escapeHtml(email);
    const sanitizedSubject = escapeHtml(subject);
    const sanitizedMessage = escapeHtml(message).replace(/\n/g, "<br/>");
    const submittedAt = new Date().toUTCString();

    const emailSubject = isDonateDrive
      ? `[Donate Drive Inquiry] ${subject} - ${name}`
      : `[Portfolio Inquiry] ${subject} - ${name}`;

    const bannerTitle = isDonateDrive
      ? "New Message for Donate Drive Foundation"
      : "New Message from Portfolio Website";

    const categoryBadge = isDonateDrive
      ? "Donate Drive Foundation"
      : "General & Engineering";

    const { error } = await resend.emails.send({
      from: senderEmail,
      to: [receiverEmail],
      replyTo: email,
      subject: emailSubject,
      text: `${bannerTitle}\n\nType: ${categoryBadge}\nFrom: ${name} (${email})\nSubject: ${subject}\nDate: ${submittedAt}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #1a202c; padding-bottom: 12px; margin-bottom: 20px;">
            <div style="display: inline-block; background-color: ${isDonateDrive ? "#fef3c7" : "#e0f2fe"}; color: ${isDonateDrive ? "#92400e" : "#0369a1"}; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 8px; border-radius: 4px; margin-bottom: 8px;">
              ${categoryBadge}
            </div>
            <h2 style="margin: 0; color: #1a202c; font-size: 20px;">${bannerTitle}</h2>
            <p style="margin: 4px 0 0 0; color: #718096; font-size: 13px;">Received: ${submittedAt}</p>
          </div>

          <div style="background-color: #f7fafc; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #edf2f7;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #4a5568;">
              <strong style="color: #2d3748;">Sender Name:</strong> ${sanitizedName}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #4a5568;">
              <strong style="color: #2d3748;">Sender Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #3182ce; text-decoration: underline;">${sanitizedEmail}</a>
            </p>
            <p style="margin: 0; font-size: 14px; color: #4a5568;">
              <strong style="color: #2d3748;">Subject:</strong> ${sanitizedSubject}
            </p>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #718096; margin-bottom: 8px;">Message Content:</h3>
            <div style="background-color: #ffffff; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 15px; line-height: 1.6; color: #2d3748;">
              ${sanitizedMessage}
            </div>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #a0aec0; text-align: center;">
            <p style="margin: 0;">Hit "Reply" in your email client to reply directly to ${sanitizedName} at ${sanitizedEmail}.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return {
        success: false,
        error: error.message || "Failed to deliver email through Resend.",
      };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("[sendContactMessage Exception]:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}
