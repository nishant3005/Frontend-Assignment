import './App.css';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogsScreen from './pages/LogsScreen';
import MetricsScreen from './pages/MetricsScreen';
import StorybookScreen from './pages/StorybookScreen';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<MetricsScreen />} />
          <Route path="/logs" element={<LogsScreen />} />
          <Route path="/storybook" element={<StorybookScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
