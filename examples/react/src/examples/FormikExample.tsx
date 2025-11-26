import { useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik';
import { useFormAutosave, useDraftStatus } from '@form-guardian/react';
import './ExampleForm.css';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  newsletter: boolean;
  terms: boolean;
}

export default function FormikExample() {
  const [status, setStatus] = useState('');
  const formikHelpersRef = useRef<any>(null);

  const { formRef, clearDraft } = useFormAutosave<FormValues>('formik-example', {
    autoRestore: true,
    debounceMs: 500,
    onAfterSave: async () => {
      setStatus('Draft saved successfully');
      setTimeout(() => setStatus(''), 3000);
    },
    onAfterRestore: async (values) => {
      // Update Formik values after restoration
      if (values && formikHelpersRef.current) {
        formikHelpersRef.current.setValues(values);
      }
      setStatus('Draft restored successfully');
      setTimeout(() => setStatus(''), 3000);
    },
  });

  const { hasDraft, updatedAt, clear: clearStatus } = useDraftStatus('formik-example');

  const initialValues: FormValues = {
    name: '',
    email: '',
    phone: '',
    message: '',
    newsletter: false,
    terms: false,
  };

  const validate = (values: FormValues): FormikErrors<FormValues> => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.name) {
      errors.name = 'Name is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email';
    }
    if (!values.terms) {
      errors.terms = 'Agreement required';
    }
    return errors;
  };

  const onSubmit = async (values: FormValues, { resetForm }: any) => {
    console.log('Form submitted:', values);
    await new Promise(resolve => setTimeout(resolve, 500));

    await clearDraft();
    await clearStatus();

    // Reset Formik form
    resetForm();

    setStatus('Form submitted successfully');
    setTimeout(() => setStatus(''), 3000);
  };

  const handleClearDraft = async () => {
    await clearDraft();
    await clearStatus();

    // Reset Formik form
    if (formikHelpersRef.current) {
      formikHelpersRef.current.resetForm();
    }

    setStatus('Draft cleared successfully');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="example-container">
      <h1>Formik Example</h1>
      <p className="subtitle">Form autosave with Formik</p>

      <Formik 
        initialValues={initialValues} 
        validate={validate} 
        onSubmit={onSubmit}
        innerRef={formikHelpersRef}
      >
        {({ isSubmitting, resetForm }) => {
          // Store resetForm in ref for use in handleClearDraft
          if (formikHelpersRef.current) {
            formikHelpersRef.current.resetForm = resetForm;
          } else {
            formikHelpersRef.current = { resetForm };
          }
          return (
          <Form ref={formRef}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <Field type="text" id="name" name="name" className="input" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <Field type="email" id="email" name="email" className="input" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <Field type="text" id="phone" name="phone" className="input" placeholder="+7 (999) 123-45-67" />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <Field as="textarea" id="message" name="message" className="textarea" placeholder="Enter your message..." />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <Field type="checkbox" name="newsletter" />
                Subscribe to newsletter
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <Field type="checkbox" name="terms" />
                I agree to the terms and conditions *
              </label>
              <ErrorMessage name="terms" component="div" className="error" />
            </div>

            <div className="buttons">
              <button type="submit" className="button button-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" className="button button-danger" onClick={handleClearDraft}>
                Clear Draft
              </button>
            </div>
          </Form>
          );
        }}
      </Formik>

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

