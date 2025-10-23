chrome.action.onClicked.addListener(() => {
  closeTabsWithDomain("gitlab.com");
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "closeGitlabTabs") {
    closeTabsWithDomain("gitlab.com");
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
        // Ignore invalid URLs (like chrome://)
      }
    });
  });
}
