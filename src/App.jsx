import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSession } from './auth/session.jsx';
import HomePage from './HomePage.jsx';
import LoginPage from './auth/LoginPage.jsx';
import CarDataScreen from './car/CarDataScreen.jsx';
import CarDetailsScreen from './car/CarDetailsScreen.jsx';

function App() {
  const { user } = useSession();

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#232323' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/car" element={<CarDataScreen />} />
          <Route path="/car/:carId" element={<CarDetailsScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
