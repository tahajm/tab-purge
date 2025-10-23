// popup.js
document.getElementById("close").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "closeGitlabTabs" });
});
