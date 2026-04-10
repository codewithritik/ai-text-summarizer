// Popup script - simplified version without API key input

document.addEventListener('DOMContentLoaded', () => {
  const statusDiv = document.getElementById('status');

  // Show that extension is ready
  showStatus('Extension is ready to use!', 'success');

  // Show status message 
  function showStatus(message, type) {
    if (statusDiv) {
      statusDiv.textContent = message;
      statusDiv.className = `status-message ${type}`;

      // Auto-hide success messages after 3 seconds
      if (type === 'success') {
        setTimeout(() => {
          statusDiv.className = 'status-message';
          statusDiv.textContent = '';
        }, 3000);
      }
    }
  }
});
