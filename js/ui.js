const UI = {
  elements: {},
  confirmController: null,

  init() {
    this.elements = {
      domainInput: document.getElementById("domainInput"),
      titleInput: document.getElementById("titleInput"),
      addButton: document.getElementById("addDomain"),
      cancelBtn: document.getElementById("cancelBtn"),
      toggleAddBtn: document.getElementById("toggleAddBtn"),
      closeAllBtn: document.getElementById("closeAllBtn"),
      addFormContainer: document.getElementById("addFormContainer"),
      domainListDiv: document.getElementById("domainList"),
      errorMessage: document.getElementById("errorMessage"),
      confirmModal: document.getElementById("confirmModal"),
      confirmYes: document.getElementById("confirmYes"),
      confirmNo: document.getElementById("confirmNo"),
    };
  },

  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.classList.add("show");
  },

  hideError() {
    this.elements.errorMessage.textContent = "";
    this.elements.errorMessage.classList.remove("show");
  },

  showAddForm() {
    this.elements.addFormContainer.classList.remove("hidden");
    this.elements.toggleAddBtn.style.display = "none";
    this.elements.domainInput.focus();
  },

  hideAddForm() {
    this.elements.addFormContainer.classList.add("hidden");
    this.elements.toggleAddBtn.style.display = "flex";
    this.elements.domainInput.value = "";
    this.elements.titleInput.value = "";
    this.hideError();
  },

  createDomainItem(domainObj) {
    const div = document.createElement("div");
    div.className = "domain-item";
    div.dataset.id = domainObj.id;

    const nameContainer = document.createElement("div");
    nameContainer.className = "domain-name";

    const titleSpan = document.createElement("div");
    titleSpan.className = "domain-title";
    titleSpan.textContent = domainObj.title || domainObj.domain;
    titleSpan.title = titleSpan.textContent;
    nameContainer.appendChild(titleSpan);

    if (domainObj.title) {
      const subtitleSpan = document.createElement("div");
      subtitleSpan.className = "domain-subtitle";
      subtitleSpan.textContent = domainObj.domain;
      subtitleSpan.title = domainObj.domain;
      nameContainer.appendChild(subtitleSpan);
    }

    const btnContainer = document.createElement("div");
    btnContainer.className = "button-container";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.className = "close-btn";
    closeBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: "closeDomainTabs",
        domain: domainObj.domain,
      });
    });

    const menuBtn = document.createElement("button");
    menuBtn.textContent = "\u22EE";
    menuBtn.className = "menu-btn";
    menuBtn.title = "More options";

    const dropdown = document.createElement("div");
    dropdown.className = "dropdown-menu";

    const removeOption = document.createElement("div");
    removeOption.className = "dropdown-item";
    removeOption.textContent = "Remove domain";
    removeOption.addEventListener("click", (e) => {
      e.stopPropagation();
      this.removeDomainItem(domainObj.id, div);
      dropdown.classList.remove("show");
    });
    dropdown.appendChild(removeOption);

    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
        if (menu !== dropdown) menu.classList.remove("show");
      });
      dropdown.classList.toggle("show");
    });

    const menuWrapper = document.createElement("div");
    menuWrapper.className = "menu-wrapper";
    menuWrapper.appendChild(menuBtn);
    menuWrapper.appendChild(dropdown);

    btnContainer.appendChild(closeBtn);
    btnContainer.appendChild(menuWrapper);

    div.appendChild(nameContainer);
    div.appendChild(btnContainer);

    return div;
  },

  addDomainToUI(domainObj) {
    this.elements.domainListDiv.appendChild(this.createDomainItem(domainObj));
    this.updateCloseAllButton();
  },

  removeDomainItem(id, domainElement) {
    removeDomain(id, () => {
      domainElement.remove();
      this.updateCloseAllButton();
    });
  },

  getInputValues() {
    return {
      domain: sanitizeDomain(this.elements.domainInput.value),
      title: this.elements.titleInput.value.trim(),
    };
  },

  updateCloseAllButton() {
    const hasItems = this.elements.domainListDiv.children.length > 0;
    this.elements.closeAllBtn.classList.toggle("hidden", !hasItems);
  },

  showConfirmation(message, onConfirm) {
    const modalContent = this.elements.confirmModal.querySelector("p");
    modalContent.textContent = message;
    this.elements.confirmModal.classList.remove("hidden");

    if (this.confirmController) this.confirmController.abort();
    this.confirmController = new AbortController();
    const { signal } = this.confirmController;

    this.elements.confirmYes.addEventListener(
      "click",
      () => {
        this.hideConfirmation();
        onConfirm();
      },
      { signal }
    );
    this.elements.confirmNo.addEventListener(
      "click",
      () => this.hideConfirmation(),
      { signal }
    );
  },

  hideConfirmation() {
    this.elements.confirmModal.classList.add("hidden");
    if (this.confirmController) {
      this.confirmController.abort();
      this.confirmController = null;
    }
  },
};
