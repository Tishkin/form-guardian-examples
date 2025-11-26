import { attachFormAutosave } from '@form-guardian/dom';

const form = document.getElementById('contact-form');
const statusDiv = document.getElementById('status');
const draftInfoDiv = document.getElementById('draft-info');
const clearBtn = document.getElementById('clear-btn');

function showStatus(message, type = 'info') {
  if (message) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = '';
      statusDiv.style.display = 'none';
    }, 3000);
  } else {
    statusDiv.textContent = '';
    statusDiv.className = '';
    statusDiv.style.display = 'none';
  }
}

function updateDraftInfo(hasDraft, timestamp) {
  if (hasDraft && timestamp) {
    const date = new Date(timestamp);
    draftInfoDiv.innerHTML = `
      <strong>Draft saved:</strong> ${date.toLocaleString()}
    `;
    draftInfoDiv.className = 'draft-info';
    draftInfoDiv.style.display = 'block';
  } else {
    draftInfoDiv.innerHTML = '';
    draftInfoDiv.className = '';
    draftInfoDiv.style.display = 'none';
  }
}

const autosave = attachFormAutosave({
  formId: 'contact-form-vanilla',
  root: form,
  autoRestore: true,
  debounceMs: 500,
  blacklist: ['input[type="password"]'],
  onBeforeSave: async (values) => {
    console.log('💾 About to save draft:', values);
  },
  onAfterSave: async (values) => {
    console.log('✅ Draft saved successfully:', values);
    showStatus('Draft saved successfully', 'success');
    const meta = await autosave.getDraftMeta();
    if (meta) {
      updateDraftInfo(true, meta.updatedAt);
    }
  },
  onBeforeRestore: async (values) => {
    console.log('🔄 About to restore draft:', values);
  },
  onAfterRestore: async (values) => {
    console.log('✅ Draft restored successfully:', values);
    showStatus('Draft restored successfully', 'success');
    const meta = await autosave.getDraftMeta();
    if (meta) {
      updateDraftInfo(true, meta.updatedAt);
    }
  },
  onDraftExpired: async (draftId) => {
    console.log('⏰ Draft expired:', draftId);
    showStatus('Draft expired', 'info');
    updateDraftInfo(false);
  },
});

// Check for existing draft on load
autosave.hasDraft().then((hasDraft) => {
  if (hasDraft) {
    autosave.getDraftMeta().then((meta) => {
      if (meta) {
        updateDraftInfo(true, meta.updatedAt);
      }
    });
  }
});

// Update draft info periodically
const interval = setInterval(async () => {
  const hasDraft = await autosave.hasDraft();
  if (hasDraft) {
    const meta = await autosave.getDraftMeta();
    if (meta) {
      updateDraftInfo(true, meta.updatedAt);
    } else {
      updateDraftInfo(false);
    }
  } else {
    updateDraftInfo(false);
  }
}, 1000);

const handleClear = async () => {
  await autosave.clear();
  updateDraftInfo(false);
  
  // Clear form
  form.reset();
  
  showStatus('Draft cleared successfully', 'success');
};

const handleSubmit = async (e) => {
  e.preventDefault();

  await new Promise(resolve => setTimeout(resolve, 500));

  await autosave.clear();
  updateDraftInfo(false);

  // Clear form
  form.reset();

  showStatus('Form submitted successfully', 'success');
};

clearBtn.addEventListener('click', handleClear);
form.addEventListener('submit', handleSubmit);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  clearInterval(interval);
});

