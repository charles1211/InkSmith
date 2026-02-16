import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Artists from './pages/Artists';
import Booking from './pages/Booking';
import AIConsultation from './pages/AIConsultation';
import Aftercare from './pages/Aftercare';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-ink-950 text-white font-sans selection:bg-ink-accent selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/book" element={<Booking />} />
              <Route path="/ai-consult" element={<AIConsultation />} />
              <Route path="/aftercare" element={<Aftercare />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Admin Protected Route */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
