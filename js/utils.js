// Utility functions

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Sanitize domain: remove protocol and trailing slashes
function sanitizeDomain(domain) {
  return domain
    .trim()
    .replace(/^https?:\/\//, "") // Remove http:// or https://
    .replace(/\/+$/, "");         // Remove trailing slashes
}

// Validate domain format using URL API
function isValidDomain(domain) {
  if (!domain || domain.length === 0) {
    return false;
  }
  
  try {
    // Add protocol to make it a valid URL for parsing
    new URL(`https://${domain}`);
    return true;
  } catch (e) {
    // If URL constructor throws, it's not a valid domain
    return false;
  }
}

