<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { attachFormAutosave } from '@form-guardian/dom';

  interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
    newsletter: boolean;
    terms: boolean;
  }

  let formRef: HTMLFormElement;
  let formData: FormData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    newsletter: false,
    terms: false,
  };

  let status = '';
  let statusClass: 'success' | 'error' = 'success';
  let hasDraft = false;
  let updatedAt: number | null = null;
  let isSubmitting = false;

  let autosave: ReturnType<typeof attachFormAutosave<FormData>> | null = null;
  let draftCheckInterval: number | null = null;

  onMount(() => {
    if (!formRef) return;

    autosave = attachFormAutosave<FormData>({
      formId: 'svelte-example',
      root: formRef,
      autoRestore: true,
      debounceMs: 500,
      onAfterSave: async () => {
        status = 'Draft saved successfully';
        statusClass = 'success';
        setTimeout(() => {
          status = '';
        }, 3000);
        await updateDraftInfo();
      },
      onAfterRestore: async () => {
        status = 'Draft restored successfully';
        statusClass = 'success';
        setTimeout(() => {
          status = '';
        }, 3000);
        await updateDraftInfo();
      },
      onDraftExpired: async () => {
        status = 'Draft expired';
        statusClass = 'error';
        setTimeout(() => {
          status = '';
        }, 3000);
        hasDraft = false;
        updatedAt = null;
      },
    });

    updateDraftInfo();

    draftCheckInterval = window.setInterval(async () => {
      await updateDraftInfo();
    }, 1000);
  });

  onDestroy(() => {
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
    hasDraft = exists;
    if (exists) {
      const meta = await autosave.getDraftMeta();
      if (meta) {
        updatedAt = meta.updatedAt;
      } else {
        updatedAt = null;
      }
    } else {
      updatedAt = null;
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    console.log('Form submitted:', formData);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (autosave) {
      await autosave.clear();
    }

    // Clear form data
    formData = {
      name: '',
      email: '',
      phone: '',
      message: '',
      newsletter: false,
      terms: false,
    };

    hasDraft = false;
    updatedAt = null;
    isSubmitting = false;

    status = 'Form submitted successfully';
    statusClass = 'success';
    setTimeout(() => {
      status = '';
    }, 3000);
  }

  async function handleClearDraft() {
    if (!autosave) return;

    await autosave.clear();
    hasDraft = false;
    updatedAt = null;

    // Clear form data
    formData = {
      name: '',
      email: '',
      phone: '',
      message: '',
      newsletter: false,
      terms: false,
    };

    status = 'Draft cleared successfully';
    statusClass = 'success';
    setTimeout(() => {
      status = '';
    }, 3000);
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
</script>

<div class="container">
  <div class="example-container">
    <h1>Form Guardian - Svelte Example</h1>
    <p class="subtitle">Form autosave with Svelte</p>

    <form bind:this={formRef} on:submit={handleSubmit}>
      <div class="form-group">
        <label for="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          bind:value={formData.name}
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
          bind:value={formData.email}
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
          bind:value={formData.phone}
          class="input"
          placeholder="+7 (999) 123-45-67"
        />
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea
          id="message"
          name="message"
          bind:value={formData.message}
          class="textarea"
          placeholder="Enter your message..."
        />
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            name="newsletter"
            bind:checked={formData.newsletter}
          />
          Subscribe to newsletter
        </label>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            name="terms"
            bind:checked={formData.terms}
            required
          />
          I agree to the terms and conditions *
        </label>
      </div>

      <div class="buttons">
        <button type="submit" class="button button-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" class="button button-danger" on:click={handleClearDraft}>
          Clear Draft
        </button>
      </div>
    </form>

    {#if status}
      <div class="status {statusClass}">{status}</div>
    {/if}

    {#if hasDraft && updatedAt}
      <div class="draft-info">
        <strong>Draft saved:</strong> {formatDate(updatedAt)}
      </div>
    {/if}
  </div>
</div>

