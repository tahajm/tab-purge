// Main popup script - coordinates UI and business logic

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize UI
  UI.init();
  
  // Load and display saved domains
  loadDomains((domains) => {
    domains.forEach(domain => UI.addDomainToUI(domain));
  });
  
  // Setup event listeners
  setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
  const { domainInput, titleInput, addButton, cancelBtn, toggleAddBtn } = UI.elements;
  
  // Toggle add form
  toggleAddBtn.addEventListener("click", () => UI.showAddForm());
  cancelBtn.addEventListener("click", () => UI.hideAddForm());
  
  // Hide error when user starts typing
  domainInput.addEventListener("input", () => UI.hideError());
  titleInput.addEventListener("input", () => UI.hideError());
  
  // Submit on Enter key
  domainInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addButton.click();
  });
  
  titleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addButton.click();
  });
  
  // Add domain button
  addButton.addEventListener("click", handleAddDomain);
  
  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu.show").forEach(menu => {
      menu.classList.remove("show");
    });
  });
}

// Handle adding a domain
function handleAddDomain() {
  const { domain, title } = UI.getInputValues();
  
  // Validate empty
  if (!domain) {
    UI.showError("Please enter a domain");
    return;
  }
  
  // Validate format
  if (!isValidDomain(domain)) {
    UI.showError("Please enter a valid domain (e.g., gitlab.com)");
    return;
  }
  
  // Add to storage
  addDomain(domain, title, (result) => {
    if (result.success) {
      UI.addDomainToUI(result.domain);
      UI.hideAddForm();
    } else {
      UI.showError(result.error);
    }
  });
}

