"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import Container from "@/component/UI/Container";
import Button from "@/component/UI/Button";
import { socials as defaultSocials } from "@/lib/constants";
import { toast } from "@/hooks/useToast";
import { sendContactMessage } from "@/app/actions/contact";
import type { SiteSettings } from "@/lib/data";

type InquiryCategory = "general" | "donate_drive";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export interface ContactContentProps {
  readonly settings?: SiteSettings;
}

export function ContactContent({ settings }: ContactContentProps) {
  const instagramLink = settings?.instagramUrl ?? settings?.twitterUrl;
  const socialLinks = settings
    ? [
        { label: "LinkedIn", href: settings.linkedinUrl },
        { label: "GitHub", href: settings.githubUrl },
        ...(instagramLink ? [{ label: "Instagram", href: instagramLink }] : []),
      ]
    : defaultSocials;

  const [category, setCategory] = useState<InquiryCategory>("general");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCategoryChange = (newCategory: InquiryCategory): void => {
    setCategory(newCategory);
    setErrors({});
  };

  const handleInputChange = (
    field: keyof ContactFormData
  ) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim()) {
      nextErrors.subject = "Please add a subject.";
    }

    if (formData.message.trim().length < 10) {
      nextErrors.message = "Message should be at least 10 characters.";
    }

    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const result = await sendContactMessage({
          ...formData,
          category,
        });

        if (result.success) {
          setIsSubmitted(true);
          const recipientNotice =
            category === "donate_drive"
              ? "Your inquiry has been sent to the Donate Drive team."
              : "I've received your note and will reply soon.";

          toast.success("Message Delivered Successfully!", {
            description: `Thank you, ${formData.name.split(" ")[0] || "friend"}. ${recipientNotice}`,
          });
        } else {
          toast.error("Message Failed to Send", {
            description:
              result.error ||
              "Please check your connection or try again in a moment.",
          });
        }
      } catch {
        toast.error("Message Delivery Error", {
          description:
            "Something went wrong while delivering your message. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.warning("Incomplete Message Details", {
        description: "Please check the highlighted fields and fix any missing information.",
      });
    }
  };

  const handleResetForm = (): void => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setErrors({});
  };

  const inputClasses = (hasError?: boolean): string =>
    clsx(
      "font-content w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-dark-one placeholder:text-muted/60 transition-colors focus:outline-none shadow-2xs",
      hasError
        ? "border-red-500 focus:border-red-600"
        : "border-dark-one/15 focus:border-accent"
    );

  return (
    <div className="w-full py-12 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left Column: Information & Elsewhere */}
          <div>
            <span className="font-content text-xs sm:text-sm font-semibold uppercase tracking-wider text-accent-strong">
              {settings?.contactEyebrow ?? "Reach Out"}
            </span>
            <h1 className="mt-2 font-header text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-dark-one">
              {settings?.contactTitle ?? "Get In Touch"}
            </h1>
            <p className="mt-6 max-w-md font-content text-base sm:text-lg leading-relaxed text-muted">
              {settings?.contactSubtext ??
                "Whether it’s a hardware problem worth solving, an engineering collaboration, or supporting Donate Drive — I read every message. Tell me what you’re working on and I’ll get back to you."}
            </p>

            <div className="mt-10 sm:mt-12 space-y-4">
              <p className="font-content text-xs font-bold uppercase tracking-[0.2em] text-accent-strong">
                Elsewhere
              </p>
              <div className="flex flex-col gap-3">
                {socialLinks.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="font-content w-fit text-base font-semibold text-dark-one underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-strong"
                  >
                    {s.label} &rarr;
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form with Segmented Inquiry Switcher */}
          <div className="rounded-2xl border border-dark-one/15 bg-white/80 p-6 sm:p-10 shadow-sm backdrop-blur-xs">
            {isSubmitted ? (
              <div className="flex flex-col items-start justify-center py-6 text-left animate-in fade-in duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-dark-one text-2xl font-bold">
                  ✓
                </div>
                <h2 className="font-header mt-6 text-2xl sm:text-3xl font-bold text-dark-one">
                  {category === "donate_drive"
                    ? "Inquiry sent to Donate Drive!"
                    : "Message sent successfully!"}
                </h2>
                <p className="font-content mt-3 text-base text-muted">
                  {category === "donate_drive"
                    ? `Thank you, ${formData.name.split(" ")[0] || "there"}. Your message has been forwarded to the Donate Drive foundation team. We will be in touch shortly.`
                    : `Thanks, ${formData.name.split(" ")[0] || "there"}. I appreciate you reaching out and will be in touch soon.`}
                </p>
                <div className="mt-8">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleResetForm}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Segmented Inquiry Switcher */}
                <div>
                  <label className="font-content mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                    Select Inquiry Type
                  </label>
                  <div
                    role="tablist"
                    aria-label="Inquiry category"
                    className="grid grid-cols-2 p-1 bg-dark-one/5 rounded-xl gap-1 border border-dark-one/10"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={category === "general"}
                      onClick={() => handleCategoryChange("general")}
                      className={clsx(
                        "font-content py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 text-center cursor-pointer",
                        category === "general"
                          ? "bg-white text-dark-one shadow-xs font-bold"
                          : "text-muted hover:text-dark-one"
                      )}
                    >
                      General & Engineering
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={category === "donate_drive"}
                      onClick={() => handleCategoryChange("donate_drive")}
                      className={clsx(
                        "font-content py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 text-center cursor-pointer",
                        category === "donate_drive"
                          ? "bg-white text-dark-one shadow-xs font-bold"
                          : "text-muted hover:text-dark-one"
                      )}
                    >
                      Donate Drive
                    </button>
                  </div>
                  <p className="font-content mt-2 text-xs text-muted">
                    {category === "general"
                      ? "Direct message for engineering consulting, hardware projects, or partnerships."
                      : "Direct message to the Donate Drive team for mentorship, school drives, and sponsorships."}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="contact-name"
                    className="font-content mb-2 block text-xs font-bold uppercase tracking-wider text-dark-one"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    placeholder="Your name"
                    className={inputClasses(Boolean(errors.name))}
                  />
                  {errors.name && (
                    <p className="font-content mt-1.5 text-xs text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="font-content mb-2 block text-xs font-bold uppercase tracking-wider text-dark-one"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    placeholder="yourname@domain.com"
                    className={inputClasses(Boolean(errors.email))}
                  />
                  {errors.email && (
                    <p className="font-content mt-1.5 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="font-content mb-2 block text-xs font-bold uppercase tracking-wider text-dark-one"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange("subject")}
                    placeholder={
                      category === "donate_drive"
                        ? "e.g. School Drive Sponsorship / Mentorship"
                        : "e.g. Hardware Consultation / Build Partnership"
                    }
                    className={inputClasses(Boolean(errors.subject))}
                  />
                  {errors.subject && (
                    <p className="font-content mt-1.5 text-xs text-red-500">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="font-content mb-2 block text-xs font-bold uppercase tracking-wider text-dark-one"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleInputChange("message")}
                    placeholder={
                      category === "donate_drive"
                        ? "Tell us how you would like to collaborate, volunteer, or support Donate Drive…"
                        : "Tell me about your project, initiative, or idea…"
                    }
                    className={inputClasses(Boolean(errors.message))}
                  />
                  {errors.message && (
                    <p className="font-content mt-1.5 text-xs text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting
                      ? "Sending..."
                      : category === "donate_drive"
                      ? "Send to Donate Drive"
                      : "Send Message"}
                  </Button>
                  <p className="font-content text-xs text-muted/70">
                    Your information is kept confidential and will only be used to respond to your inquiry.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ContactContent;
