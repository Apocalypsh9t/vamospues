import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import StatsRibbon from './components/StatsRibbon';
import Footer from './components/Footer';
import PlaceDetailModal from './components/PlaceDetailModal';
import SurveyModal from './components/SurveyModal';
import Inicio from './pages/Inicio';
import Explorar from './pages/Explorar';
import Generador from './pages/Generador';
import Mapa from './pages/Mapa';
import Sugerir from './pages/Sugerir';
import Admin from './pages/Admin';
import LugarCompartido from './pages/LugarCompartido';

// Igual que antes: al cambiar de sección se sube suavemente al inicio de la página
function ScrollArriba() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <AppProvider>
        <ScrollArriba />
        <Header />
        <StatsRibbon />

        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/generador" element={<Generador />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/sugerir" element={<Sugerir />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/lugar/:id" element={<LugarCompartido />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <PlaceDetailModal />
        <SurveyModal />
      </AppProvider>
    </Router>
  );
}

export default App;
