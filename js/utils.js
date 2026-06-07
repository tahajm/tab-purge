function generateId() {
  if (crypto && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function sanitizeDomain(input) {
  if (!input) return "";
  const trimmed = input.trim();
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : "https://" + trimmed;
  try {
    return new URL(withProtocol).host.toLowerCase();
  } catch {
    return "";
  }
}

function isValidDomain(domain) {
  if (!domain) return false;
  try {
    const u = new URL("https://" + domain);
    return u.host === domain;
  } catch {
    return false;
  }
}
