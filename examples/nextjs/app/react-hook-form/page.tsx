'use client';

import ReactHookFormExample from '@/components/examples/ReactHookFormExample';
import Navigation from '@/components/Navigation';

export default function ReactHookFormPage() {
  return (
    <div className="app">
      <Navigation />
      <main className="main">
        <ReactHookFormExample />
      </main>
    </div>
  );
}

