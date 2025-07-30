document.addEventListener('DOMContentLoaded', () => {
  const logContentTextArea = document.getElementById('log-content');
  const saveLogBtn = document.getElementById('save-log-btn');
  const clearLogBtn = document.getElementById('clear-log-btn');
  const closeEditBtn = document.getElementById('close-edit-btn');
  const searchBox = document.getElementById('search-box');
  const themeToggleBtn = document.getElementById('theme-toggle');
  let fullLogContent = "";

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggleBtn.textContent = '☀️'; 
    } else {
      document.body.classList.remove('dark-mode');
      themeToggleBtn.textContent = '🌙'; 
    }
  };
  themeToggleBtn.addEventListener('click', () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const newTheme = isDarkMode ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  });
  const savedTheme = localStorage.getItem('theme') || 'light'; 
  applyTheme(savedTheme);
  chrome.runtime.sendMessage({ action: 'getLog' }, (response) => {
    if (response && response.log) {
      fullLogContent = response.log;
      logContentTextArea.value = fullLogContent;
    }
  });
  searchBox.addEventListener('input', () => {
    const query = searchBox.value.toLowerCase();
    if (!query) {
      logContentTextArea.value = fullLogContent;
      return;
    }
    const lines = fullLogContent.split('\n');
    const filteredLines = lines.filter(line => line.toLowerCase().includes(query));
    logContentTextArea.value = filteredLines.join('\n');
  });
  saveLogBtn.addEventListener('click', () => {
    const newLogContent = logContentTextArea.value;
    chrome.runtime.sendMessage({ action: 'saveLog', log: newLogContent }, (response) => {
      if (response && response.success) {
        fullLogContent = newLogContent; 
        alert('Log saved successfully!');
      } else {
        alert('Failed to save log.');
      }
    });
  });
  clearLogBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete the entire log? This cannot be undone.')) {
      chrome.runtime.sendMessage({ action: 'saveLog', log: "" }, (response) => {
        if (response && response.success) {
          fullLogContent = "";
          logContentTextArea.value = "";
          searchBox.value = "";
          alert('Log cleared successfully!');
        } else {
          alert('Failed to clear log.');
        }
      });
    }
  });
  closeEditBtn.addEventListener('click', () => {
    window.close();
  });
});