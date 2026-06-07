function migrateDomains(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  if (typeof data[0] === "string") {
    return data.map((domain) => ({
      id: generateId(),
      domain,
      title: "",
      createdAt: Date.now(),
    }));
  }
  if (data[0] && data[0].id) return data;
  return [];
}

function loadDomains(callback) {
  chrome.storage.local.get({ domains: [] }, (data) => {
    if (chrome.runtime.lastError) {
      callback([]);
      return;
    }
    const migrated = migrateDomains(data.domains);
    const needsSave =
      migrated.length !== data.domains.length ||
      migrated.some((d, i) => d !== data.domains[i]);
    if (needsSave) {
      saveDomains(migrated, () => callback(migrated));
    } else {
      callback(migrated);
    }
  });
}

function saveDomains(domains, callback) {
  chrome.storage.local.set({ domains }, () => {
    if (callback) callback(chrome.runtime.lastError || null);
  });
}

function addDomain(domain, title, callback) {
  loadDomains((domains) => {
    const normalized = domain.toLowerCase();
    if (domains.some((d) => d.domain.toLowerCase() === normalized)) {
      callback({ success: false, error: "Domain already exists" });
      return;
    }
    const newDomain = {
      id: generateId(),
      domain: normalized,
      title: (title || "").slice(0, 100),
      createdAt: Date.now(),
    };
    saveDomains([...domains, newDomain], () => {
      callback({ success: true, domain: newDomain });
    });
  });
}

function removeDomain(id, callback) {
  loadDomains((domains) => {
    saveDomains(
      domains.filter((d) => d.id !== id),
      callback
    );
  });
}

function closeAllDomainTabs() {
  loadDomains((domains) => {
    if (domains.length === 0) return;
    chrome.runtime.sendMessage({
      action: "closeDomainTabs",
      domains: domains.map((d) => d.domain),
    });
  });
}
