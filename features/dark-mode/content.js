let darkModeStyle = null;

chrome.storage.local.get(['theme'], (result) => {
  const theme = result.theme || 'dark';
  if (theme === 'dark') {
    applyDarkMode();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleTheme') {
    if (message.theme === 'dark') {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.theme) {
    if (changes.theme.newValue === 'dark') {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
  }
});

function applyDarkMode() {
  if (darkModeStyle) {
    darkModeStyle.remove();
  }

  darkModeStyle = document.createElement('style');
  darkModeStyle.id = 'bettercf-dark-mode';
  darkModeStyle.textContent = `
    html {
      background-color: #000000 !important;
    }
    
    body {
      filter: invert(1) hue-rotate(180deg) !important;
      background-color: #ffffff !important;
    }
    
    img, picture, video, iframe, canvas, svg,
    [style*="background-image"] {
      filter: invert(1) hue-rotate(-180deg) !important;
    }
    
    input, textarea, select {
      background-color: #2a2a2a !important;
      color: #e0e0e0 !important;
      border-color: #555 !important;
    }
    
    button {
      background-color: #2a2a2a !important;
      color: #e0e0e0 !important;
    }
    
    ::-webkit-scrollbar {
      background: #2a2a2a !important;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #555 !important;
    }
    
    ::selection {
      background-color: #3391ff !important;
      color: #ffffff !important;
    }
  `;

  if (document.head) {
    document.head.appendChild(darkModeStyle);
  } else {
    const observer = new MutationObserver(() => {
      if (document.head) {
        document.head.appendChild(darkModeStyle);
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
}

function removeDarkMode() {
  if (darkModeStyle) {
    darkModeStyle.remove();
    darkModeStyle = null;
  }
}

