const SUBMIT_DATA_KEY = 'betterCF_submitData';

function autofillSubmitForm() {
  const stored = localStorage.getItem(SUBMIT_DATA_KEY);
  if (!stored) return;
  
  const data = JSON.parse(stored);
  localStorage.removeItem(SUBMIT_DATA_KEY);
  
  const langSelect = document.querySelector('select[name="programTypeId"]');
  if (langSelect) {
    langSelect.value = data.languageId;
    langSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }
  
  const problemSelect = document.querySelector('select[name="submittedProblemIndex"]');
  if (problemSelect && data.problemIndex) {
    for (const option of problemSelect.options) {
      if (option.value.toUpperCase().endsWith(data.problemIndex.toUpperCase())) {
        problemSelect.value = option.value;
        problemSelect.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  }
  
  const toggleCheckbox = document.querySelector('#toggleEditorCheckbox');
  if (toggleCheckbox && toggleCheckbox.checked) {
    toggleCheckbox.click();
  }
  
  setTimeout(() => {
    const textarea = document.querySelector('#sourceCodeTextarea');
    if (textarea) {
      textarea.value = data.code;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    setTimeout(() => {
      const submitBtn = document.querySelector('input.submit[type="submit"], input[value="Submit"]');
      if (submitBtn) {
        submitBtn.click();
      }
    }, 100);
  }, 150);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autofillSubmitForm);
} else {
  autofillSubmitForm();
}

