chrome.runtime.onMessage.addListener((message) => {
  if (message.action !== "closeDomainTabs") return;
  const domains = Array.isArray(message.domains)
    ? message.domains
    : message.domain
    ? [message.domain]
    : [];
  if (domains.length === 0) return;
  closeTabsForDomains(domains);
});

function closeTabsForDomains(domains) {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) return;
    const ids = tabs
      .filter((tab) => domains.some((d) => matchDomain(tab.url, d)))
      .map((tab) => tab.id);
    if (ids.length === 0) return;
    chrome.tabs.remove(ids, () => void chrome.runtime.lastError);
  });
}

function matchDomain(url, domain) {
  if (!url || !domain) return false;
  try {
    const u = new URL(url);
    const d = domain.toLowerCase();
    if (d.includes(":")) return u.host === d;
    return u.hostname === d || u.hostname.endsWith("." + d);
  } catch {
    return false;
  }
}
