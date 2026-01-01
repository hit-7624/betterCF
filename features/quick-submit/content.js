const LANGUAGES = [
  { id: '89', name: 'GNU C++23 64bit' },
  { id: '91', name: 'GNU C++20 64bit' },
  { id: '54', name: 'GNU C++17 64bit' },
  { id: '73', name: 'GNU C++17 32bit' },
  { id: '31', name: 'Python 3' },
  { id: '70', name: 'PyPy 3-64' },
  { id: '87', name: 'Java 21' },
  { id: '83', name: 'Kotlin 1.9' },
  { id: '75', name: 'Rust 2021' },
  { id: '32', name: 'Go' }
];

const SUBMIT_DATA_KEY = 'betterCF_submitData';

function getProblemInfo() {
  const url = window.location.pathname;
  
  let match = url.match(/\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)/);
  if (match) {
    return { contestId: match[1], problemIndex: match[2], type: 'contest' };
  }
  
  match = url.match(/\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)/);
  if (match) {
    return { contestId: match[1], problemIndex: match[2], type: 'problemset' };
  }
  
  match = url.match(/\/gym\/(\d+)\/problem\/([A-Za-z0-9]+)/);
  if (match) {
    return { contestId: match[1], problemIndex: match[2], type: 'gym' };
  }
  
  return null;
}

function getSubmitUrl(problemInfo) {
  if (problemInfo.type === 'problemset') {
    return `https://codeforces.com/problemset/submit`;
  }
  if (problemInfo.type === 'gym') {
    return `https://codeforces.com/gym/${problemInfo.contestId}/submit`;
  }
  return `https://codeforces.com/contest/${problemInfo.contestId}/submit`;
}

function handleSubmit(problemInfo) {
  const langSelect = document.getElementById('submit-shortcut-lang');
  const codeArea = document.getElementById('submit-shortcut-code');
  
  if (!codeArea.value.trim()) {
    alert('Please enter your code');
    return;
  }
  
  localStorage.setItem('betterCF_lastLang', langSelect.value);
  
  const submitData = {
    languageId: langSelect.value,
    code: codeArea.value,
    contestId: problemInfo.contestId,
    problemIndex: problemInfo.problemIndex
  };
  
  localStorage.setItem(SUBMIT_DATA_KEY, JSON.stringify(submitData));
  window.open(getSubmitUrl(problemInfo), '_blank');
}

function createSubmitBox(problemInfo) {
  const box = document.createElement('div');
  box.className = 'roundbox';
  box.id = 'submit-shortcut-box';
  
  const savedLang = localStorage.getItem('betterCF_lastLang') || '89';
  
  const languageOptions = LANGUAGES.map(lang => 
    `<option value="${lang.id}" ${lang.id === savedLang ? 'selected' : ''}>${lang.name}</option>`
  ).join('');
  
  box.innerHTML = `
    <div class="roundbox-lt">&nbsp;</div>
    <div class="roundbox-rt">&nbsp;</div>
    <div class="caption titled submit-shortcut-caption">
      → Quick Submit
      <span class="submit-shortcut-toggle">▶</span>
    </div>
    <div class="submit-shortcut-content" style="display: none;">
      <table class="submit-shortcut-table">
        <tr>
          <td class="submit-shortcut-label">Language:</td>
          <td>
            <select id="submit-shortcut-lang" class="submit-shortcut-select">
              ${languageOptions}
            </select>
          </td>
        </tr>
        <tr>
          <td class="submit-shortcut-label" style="vertical-align: top; padding-top: 8px;">Source code:</td>
          <td>
            <textarea id="submit-shortcut-code" class="submit-shortcut-textarea" placeholder="Paste your code here..." spellcheck="false"></textarea>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <input type="submit" class="submit submit-shortcut-btn" value="Submit">
          </td>
        </tr>
      </table>
    </div>
    <div class="roundbox-lb">&nbsp;</div>
    <div class="roundbox-rb">&nbsp;</div>
  `;
  
  const caption = box.querySelector('.submit-shortcut-caption');
  const content = box.querySelector('.submit-shortcut-content');
  const toggle = box.querySelector('.submit-shortcut-toggle');
  
  caption.addEventListener('click', () => {
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    toggle.textContent = isHidden ? '▼' : '▶';
  });
  
  const submitBtn = box.querySelector('.submit-shortcut-btn');
  submitBtn.addEventListener('click', () => handleSubmit(problemInfo));
  
  return box;
}

function insertSubmitBox() {
  const problemInfo = getProblemInfo();
  if (!problemInfo) return;
  
  const problemStatement = document.querySelector('.problem-statement');
  if (!problemStatement) return;
  
  if (document.getElementById('submit-shortcut-box')) return;
  
  const box = createSubmitBox(problemInfo);
  problemStatement.parentNode.insertBefore(box, problemStatement.nextSibling);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', insertSubmitBox);
} else {
  insertSubmitBox();
}

