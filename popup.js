const domainInput = document.getElementById("domainInput");
const titleInput = document.getElementById("titleInput");
const addButton = document.getElementById("addDomain");
const cancelBtn = document.getElementById("cancelBtn");
const toggleAddBtn = document.getElementById("toggleAddBtn");
const addFormContainer = document.getElementById("addFormContainer");
const domainListDiv = document.getElementById("domainList");
const errorMessage = document.getElementById("errorMessage");

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

// Load saved domains
chrome.storage.local.get({ domains: [] }, (data) => {
  const domains = migrateDomains(data.domains);
  
  // Save migrated data if needed
  if (JSON.stringify(domains) !== JSON.stringify(data.domains)) {
    chrome.storage.local.set({ domains });
  }
  
  domains.forEach(addDomainToUI);
});

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
}

// Hide error message
function hideError() {
  errorMessage.textContent = "";
  errorMessage.classList.remove("show");
}

// Toggle add form visibility
function showAddForm() {
  addFormContainer.classList.remove("hidden");
  toggleAddBtn.style.display = "none";
  domainInput.focus();
}

function hideAddForm() {
  addFormContainer.classList.add("hidden");
  toggleAddBtn.style.display = "flex";
  domainInput.value = "";
  titleInput.value = "";
  hideError();
}

toggleAddBtn.addEventListener("click", showAddForm);
cancelBtn.addEventListener("click", hideAddForm);

// Hide error when user starts typing
domainInput.addEventListener("input", hideError);
titleInput.addEventListener("input", hideError);

// Submit on Enter key in both inputs
domainInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addButton.click();
  }
});

titleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addButton.click();
  }
});

// Add domain button click
addButton.addEventListener("click", () => {
  const domain = sanitizeDomain(domainInput.value);
  const title = titleInput.value.trim();
  
  // Check if empty
  if (!domain) {
    showError("Please enter a domain");
    return;
  }
  
  // Validate domain format
  if (!isValidDomain(domain)) {
    showError("Please enter a valid domain (e.g., gitlab.com)");
    return;
  }

  // Save to storage
  chrome.storage.local.get({ domains: [] }, (data) => {
    const domains = migrateDomains(data.domains);
    
    // Check if domain already exists
    if (domains.some(d => d.domain === domain)) {
      showError("Domain already exists!");
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
    chrome.storage.local.set({ domains: updatedDomains }, () => {
      addDomainToUI(newDomain);
      hideAddForm();
    });
  });
});

// Helper: add domain element to the UI
function addDomainToUI(domainObj) {
  const div = document.createElement("div");
  div.className = "domain-item";
  div.dataset.id = domainObj.id;

  const nameContainer = document.createElement("div");
  nameContainer.className = "domain-name";

  // Show title if provided, otherwise show domain
  if (domainObj.title) {
    const titleSpan = document.createElement("div");
    titleSpan.className = "domain-title";
    titleSpan.textContent = domainObj.title;
    titleSpan.title = domainObj.title;
    
    const subtitleSpan = document.createElement("div");
    subtitleSpan.className = "domain-subtitle";
    subtitleSpan.textContent = domainObj.domain;
    subtitleSpan.title = domainObj.domain;
    
    nameContainer.appendChild(titleSpan);
    nameContainer.appendChild(subtitleSpan);
  } else {
    const titleSpan = document.createElement("div");
    titleSpan.className = "domain-title";
    titleSpan.textContent = domainObj.domain;
    titleSpan.title = domainObj.domain;
    
    nameContainer.appendChild(titleSpan);
  }

  const btnContainer = document.createElement("div");
  btnContainer.className = "button-container";

  const btn = document.createElement("button");
  btn.textContent = "Close";
  btn.className = "close-btn";
  btn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "closeDomainTabs", domain: domainObj.domain });
  });

  // Create menu button (three vertical dots)
  const menuBtn = document.createElement("button");
  menuBtn.textContent = "⋮";
  menuBtn.className = "menu-btn";
  menuBtn.title = "More options";
  
  // Create dropdown menu
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown-menu";
  
  const removeOption = document.createElement("div");
  removeOption.className = "dropdown-item";
  removeOption.textContent = "Remove domain";
  removeOption.addEventListener("click", (e) => {
    e.stopPropagation();
    removeDomain(domainObj.id, div);
    dropdown.classList.remove("show");
  });
  
  dropdown.appendChild(removeOption);
  
  // Toggle dropdown on menu button click
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    // Close all other open dropdowns
    document.querySelectorAll(".dropdown-menu.show").forEach(menu => {
      if (menu !== dropdown) menu.classList.remove("show");
    });
    dropdown.classList.toggle("show");
  });
  
  // Create menu wrapper for positioning
  const menuWrapper = document.createElement("div");
  menuWrapper.className = "menu-wrapper";
  menuWrapper.appendChild(menuBtn);
  menuWrapper.appendChild(dropdown);

  btnContainer.appendChild(btn);
  btnContainer.appendChild(menuWrapper);
  
  div.appendChild(nameContainer);
  div.appendChild(btnContainer);
  domainListDiv.appendChild(div);
}

// Remove domain from storage and UI
function removeDomain(id, domainElement) {
  chrome.storage.local.get({ domains: [] }, (data) => {
    const domains = migrateDomains(data.domains);
    const updatedDomains = domains.filter(d => d.id !== id);
    chrome.storage.local.set({ domains: updatedDomains }, () => {
      domainElement.remove();
    });
  });
}

// Close dropdowns when clicking outside
document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown-menu.show").forEach(menu => {
    menu.classList.remove("show");
  });
});
