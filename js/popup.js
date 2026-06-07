document.addEventListener("DOMContentLoaded", () => {
  UI.init();
  loadDomains((domains) => {
    domains.forEach((domain) => UI.addDomainToUI(domain));
  });
  setupEventListeners();
});

function setupEventListeners() {
  const { domainInput, titleInput, addButton, cancelBtn, toggleAddBtn, closeAllBtn } =
    UI.elements;

  toggleAddBtn.addEventListener("click", () => UI.showAddForm());
  cancelBtn.addEventListener("click", () => UI.hideAddForm());

  domainInput.addEventListener("input", () => UI.hideError());
  titleInput.addEventListener("input", () => UI.hideError());

  const submitOnEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddDomain();
    }
  };
  domainInput.addEventListener("keydown", submitOnEnter);
  titleInput.addEventListener("keydown", submitOnEnter);

  addButton.addEventListener("click", handleAddDomain);
  closeAllBtn.addEventListener("click", handleCloseAll);

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
      menu.classList.remove("show");
    });
  });
}

function handleAddDomain() {
  const { domain, title } = UI.getInputValues();

  if (!domain) {
    UI.showError("Please enter a domain");
    return;
  }
  if (!isValidDomain(domain)) {
    UI.showError("Please enter a valid domain (e.g., gitlab.com)");
    return;
  }

  addDomain(domain, title, (result) => {
    if (result.success) {
      UI.addDomainToUI(result.domain);
      UI.hideAddForm();
    } else {
      UI.showError(result.error);
    }
  });
}

function handleCloseAll() {
  UI.showConfirmation(
    "This will close all tabs matching the domains in your list.",
    () => closeAllDomainTabs()
  );
}
