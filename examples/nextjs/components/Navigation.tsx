'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <h1>Form Guardian - Next.js Examples</h1>
      <div className="nav-buttons">
        <Link
          href="/react-hook-form"
          className={pathname === '/react-hook-form' ? 'active' : ''}
        >
          React Hook Form
        </Link>
        <Link
          href="/formik"
          className={pathname === '/formik' ? 'active' : ''}
        >
          Formik
        </Link>
        <Link
          href="/plain"
          className={pathname === '/plain' ? 'active' : ''}
        >
          Plain Form
        </Link>
      </div>
    </nav>
  );
}

