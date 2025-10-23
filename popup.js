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
  span.textContent = domain;
  span.className = "domain-name";

  const btn = document.createElement("button");
  btn.textContent = "Close Tabs";
  btn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "closeDomainTabs", domain });
  });

  div.appendChild(span);
  div.appendChild(btn);
  domainListDiv.appendChild(div);
}
