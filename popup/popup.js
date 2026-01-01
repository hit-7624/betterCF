document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const apiSecretInput = document.getElementById('apiSecret');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');

  chrome.storage.sync.get(['cfApiKey', 'cfApiSecret'], (result) => {
    if (result.cfApiKey) {
      apiKeyInput.value = result.cfApiKey;
    }
    if (result.cfApiSecret) {
      apiSecretInput.value = result.cfApiSecret;
    }
  });

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

