// UI manipulation functions

const UI = {
  elements: {},
  
  // Initialize UI elements
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
      confirmNo: document.getElementById("confirmNo")
    };
  },
  
  // Show error message
  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.classList.add("show");
  },
  
  // Hide error message
  hideError() {
    this.elements.errorMessage.textContent = "";
    this.elements.errorMessage.classList.remove("show");
  },
  
  // Show add form
  showAddForm() {
    this.elements.addFormContainer.classList.remove("hidden");
    this.elements.toggleAddBtn.style.display = "none";
    this.elements.domainInput.focus();
  },
  
  // Hide add form
  hideAddForm() {
    this.elements.addFormContainer.classList.add("hidden");
    this.elements.toggleAddBtn.style.display = "flex";
    this.elements.domainInput.value = "";
    this.elements.titleInput.value = "";
    this.hideError();
  },
  
  // Create a domain item element
  createDomainItem(domainObj) {
    const div = document.createElement("div");
    div.className = "domain-item";
    div.dataset.id = domainObj.id;

    // Create name container
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

    // Create button container
    const btnContainer = document.createElement("div");
    btnContainer.className = "button-container";

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.className = "close-btn";
    closeBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "closeDomainTabs", domain: domainObj.domain });
    });

    // Menu button
    const menuBtn = document.createElement("button");
    menuBtn.textContent = "⋮";
    menuBtn.className = "menu-btn";
    menuBtn.title = "More options";
    
    // Dropdown menu
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
    
    // Toggle dropdown
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close all other open dropdowns
      document.querySelectorAll(".dropdown-menu.show").forEach(menu => {
        if (menu !== dropdown) menu.classList.remove("show");
      });
      dropdown.classList.toggle("show");
    });
    
    // Menu wrapper
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
  
  // Add domain to UI
  addDomainToUI(domainObj) {
    const domainElement = this.createDomainItem(domainObj);
    this.elements.domainListDiv.appendChild(domainElement);
    this.updateCloseAllButton();
  },
  
  // Remove domain from UI
  removeDomainItem(id, domainElement) {
    removeDomain(id, () => {
      domainElement.remove();
      this.updateCloseAllButton();
    });
  },
  
  // Get input values
  getInputValues() {
    return {
      domain: sanitizeDomain(this.elements.domainInput.value),
      title: this.elements.titleInput.value.trim()
    };
  },
  
  // Update Close All button visibility
  updateCloseAllButton() {
    if (this.elements.domainListDiv.children.length > 0) {
      this.elements.closeAllBtn.classList.remove("hidden");
    } else {
      this.elements.closeAllBtn.classList.add("hidden");
    }
  },
  
  // Show confirmation modal
  showConfirmation(message, onConfirm) {
    const modalContent = this.elements.confirmModal.querySelector("p");
    modalContent.textContent = message;
    
    this.elements.confirmModal.classList.remove("hidden");
    
    // Remove old listeners
    const newYesBtn = this.elements.confirmYes.cloneNode(true);
    const newNoBtn = this.elements.confirmNo.cloneNode(true);
    this.elements.confirmYes.replaceWith(newYesBtn);
    this.elements.confirmNo.replaceWith(newNoBtn);
    
    // Update references
    this.elements.confirmYes = newYesBtn;
    this.elements.confirmNo = newNoBtn;
    
    // Add new listeners
    this.elements.confirmYes.addEventListener("click", () => {
      this.hideConfirmation();
      onConfirm();
    });
    
    this.elements.confirmNo.addEventListener("click", () => {
      this.hideConfirmation();
    });
  },
  
  // Hide confirmation modal
  hideConfirmation() {
    this.elements.confirmModal.classList.add("hidden");
  }
};

