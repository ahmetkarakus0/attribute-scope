document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("buttonVisibility");

  // Load saved state
  chrome.storage.sync.get(["buttonVisible"], function (result) {
    checkbox.checked = result.buttonVisible !== false;
  });

  // Save state on change
  checkbox.addEventListener("change", function () {
    chrome.storage.sync.set({ buttonVisible: checkbox.checked });

    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleButtonVisibility",
        visible: checkbox.checked,
      });
    });
  });
});
