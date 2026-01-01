document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const apiSecretInput = document.getElementById('apiSecret');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  chrome.storage.sync.get(['cfApiKey', 'cfApiSecret'], (result) => {
    if (result.cfApiKey) {
      apiKeyInput.value = result.cfApiKey;
    }
    if (result.cfApiSecret) {
      apiSecretInput.value = result.cfApiSecret;
    }
  });

  chrome.storage.local.get(['theme'], (result) => {
    const theme = result.theme || 'dark';
    applyTheme(theme);
  });

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    chrome.storage.local.set({ theme: newTheme });
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleTheme', theme: newTheme });
      }
    });
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const apiSecret = apiSecretInput.value.trim();

    if (!apiKey || !apiSecret) {
      status.textContent = 'Please enter both API key and secret';
      status.className = 'status error';
      return;
    }

    chrome.storage.sync.set({
      cfApiKey: apiKey,
      cfApiSecret: apiSecret
    }, () => {
      status.textContent = 'Settings saved! Refresh the problem page.';
      status.className = 'status success';
      
      setTimeout(() => {
        status.className = 'status';
      }, 3000);
    });
  });
});
