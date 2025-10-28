// Storage management functions

// Migrate old array format to new object format
function migrateDomains(data) {
  // If data is already in new format (array of objects with id)
  if (Array.isArray(data) && data.length > 0 && data[0].id) {
    return data;
  }
  
  // If data is in old format (array of strings), migrate it
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
    return data.map(domain => ({
      id: generateId(),
      domain: domain,
      title: "",
      createdAt: Date.now()
    }));
  }
  
  // Empty or invalid data
  return [];
}

// Load domains from storage
function loadDomains(callback) {
  chrome.storage.local.get({ domains: [] }, (data) => {
    const domains = migrateDomains(data.domains);
    
    // Save migrated data if needed
    if (JSON.stringify(domains) !== JSON.stringify(data.domains)) {
      saveDomains(domains);
    }
    
    callback(domains);
  });
}

// Save domains to storage
function saveDomains(domains, callback) {
  chrome.storage.local.set({ domains }, callback);
}

// Add a new domain
function addDomain(domain, title, callback) {
  loadDomains((domains) => {
    // Check if domain already exists
    if (domains.some(d => d.domain === domain)) {
      callback({ success: false, error: "Domain already exists!" });
      return;
    }
    
    // Create new domain object
    const newDomain = {
      id: generateId(),
      domain: domain,
      title: title,
      createdAt: Date.now()
    };
    
    const updatedDomains = [...domains, newDomain];
    saveDomains(updatedDomains, () => {
      callback({ success: true, domain: newDomain });
    });
  });
}

// Remove a domain by ID
function removeDomain(id, callback) {
  loadDomains((domains) => {
    const updatedDomains = domains.filter(d => d.id !== id);
    saveDomains(updatedDomains, callback);
  });
}

// Close all tabs for all domains
function closeAllDomainTabs() {
  loadDomains((domains) => {
    domains.forEach(domainObj => {
      chrome.runtime.sendMessage({ action: "closeDomainTabs", domain: domainObj.domain });
    });
  });
}

