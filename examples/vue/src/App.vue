<template>
  <div class="container">
    <div class="example-container">
      <h1>Form Guardian - Vue Example</h1>
      <p class="subtitle">Form autosave with Vue 3</p>

      <form ref="formRef" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            v-model="formData.name"
            class="input"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            v-model="formData.email"
            class="input"
            required
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            v-model="formData.phone"
            class="input"
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        <div class="form-group">
          <label for="message">Message</label>
          <textarea
            id="message"
            name="message"
            v-model="formData.message"
            class="textarea"
            placeholder="Enter your message..."
          />
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              name="newsletter"
              v-model="formData.newsletter"
            />
            Subscribe to newsletter
          </label>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              name="terms"
              v-model="formData.terms"
              required
            />
            I agree to the terms and conditions *
          </label>
        </div>

        <div class="buttons">
          <button type="submit" class="button button-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
          <button type="button" class="button button-danger" @click="handleClearDraft">
            Clear Draft
          </button>
        </div>
      </form>

      <div v-if="status" :class="['status', statusClass]">{{ status }}</div>

      <div v-if="hasDraft && updatedAt" class="draft-info">
        <strong>Draft saved:</strong> {{ formatDate(updatedAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { attachFormAutosave } from '@form-guardian/dom';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  newsletter: boolean;
  terms: boolean;
}

const formRef = ref<HTMLFormElement | null>(null);
const formData = ref<FormData>({
  name: '',
  email: '',
  phone: '',
  message: '',
  newsletter: false,
  terms: false,
});

const status = ref('');
const statusClass = ref<'success' | 'error'>('success');
const hasDraft = ref(false);
const updatedAt = ref<number | null>(null);
const isSubmitting = ref(false);

let autosave: ReturnType<typeof attachFormAutosave<FormData>> | null = null;
let draftCheckInterval: number | null = null;

onMounted(() => {
  if (!formRef.value) return;

  autosave = attachFormAutosave<FormData>({
    formId: 'vue-example',
    root: formRef.value,
    autoRestore: true,
    debounceMs: 500,
    onAfterSave: async () => {
      status.value = 'Draft saved successfully';
      statusClass.value = 'success';
      setTimeout(() => {
        status.value = '';
      }, 3000);
      await updateDraftInfo();
    },
    onAfterRestore: async () => {
      status.value = 'Draft restored successfully';
      statusClass.value = 'success';
      setTimeout(() => {
        status.value = '';
      }, 3000);
      await updateDraftInfo();
    },
    onDraftExpired: async () => {
      status.value = 'Draft expired';
      statusClass.value = 'error';
      setTimeout(() => {
        status.value = '';
      }, 3000);
      hasDraft.value = false;
      updatedAt.value = null;
    },
  });

  updateDraftInfo();

  draftCheckInterval = window.setInterval(async () => {
    await updateDraftInfo();
  }, 1000);
});

onUnmounted(() => {
  if (autosave) {
    autosave.destroy();
  }
  if (draftCheckInterval) {
    clearInterval(draftCheckInterval);
  }
});

async function updateDraftInfo() {
  if (!autosave) return;
  const exists = await autosave.hasDraft();
  hasDraft.value = exists;
  if (exists) {
    const meta = await autosave.getDraftMeta();
    if (meta) {
      updatedAt.value = meta.updatedAt;
    } else {
      updatedAt.value = null;
    }
  } else {
    updatedAt.value = null;
  }
}

async function handleSubmit() {
  isSubmitting.value = true;
  console.log('Form submitted:', formData.value);

  await new Promise(resolve => setTimeout(resolve, 500));

  if (autosave) {
    await autosave.clear();
  }

  // Clear form data
  formData.value = {
    name: '',
    email: '',
    phone: '',
    message: '',
    newsletter: false,
    terms: false,
  };

  hasDraft.value = false;
  updatedAt.value = null;
  isSubmitting.value = false;

  status.value = 'Form submitted successfully';
  statusClass.value = 'success';
  setTimeout(() => {
    status.value = '';
  }, 3000);
}

async function handleClearDraft() {
  if (!autosave) return;

  await autosave.clear();
  hasDraft.value = false;
  updatedAt.value = null;

  // Clear form data
  formData.value = {
    name: '',
    email: '',
    phone: '',
    message: '',
    newsletter: false,
    terms: false,
  };

  status.value = 'Draft cleared successfully';
  statusClass.value = 'success';
  setTimeout(() => {
    status.value = '';
  }, 3000);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}
</script>

