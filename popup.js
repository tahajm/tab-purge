const domainInput = document.getElementById("domainInput");
const addButton = document.getElementById("addDomain");
const domainListDiv = document.getElementById("domainList");

// Load saved domains
chrome.storage.local.get({ domains: [] }, (data) => {
  data.domains.forEach(addDomainToUI);
});

// Add domain button click
addButton.addEventListener("click", () => {
  const domain = domainInput.value.trim();
  if (!domain) return;

  // Save to storage
  chrome.storage.local.get({ domains: [] }, (data) => {
    if (!data.domains.includes(domain)) {
      const updatedDomains = [...data.domains, domain];
      chrome.storage.local.set({ domains: updatedDomains }, () => {
        addDomainToUI(domain);
        domainInput.value = "";
      });
    } else {
      alert("Domain already exists!");
    }
  });
});

// Helper: add domain element to the UI
function addDomainToUI(domain) {
  const div = document.createElement("div");
  div.className = "domain-item";

  const span = document.createElement("span");
  // Remove https:// or http:// for display
  const displayDomain = domain.replace(/^https?:\/\//, "");
  span.textContent = displayDomain;
  span.className = "domain-name";
  span.title = displayDomain; // Show full domain on hover

  const btnContainer = document.createElement("div");
  btnContainer.className = "button-container";

  const btn = document.createElement("button");
  btn.textContent = "Close";
  btn.className = "close-btn";
  btn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "closeDomainTabs", domain });
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
    removeDomain(domain, div);
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
  
  div.appendChild(span);
  div.appendChild(btnContainer);
  domainListDiv.appendChild(div);
}

// Remove domain from storage and UI
function removeDomain(domain, domainElement) {
  chrome.storage.local.get({ domains: [] }, (data) => {
    const updatedDomains = data.domains.filter(d => d !== domain);
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
