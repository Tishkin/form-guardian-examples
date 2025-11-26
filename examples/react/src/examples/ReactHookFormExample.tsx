import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { attachFormAutosave } from '@form-guardian/dom';
import { useDraftStatus } from '@form-guardian/react';
import './ExampleForm.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  newsletter: boolean;
  terms: boolean;
}

export default function ReactHookFormExample() {
  const [status, setStatus] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const autosaveRef = useRef<ReturnType<typeof attachFormAutosave> | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      newsletter: false,
      terms: false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!formRef.current) return;

    if (autosaveRef.current) {
      autosaveRef.current.destroy();
    }

    const autosave = attachFormAutosave<FormData>({
      formId: 'react-hook-form-example',
      root: formRef.current,
      autoRestore: true,
      debounceMs: 500,
      blacklist: ['[data-no-save]'],
      onAfterSave: async () => {
        setStatus('Draft saved successfully');
        setTimeout(() => setStatus(''), 3000);
      },
      onAfterRestore: async () => {
        setStatus('Draft restored successfully');
        setTimeout(() => setStatus(''), 3000);
      },
    });

    autosaveRef.current = autosave;

    return () => {
      autosave.destroy();
    };
  }, []);

  const { hasDraft, updatedAt, clear: clearDraftStatus } = useDraftStatus('react-hook-form-example');

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (autosaveRef.current) {
      await autosaveRef.current.clear();
    }
    await clearDraftStatus();

    // Reset React Hook Form
    reset();

    setStatus('Form submitted successfully');
    setTimeout(() => setStatus(''), 3000);
  };

  const handleClearDraft = async () => {
    if (autosaveRef.current) {
      await autosaveRef.current.clear();
    }
    await clearDraftStatus();

    // Reset React Hook Form
    reset();

    setStatus('Draft cleared successfully');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="example-container">
      <h1>React Hook Form Example</h1>
      <p className="subtitle">Form autosave with React Hook Form</p>

      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            className="input"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            className="input"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email',
              },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            className="input"
            {...register('phone')}
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            className="textarea"
            {...register('message')}
            placeholder="Enter your message..."
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" {...register('newsletter')} />
            Subscribe to newsletter
          </label>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              {...register('terms', { required: 'Agreement required' })}
            />
            I agree to the terms and conditions *
          </label>
          {errors.terms && <span className="error">{errors.terms.message}</span>}
        </div>

        <div className="buttons">
          <button type="submit" className="button button-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" className="button button-danger" onClick={handleClearDraft}>
            Clear Draft
          </button>
        </div>
      </form>

      {status && <div className={`status ${status.includes('successfully') ? 'success' : ''}`}>{status}</div>}

      {hasDraft && updatedAt && (
        <div className="draft-info">
          <strong>Draft saved:</strong> {new Date(updatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}

