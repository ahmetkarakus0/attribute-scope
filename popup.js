document.addEventListener("DOMContentLoaded", function () {
  const buttonVisibility = document.getElementById("buttonVisibility");
  const javaSmartCopy = document.getElementById("javaSmartCopy");
  const attributeName = document.getElementById("attributeName");
  const setAttributeName = document.getElementById("setAttributeName");
  // Load saved state
  chrome.storage.sync.get(
    ["buttonVisible", "javaSmartCopy", "attributeName"],
    function (result) {
      buttonVisibility.checked = result.buttonVisible !== false;
      javaSmartCopy.checked = result.javaSmartCopy !== false;
      attributeName.value = result.attributeName || "data-test-id";
    }
  );

  // Save state on change
  buttonVisibility.addEventListener("change", function () {
    chrome.storage.sync.set({ buttonVisible: buttonVisibility.checked });

    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleButtonVisibility",
        visible: buttonVisibility.checked,
      });
    });
  });

  javaSmartCopy.addEventListener("change", function () {
    chrome.storage.sync.set({ javaSmartCopy: javaSmartCopy.checked });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleJavaSmartCopy",
        enabled: javaSmartCopy.checked,
      });
    });
  });

  setAttributeName.addEventListener("click", function () {
    chrome.storage.sync.set({ attributeName: attributeName.value });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateAttributeName",
        attributeName: attributeName.value,
      });
    });
  });
});
