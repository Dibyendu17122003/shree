import { Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import MainQuestion from './pages/MainQuestion';
import Questions from './pages/Questions';
import FinalScreen from './pages/FinalScreen';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import { AnimatePresence } from 'framer-motion';
import MouseTrail from './components/animations/MouseTrail';

export default function App() {
  const location = useLocation();

  return (
    <>
      <MouseTrail />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/question" element={<MainQuestion />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/final" element={<FinalScreen />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
