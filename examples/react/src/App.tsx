import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import ReactHookFormExample from './examples/ReactHookFormExample';
import FormikExample from './examples/FormikExample';
import PlainFormExample from './examples/PlainFormExample';
import './App.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="nav">
      <h1>Form Guardian - React Examples</h1>
      <div className="nav-buttons">
        <Link
          to="/react-hook-form"
          className={location.pathname === '/react-hook-form' ? 'active' : ''}
        >
          React Hook Form
        </Link>
        <Link
          to="/formik"
          className={location.pathname === '/formik' ? 'active' : ''}
        >
          Formik
        </Link>
        <Link
          to="/plain"
          className={location.pathname === '/plain' ? 'active' : ''}
        >
          Plain Form
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/react-hook-form" replace />} />
            <Route path="/react-hook-form" element={<ReactHookFormExample />} />
            <Route path="/formik" element={<FormikExample />} />
            <Route path="/plain" element={<PlainFormExample />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
