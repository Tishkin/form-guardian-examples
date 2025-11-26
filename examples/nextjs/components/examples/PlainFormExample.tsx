'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useFormAutosave, useDraftStatus } from '@form-guardian/react';
import './ExampleForm.css';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  newsletter: boolean;
  terms: boolean;
}

export default function PlainFormExample() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [terms, setTerms] = useState(false);
  const [status, setStatus] = useState('');

  const { formRef, restoreDraft, clearDraft } = useFormAutosave<ContactFormData>('react-plain-form', {
    autoRestore: true,
    debounceMs: 500,
    onAfterSave: async () => {
      setStatus('Draft saved successfully');
      setTimeout(() => setStatus(''), 3000);
    },
    onAfterRestore: async (values) => {
      // Sync React state with restored DOM values
      if (values) {
        setName(values.name || '');
        setEmail(values.email || '');
        setPhone(values.phone || '');
        setMessage(values.message || '');
        setNewsletter(values.newsletter || false);
        setTerms(values.terms || false);
      }
      setStatus('Draft restored successfully');
      setTimeout(() => setStatus(''), 3000);
    },
  });

  const { hasDraft, updatedAt, clear: clearStatus } = useDraftStatus('react-plain-form');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = { name, email, phone, message, newsletter, terms };
    console.log('Form submitted:', data);

    await new Promise(resolve => setTimeout(resolve, 500));

    await clearDraft();
    await clearStatus();

    // Clear form state
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setNewsletter(false);
    setTerms(false);

    // Reset DOM form
    if (formRef.current) {
      formRef.current.reset();
    }

    setStatus('Form submitted successfully');
    setTimeout(() => setStatus(''), 3000);
  };

  const handleClearDraft = async () => {
    await clearDraft();
    await clearStatus();

    // Clear form state
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setNewsletter(false);
    setTerms(false);

    // Reset DOM form
    if (formRef.current) {
      formRef.current.reset();
    }

    setStatus('Draft cleared successfully');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="example-container">
      <h1>Plain React Form Example</h1>
      <p className="subtitle">Form autosave with plain React state</p>

      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="textarea"
            placeholder="Enter your message..."
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="newsletter"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
            />
            Subscribe to newsletter
          </label>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              required
            />
            I agree to the terms and conditions *
          </label>
        </div>

        <div className="buttons">
          <button type="submit" className="button button-submit">Submit</button>
          <button type="button" className="button button-danger" onClick={handleClearDraft}>
            Clear Draft
          </button>
        </div>
      </form>

      {status && (
        <div className={`status ${status.includes('successfully') ? 'success' : status.includes('No draft') ? 'error' : ''}`}>
          {status}
        </div>
      )}

      {hasDraft && updatedAt && (
        <div className="draft-info">
          <strong>Draft saved:</strong> {new Date(updatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}
