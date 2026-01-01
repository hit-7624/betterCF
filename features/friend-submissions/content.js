function isLoggedIn() {
  const header = document.querySelector('.lang-chooser');
  if (!header) return false;
  const links = header.querySelectorAll('a');
  for (const link of links) {
    if (link.href.includes('/profile/')) {
      return true;
    }
  }
  return false;
}

function getProblemInfo() {
  const url = window.location.pathname;
  
  let match = url.match(/\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)/);
  if (match) {
    return { contestId: parseInt(match[1]), problemIndex: match[2] };
  }
  
  match = url.match(/\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)/);
  if (match) {
    return { contestId: parseInt(match[1]), problemIndex: match[2] };
  }
  
  match = url.match(/\/gym\/(\d+)\/problem\/([A-Za-z0-9]+)/);
  if (match) {
    return { contestId: parseInt(match[1]), problemIndex: match[2] };
  }
  
  return null;
}

function getVerdictInfo(verdict) {
  const verdicts = {
    'OK': { text: 'Accepted', class: 'verdict-accepted', symbol: '✓' },
    'WRONG_ANSWER': { text: 'Wrong Answer', class: 'verdict-wrong', symbol: '✗' },
    'TIME_LIMIT_EXCEEDED': { text: 'TLE', class: 'verdict-wrong', symbol: '✗' },
    'MEMORY_LIMIT_EXCEEDED': { text: 'MLE', class: 'verdict-wrong', symbol: '✗' },
    'RUNTIME_ERROR': { text: 'Runtime Error', class: 'verdict-wrong', symbol: '✗' },
    'COMPILATION_ERROR': { text: 'CE', class: 'verdict-wrong', symbol: '✗' },
    'CHALLENGED': { text: 'Hacked', class: 'verdict-wrong', symbol: '✗' },
    'SKIPPED': { text: 'Skipped', class: 'verdict-waiting', symbol: '○' },
    'TESTING': { text: 'Testing', class: 'verdict-waiting', symbol: '...' },
    'PARTIAL': { text: 'Partial', class: 'verdict-partial', symbol: '◐' }
  };
  return verdicts[verdict] || { text: verdict || 'Unknown', class: 'verdict-waiting', symbol: '?' };
}

function formatDateTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

function getRatingColor(rating) {
  if (!rating) return '#000';
  if (rating >= 3000) return '#aa0000';
  if (rating >= 2600) return '#ff0000';
  if (rating >= 2400) return '#ff0000';
  if (rating >= 2300) return '#ff8c00';
  if (rating >= 2100) return '#ff8c00';
  if (rating >= 1900) return '#aa00aa';
  if (rating >= 1600) return '#0000ff';
  if (rating >= 1400) return '#03a89e';
  if (rating >= 1200) return '#008000';
  return '#808080';
}

function createSubmissionItem(data) {
  const { handle, submission, rating } = data;
  const verdict = getVerdictInfo(submission.verdict);
  const execTime = submission.timeConsumedMillis;
  const memory = (submission.memoryConsumedBytes / (1024 * 1024)).toFixed(1);
  const language = submission.programmingLanguage;
  const dateTime = formatDateTime(submission.creationTimeSeconds);
  const submissionUrl = `https://codeforces.com/contest/${submission.contestId}/submission/${submission.id}`;
  const profileUrl = `https://codeforces.com/profile/${handle}`;
  
  const ratingColor = getRatingColor(rating);
  const ratingDisplay = rating ? `(${rating})` : '';
  
  const item = document.createElement('div');
  item.className = 'cf-friends-submission-item';
  
  item.innerHTML = `
    <div class="cf-friends-handle">
      <a href="${profileUrl}" target="_blank" style="color: ${ratingColor}">${handle}</a>
      <span class="cf-friends-rating" style="color: ${ratingColor}">${ratingDisplay}</span>
    </div>
    <div class="cf-friends-verdict ${verdict.class}">
      <span class="verdict-symbol">${verdict.symbol}</span>
      <span class="verdict-text">${verdict.text}</span>
      <span class="verdict-lang">| ${language}</span>
    </div>
    <div class="cf-friends-stats">
      <span>${execTime}ms</span>
      <span>|</span>
      <span>${memory}MB</span>
    </div>
    <div class="cf-friends-time">
      <span class="cf-friends-datetime">${dateTime}</span>
    </div>
    <div class="cf-friends-link">
      <a href="${submissionUrl}" target="_blank">View Code →</a>
    </div>
  `;
  
  return item;
}

function createSidebarBlock() {
  const block = document.createElement('div');
  block.className = 'roundbox sidebox cf-friends-box';
  block.id = 'cf-friends-submissions-box';
  
  block.innerHTML = `
    <div class="roundbox-lt">&nbsp;</div>
    <div class="roundbox-rt">&nbsp;</div>
    <div class="caption titled">
      → Friends' Submissions
      <span class="cf-friends-toggle">▼</span>
    </div>
    <div class="cf-friends-content">
      <div class="cf-friends-loading">Loading...</div>
    </div>
    <div class="roundbox-lb">&nbsp;</div>
    <div class="roundbox-rb">&nbsp;</div>
  `;
  
  const caption = block.querySelector('.caption');
  const content = block.querySelector('.cf-friends-content');
  const toggle = block.querySelector('.cf-friends-toggle');
  
  content.style.display = 'none';
  toggle.textContent = '▶';
  
  caption.style.cursor = 'pointer';
  caption.addEventListener('click', () => {
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    toggle.textContent = isHidden ? '▼' : '▶';
  });
  
  return block;
}

function findInsertionPoint() {
  const sidebar = document.querySelector('#sidebar');
  if (!sidebar) return null;
  
  const firstBox = sidebar.querySelector('.roundbox.sidebox');
  return firstBox || null;
}

function updateBlockContent(block, submissions) {
  const content = block.querySelector('.cf-friends-content');
  content.innerHTML = '';
  
  if (submissions.length === 0) {
    content.innerHTML = '<div class="cf-friends-empty">No friends have submitted to this problem yet.</div>';
    return;
  }
  
  for (const data of submissions) {
    content.appendChild(createSubmissionItem(data));
  }
}

function showError(block, message) {
  const content = block.querySelector('.cf-friends-content');
  content.innerHTML = `<div class="cf-friends-error">${message}</div>`;
}

async function initFriendSubmissions() {
  if (!isLoggedIn()) {
    return;
  }
  
  const problemInfo = getProblemInfo();
  if (!problemInfo) {
    return;
  }
  
  const insertionPoint = findInsertionPoint();
  if (!insertionPoint) {
    return;
  }
  
  const block = createSidebarBlock();
  insertionPoint.parentNode.insertBefore(block, insertionPoint);
  
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_FRIENDS_SUBMISSIONS',
      contestId: problemInfo.contestId,
      problemIndex: problemInfo.problemIndex
    });
    
    if (response.success) {
      updateBlockContent(block, response.data);
    } else {
      showError(block, response.error || 'Failed to load submissions');
    }
  } catch (error) {
    showError(block, 'Unable to fetch friends submissions');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFriendSubmissions);
} else {
  initFriendSubmissions();
}

