chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "closeDomainTabs") {
    closeTabsWithDomain(message.domain);
  }
});

function closeTabsWithDomain(domain) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      try {
        const url = new URL(tab.url);
        if (url.hostname.includes(domain)) {
          chrome.tabs.remove(tab.id);
        }
      } catch (e) {
        // ignore invalid URLs like chrome://
      }
    });
  });
}
