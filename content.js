// Content script to detect text selection and show Summary button

let summaryButton = null;
let selectedText = '';

// Create and style the Summary button
function createSummaryButton() {
  if (summaryButton) {
    return summaryButton;
  }

  summaryButton = document.createElement('div');
  summaryButton.id = 'ai-summary-button';
  summaryButton.textContent = 'Summary';
  summaryButton.className = 'ai-summary-button';
  
  summaryButton.addEventListener('click', handleSummaryClick);
  
  document.body.appendChild(summaryButton);
  return summaryButton;
}

// Show button near selected text
function showSummaryButton(event) {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  if (text.length === 0) {
    hideSummaryButton();
    return;
  }
  
  selectedText = text;
  
  console.log('this is selectedText:', selectedText);
  const button = createSummaryButton();
  
  // Position button near selection
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  button.style.display = 'block';
  button.style.top = `${rect.top + window.scrollY - 45}px`;
  button.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 50}px`;
}

// Hide the button
function hideSummaryButton() {
  if (summaryButton) {
    summaryButton.style.display = 'none';
  }
  console.log('this is selectedText after hide:', selectedText);
  // selectedText = '';
}

// Handle summary button click
async function handleSummaryClick(e) {
  e.stopPropagation();
  
  console.log('Selected text:', selectedText);
  if (!selectedText) {
    console.log('No selected text');
    return;
  }
  console.log('Selected text after check:', selectedText);

  // Hide the summary button
  hideSummaryButton();

  // Show loader
  showLoader();

  // Send message to background script to get summary
  try {
    chrome.runtime.sendMessage({
      action: 'summarize',
      text: selectedText
    }, (response) => {
      console.log('Response from background:', response);
      
      // Hide loader
      hideLoader();
      
      // Check for Chrome runtime errors
      if (chrome.runtime.lastError) {
        console.error('Chrome runtime error:', chrome.runtime.lastError);
        showSummaryPopup(`Error: ${chrome.runtime.lastError.message || 'Failed to communicate with extension'}`);
        return;
      }
      
      if (response && response.summary) {
        showSummaryPopup(response.summary);
      } else if (response && response.error) {
        showSummaryPopup(`Error: ${response.error}`);
      } else {
        showSummaryPopup('Error: No response from server. Please try again.');
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    hideLoader();
    showSummaryPopup(`Error: ${error.message || 'Failed to send request'}`);
  }
}

// Show summary popup
function showSummaryPopup(summary) {
  // Remove existing popup if any
  const existingPopup = document.getElementById('ai-summary-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create popup
  const popup = document.createElement('div');
  popup.id = 'ai-summary-popup';
  popup.className = 'ai-summary-popup';
  
  popup.innerHTML = `
    <div class="ai-summary-popup-header">
      <h3>Summary</h3>
      <button class="ai-summary-close" id="ai-summary-close-btn">×</button>
    </div>
    <div class="ai-summary-content">
      <p id="ai-summary-text">${summary}</p>
    </div>
    <div class="ai-summary-popup-footer">
      <button class="ai-summary-copy" id="ai-summary-copy-btn">Copy</button>
      <button class="ai-summary-close-btn" id="ai-summary-close-btn-footer">Close</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Close button handlers
  const closeBtn = popup.querySelector('#ai-summary-close-btn');
  const closeBtnFooter = popup.querySelector('#ai-summary-close-btn-footer');
  
  closeBtn.addEventListener('click', () => popup.remove());
  closeBtnFooter.addEventListener('click', () => popup.remove());

  // Copy button handler
  const copyBtn = popup.querySelector('#ai-summary-copy-btn');
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(summary).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    });
  });

  // Close on outside click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.remove();
    }
  });

  // Close on Escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      popup.remove();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// Listen for text selection
document.addEventListener('mouseup', showSummaryButton);
document.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    hideSummaryButton();
  } else {
    showSummaryButton(e);
  }
});

// Show loader overlay
function showLoader() {
  // Remove existing loader if any
  const existingLoader = document.getElementById('ai-summary-loader');
  if (existingLoader) {
    existingLoader.remove();
  }

  // Create loader overlay
  const loader = document.createElement('div');
  loader.id = 'ai-summary-loader';
  loader.className = 'ai-summary-loader';
  
  loader.innerHTML = `
    <div class="ai-summary-loader-content">
      <div class="ai-summary-spinner"></div>
      <p class="ai-summary-loader-text">Generating summary...</p>
    </div>
  `;

  document.body.appendChild(loader);
}

// Hide loader overlay
function hideLoader() {
  const loader = document.getElementById('ai-summary-loader');
  if (loader) {
    loader.remove();
  }
}

// Hide button when clicking elsewhere
document.addEventListener('mousedown', (e) => {
  if (summaryButton && !summaryButton.contains(e.target)) {
    const selection = window.getSelection();
    if (selection.toString().trim().length === 0) {
      hideSummaryButton();
    }
  }
});

