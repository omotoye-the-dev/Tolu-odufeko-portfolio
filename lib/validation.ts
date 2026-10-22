import type { z } from "zod";

/**
 * Normalizes Zod validation errors into clear, human-friendly messages.
 * Deduplicates multiple errors on the same field (e.g., empty string vs regex)
 * and formats multiple errors into clean, readable bullet points.
 */
export function formatZodError(error: z.ZodError): string {
  const seenFields = new Set<string>();
  const messages: string[] = [];

  for (const issue of error.issues) {
    const fieldKey = issue.path.join(".") || "form";

    // Deduplicate: only take the primary error for each field
    if (seenFields.has(fieldKey)) {
      continue;
    }
    seenFields.add(fieldKey);

    let message = issue.message;

    // Convert raw Zod fallback messages into readable text
    if (
      message.startsWith("Too small") ||
      message.includes("expected string to have >=")
    ) {
      const fieldName = String(issue.path[issue.path.length - 1] ?? "Field");
      const formattedName =
        fieldName.charAt(0).toUpperCase() +
        fieldName
          .slice(1)
          .replace(/([A-Z])/g, " $1")
          .toLowerCase();
      message = `${formattedName} is required.`;
    } else if (message.toLowerCase() === "invalid url") {
      const fieldName = String(issue.path[issue.path.length - 1] ?? "URL");
      message = `Please provide a valid URL for ${fieldName}.`;
    }

    messages.push(message.trim());
  }

  if (messages.length === 0) {
    return "Please check the form for invalid inputs.";
  }

  if (messages.length === 1) {
    return messages[0];
  }

  return `Please correct the following fields:\n${messages.map((m) => `• ${m}`).join("\n")}`;
}
