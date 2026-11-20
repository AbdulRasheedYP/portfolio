/**
 * Sanitizes icon class names or <i> snippet inputs.
 * If user pastes `<i class="fab fa-react"></i>`, extracts `"fab fa-react"`.
 * Strips HTML tags and removes any characters outside standard CSS class characters.
 */
export const sanitizeIcon = (raw) => {
  const s = (raw || "").trim();
  const match = s.match(/class=["']([^"']+)["']/);
  if (match) return match[1].trim();
  if (s.includes("<") || s.includes(">")) {
    return s.replace(/<[^>]+>/g, "").trim();
  }
  return s;
};
