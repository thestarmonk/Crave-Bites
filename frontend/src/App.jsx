import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingStatusBar from './components/FloatingStatusBar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderDetails from './pages/OrderDetails';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/menu" element={<PageTransition><Menu /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
            <Route path="/terms-of-service" element={<PageTransition><TermsOfService /></PageTransition>} />

            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
              <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
              <Route path="/order/:id" element={<PageTransition><OrderDetails /></PageTransition>} />
            </Route>

            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AnimatedRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0D0D12',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '16px 24px',
              },
            }}
          />
          <FloatingStatusBar />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
