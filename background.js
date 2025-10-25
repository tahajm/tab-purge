chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "closeDomainTabs") {
    closeTabsWithDomain(message.domain);
  }
});

function closeTabsWithDomain(domain) {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      try {
        if (tab.url.includes(domain)) {
          chrome.tabs.remove(tab.id);
        }
      } catch (e) {
        // ignore invalid URLs like chrome://
      }
    });
  });
}
