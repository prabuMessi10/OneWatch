import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import VerifyEmail from './pages/Auth/VerifyEmail';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import MyList from './pages/MyList';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import DMCA from './pages/DMCA';
import Footer from './components/Footer';


import Search from './pages/Search';



function App() {
  return (
    <div className="min-h-screen bg-netflix-dark">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/dmca" element={<DMCA />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>

  )
}

export default App

