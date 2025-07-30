document.addEventListener('DOMContentLoaded', () => {
  const tabsListEl = document.getElementById('youtube-tabs-list');
  const toggleBtn = document.getElementById('toggle-btn');
  const downloadLogBtn = document.getElementById('download-log-btn');
  const editLogBtn = document.getElementById('edit-log-btn');
  const cleanUrlToggle = document.getElementById('clean-url-toggle');

  function refreshTabs() {
    scanAndDisplayTabs();
  }
  chrome.tabs.onCreated.addListener(refreshTabs);
  chrome.tabs.onRemoved.addListener(refreshTabs);
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url || changeInfo.title) {
      refreshTabs();
    }
  });

  function updateToggleButtonUI(enabled) {
    const isOnline = enabled !== false;
    toggleBtn.textContent = isOnline ? "Online" : "Offline";
    toggleBtn.className = isOnline ? "online" : "offline";
    if (!isOnline) {
      chrome.storage.local.set({ checkedTabs: [] });
    }
  }

  toggleBtn.addEventListener('click', () => {
    chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
      chrome.storage.local.set({ enabled: !enabled });
    });
  });

  downloadLogBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'downloadLog' });
  });

  editLogBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("edit.html") });
  });

  cleanUrlToggle.addEventListener('change', () => {
    chrome.storage.local.set({ useCleanUrl: cleanUrlToggle.checked });
  });

  function scanAndDisplayTabs() {
    chrome.storage.local.get({ enabled: true, checkedTabs: [] }, (data) => {
      const isOnline = data.enabled !== false;
      const checkedTabs = data.checkedTabs;
      const queryOptions = { url: "*://*.youtube.com/watch?v=*" };
      chrome.tabs.query(queryOptions, (tabs) => {
        tabsListEl.innerHTML = '';
        if (tabs.length === 0) {
          tabsListEl.innerHTML = '<li>No active YouTube video tabs found.</li>';
          return;
        }
        tabs.forEach(tab => {
          const listItem = document.createElement('li');
          listItem.className = 'tab-item';
          const titleSpan = document.createElement('span');
          titleSpan.className = 'tab-title';
          titleSpan.textContent = tab.title;
          titleSpan.title = tab.title;
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'tab-checkbox';
          checkbox.disabled = !isOnline;
          checkbox.checked = checkedTabs.includes(tab.id);
          checkbox.addEventListener('change', () => {
            if (checkbox.disabled) return;
            chrome.storage.local.get({ checkedTabs: [] }, (currentData) => {
              let currentChecked = currentData.checkedTabs;
              if (checkbox.checked) {
                if (!currentChecked.includes(tab.id)) {
                  currentChecked.push(tab.id);
                  chrome.runtime.sendMessage({ action: 'sendUrl', url: tab.url, title: tab.title });
                }
              } else {
                currentChecked = currentChecked.filter(id => id !== tab.id);
              }
              chrome.storage.local.set({ checkedTabs: currentChecked });
            });
          });
          listItem.appendChild(titleSpan);
          listItem.appendChild(checkbox);
          tabsListEl.appendChild(listItem);
        });
      });
    });
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
      if (changes.enabled !== undefined) {
        updateToggleButtonUI(changes.enabled.newValue);
        refreshTabs(); 
      }
      if (changes.checkedTabs) {
        refreshTabs();
      }
      if (changes.useCleanUrl !== undefined) {
        cleanUrlToggle.checked = changes.useCleanUrl.newValue;
      }
    }
  });

  chrome.storage.local.get({ enabled: true, useCleanUrl: false }, (data) => {
    updateToggleButtonUI(data.enabled);
    cleanUrlToggle.checked = data.useCleanUrl;
    refreshTabs();
  });
});