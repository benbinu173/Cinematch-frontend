import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Movies from "./Pages/Movies";
import TVShows from "./Pages/TVShows";
import MovieDetails from "./Pages/MovieDetails";
import TVShowDetails from "./Pages/TVShowDetails";
import Watchlist from "./Pages/Watchlist";
import SearchResults from "./pages/SearchResults";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Contact from "./pages/Contact";
import AdminDashboard from "./Pages/AdminDashboard";
import NotFound from "./Pages/NotFound";
import CustomNavbar from "./Components/CustomNavbar";
import Footer from "./Components/Footer";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminLogin from "./Pages/AdminLogin";
import AdminRegister from "./Pages/AdminRegister";
import AdminReports from "./Pages/AdminReports";
import Reviews from "./Pages/Reviews";
import AllReviews from "./Pages/AllReviews";




function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tvshows" element={<TVShows />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tvshows/:id" element={<TVShowDetails />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/adminlogin" element={<AdminLogin/>} />
        <Route path="/adminreg" element = {<AdminRegister/>} />
        <Route path="/admin/users" element = {<AdminReports/>} />
        <Route path="/reviews/:id" element={<Reviews />} />
        <Route path="/admin/allreview" element={<AllReviews />} />



        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
