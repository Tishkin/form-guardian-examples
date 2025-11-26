'use client';

import PlainFormExample from '@/components/examples/PlainFormExample';
import Navigation from '@/components/Navigation';

export default function PlainFormPage() {
  return (
    <div className="app">
      <Navigation />
      <main className="main">
        <PlainFormExample />
      </main>
    </div>
  );
}

