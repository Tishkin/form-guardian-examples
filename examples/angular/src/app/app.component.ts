import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { attachFormAutosave } from '@form-guardian/dom';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  newsletter: boolean;
  terms: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('formRef', { static: false }) formRef!: ElementRef<HTMLFormElement>;

  formData: FormData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    newsletter: false,
    terms: false
  };

  status = '';
  statusClass: 'success' | 'error' = 'success';
  hasDraft = false;
  updatedAt: number | null = null;
  isSubmitting = false;

  private autosave: ReturnType<typeof attachFormAutosave<FormData>> | null = null;
  private draftCheckInterval: number | null = null;

  ngOnInit() {
    // Wait for view to initialize
    setTimeout(() => {
      this.initAutosave();
    }, 0);
  }

  ngOnDestroy() {
    if (this.autosave) {
      this.autosave.destroy();
    }
    if (this.draftCheckInterval) {
      clearInterval(this.draftCheckInterval);
    }
  }

  private initAutosave() {
    if (!this.formRef?.nativeElement) return;

    this.autosave = attachFormAutosave<FormData>({
      formId: 'angular-example',
      root: this.formRef.nativeElement,
      autoRestore: true,
      debounceMs: 500,
      onAfterSave: async () => {
        this.status = 'Draft saved successfully';
        this.statusClass = 'success';
        setTimeout(() => {
          this.status = '';
        }, 3000);
        await this.updateDraftInfo();
      },
      onAfterRestore: async () => {
        this.status = 'Draft restored successfully';
        this.statusClass = 'success';
        setTimeout(() => {
          this.status = '';
        }, 3000);
        await this.updateDraftInfo();
      },
      onDraftExpired: async () => {
        this.status = 'Draft expired';
        this.statusClass = 'error';
        setTimeout(() => {
          this.status = '';
        }, 3000);
        this.hasDraft = false;
        this.updatedAt = null;
      },
    });

    this.updateDraftInfo();

    this.draftCheckInterval = window.setInterval(async () => {
      await this.updateDraftInfo();
    }, 1000);
  }

  private async updateDraftInfo() {
    if (!this.autosave) return;
    const exists = await this.autosave.hasDraft();
    this.hasDraft = exists;
    if (exists) {
      const meta = await this.autosave.getDraftMeta();
      if (meta) {
        this.updatedAt = meta.updatedAt;
      } else {
        this.updatedAt = null;
      }
    } else {
      this.updatedAt = null;
    }
  }

  async onSubmit() {
    this.isSubmitting = true;
    console.log('Form submitted:', this.formData);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (this.autosave) {
      await this.autosave.clear();
    }

    // Clear form data
    this.formData = {
      name: '',
      email: '',
      phone: '',
      message: '',
      newsletter: false,
      terms: false
    };

    this.hasDraft = false;
    this.updatedAt = null;
    this.isSubmitting = false;

    this.status = 'Form submitted successfully';
    this.statusClass = 'success';
    setTimeout(() => {
      this.status = '';
    }, 3000);
  }

  async handleClearDraft() {
    if (!this.autosave) return;

    await this.autosave.clear();
    this.hasDraft = false;
    this.updatedAt = null;

    // Clear form data
    this.formData = {
      name: '',
      email: '',
      phone: '',
      message: '',
      newsletter: false,
      terms: false,
    };

    this.status = 'Draft cleared successfully';
    this.statusClass = 'success';
    setTimeout(() => {
      this.status = '';
    }, 3000);
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}

