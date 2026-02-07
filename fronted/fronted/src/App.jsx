import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { BackofficeLogin } from './pages/Backoffice/BackofficeLogin';
import { BackofficeDashboard } from './pages/Backoffice/BackofficeDashboard';
import { FrontOffice } from './pages/FrontOffice/FrontOffice';
import { Layout } from './components/Layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/backoffice" element={<BackofficeLogin />} />
        <Route
          path="/backoffice/dashboard"
          element={
            <Layout showNav={true}>
              <BackofficeDashboard />
            </Layout>
          }
        />

        <Route
          path="/frontoffice"
          element={
            <Layout showNav={true}>
              <FrontOffice />
            </Layout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
