import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './views/pages/HomePage';
import { SigninPage } from './views/pages/SigninPage';
import { SignupPage } from './views/pages/SignupPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
