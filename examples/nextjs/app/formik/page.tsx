'use client';

import FormikExample from '@/components/examples/FormikExample';
import Navigation from '@/components/Navigation';

export default function FormikPage() {
  return (
    <div className="app">
      <Navigation />
      <main className="main">
        <FormikExample />
      </main>
    </div>
  );
}

