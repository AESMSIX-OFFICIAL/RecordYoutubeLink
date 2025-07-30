let isEnabled = true;
let useCleanUrl = false;

function appendUrlToLog(url, title) {
  if (!isEnabled) {
    console.warn("Logging aborted: extension is offline.");
    return;
  }
  let finalUrlToLog = url;
  let videoId = null;
  if (useCleanUrl && url.includes("watch?v=")) {
    try {
      const urlObject = new URL(url);
      videoId = urlObject.searchParams.get('v');
      if (videoId) {
        finalUrlToLog = `${urlObject.origin}${urlObject.pathname}?v=${videoId}`;
      }
    } catch (error) {
      console.error("Failed to parse URL, using original URL:", error);
      finalUrlToLog = url;
    }
  }
  chrome.storage.local.get({ [LOG_KEY]: "" }, (data) => {
    const currentLog = data[LOG_KEY];
    if (videoId && useCleanUrl) {
      if (currentLog.includes(`?v=${videoId} |`)) {
        console.log("🚫 Duplicate YouTube video ID found, skipping:", videoId);
        return;
      }
    } else {
      if (currentLog.includes(finalUrlToLog + " |")) {
        console.log("🚫 Duplicate found, skipping:", finalUrlToLog);
        return;
      }
    }
    const newLogEntry = `${finalUrlToLog} | ${title}\n`;
    const updatedLog = currentLog + newLogEntry;
    chrome.storage.local.set({ [LOG_KEY]: updatedLog }, () => {
      console.log("🔗 URL and Title saved to log:", newLogEntry.trim());
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendUrl" && request.url && request.title) {
    appendUrlToLog(request.url, request.title);
  } else if (request.action === 'videoChanged') {
    if (sender.tab && sender.tab.id !== undefined) {
      const tabId = sender.tab.id;
      chrome.storage.local.get({ checkedTabs: [] }, ({ checkedTabs }) => {
        if (checkedTabs.includes(tabId)) {
          console.log(`▶️ Content in tab ${tabId} changed and checked. Saving new URL and Title...`);
          appendUrlToLog(request.url, request.title || sender.tab.title || 'No Title');
        }
      });
    }
  } else if (request.action === "downloadLog") {
    chrome.storage.local.get({ [LOG_KEY]: "" }, (data) => {
      const logContent = data[LOG_KEY];
      const blob = new Blob([logContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: "youtube_urls.txt",
        saveAs: true
      }, () => {
        URL.revokeObjectURL(url);
      });
    });
  } else if (request.action === "getLog") {
    chrome.storage.local.get({ [LOG_KEY]: "" }, (data) => {
      sendResponse({ log: data[LOG_KEY] });
    });
    return true; 
  } else if (request.action === "saveLog") {
    chrome.storage.local.set({ [LOG_KEY]: request.log }, () => {
      console.log("Log saved successfully.");
      sendResponse({ success: true });
    });
    return true; 
  }
});

chrome.storage.local.get(["enabled", "useCleanUrl"], (data) => {
  isEnabled = data.enabled !== false;
  useCleanUrl = data.useCleanUrl || false;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.enabled !== undefined) {
      isEnabled = changes.enabled.newValue;
      console.log(`Extension is now: ${isEnabled ? 'ONLINE' : 'OFFLINE'}`);
    }
    if (changes.useCleanUrl !== undefined) {
      useCleanUrl = changes.useCleanUrl.newValue;
      console.log(`URL Cleaning is now: ${useCleanUrl ? 'CLEAN' : 'ORIGINAL'}`);
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.local.get({ checkedTabs: [] }, ({ checkedTabs }) => {
    const index = checkedTabs.indexOf(tabId);
    if (index > -1) {
      checkedTabs.splice(index, 1);
      chrome.storage.local.set({ checkedTabs: checkedTabs });
      console.log(`🧹 Tab ${tabId} closed, removed from the checklist.`);
    }
  });
});