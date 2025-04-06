import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Form, Button, Card, Row, Col, Modal } from 'react-bootstrap';
import { FaSearch, FaHome, FaFilm } from 'react-icons/fa';
import { MdLiveTv } from 'react-icons/md';
import axios from 'axios';

function CustomNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [cast, setCast] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get("https://api.themoviedb.org/3/search/multi", {
        params: {
          api_key: "104982ca487a975dd171416b2958f849",
          query: searchQuery,
          language: "en-US",
        },
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const fetchMovieDetails = async (movie) => {
    setSelectedMovie(movie);
    setCast([]);
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/${movie.media_type}/${movie.id}/credits`, {
        params: { api_key: "104982ca487a975dd171416b2958f849" },
      });
      setCast(response.data.cast.slice(0, 6));
    } catch (error) {
      console.error("Error fetching cast:", error);
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-light py-3 shadow-lg" style={{ fontFamily: 'MyCustomFont, sans-serif', fontSize: "18px" }}>
        <Container>
          <Navbar.Brand>
            <Link to="/" className="rounded fw-bold" style={{ backgroundColor: "#FFD700", padding: "8px 15px", textDecoration: "none", fontSize: "22px", borderRadius: "8px", color: "#000" }}>🎬 CineMatch</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" className="border-0" style={{ backgroundColor: "#FFD700" }} />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Link as={Link} to="/" className="me-3"><FaHome size={18} className="me-1" /> Home</Nav.Link>
              <Nav.Link as={Link} to="/movies" className="me-3"><FaFilm size={18} className="me-1" /> Movies</Nav.Link>
              <Form className="d-flex align-items-center mx-3" onSubmit={handleSearch}>
                <Form.Control type="search" placeholder="Search..." className="me-2" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "200px" }} />
                <Button type="submit" variant="warning"><FaSearch /></Button>
              </Form>
              <Nav.Link as={Link} to="/tvshows" className="me-3"><MdLiveTv size={20} className="me-1" /> TV Shows</Nav.Link>
            </Nav>
               <NavDropdown title="Dashboard" id="navbarScrollingDropdown">
              <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/watchlist">Watchlist</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/admin">Admin Login</NavDropdown.Item>
            </NavDropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {searchResults.length > 0 && (
        <Container className="mt-4">
          <h3 className="text-center mb-3">Search Results</h3>
          <Row>
            {searchResults.map((item) => (
              <Col md={4} lg={3} key={item.id} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Img variant="top" src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/200'} alt={item.title || item.name} />
                  <Card.Body>
                    <Card.Title>{item.title || item.name}</Card.Title>
                    <Card.Text>{item.media_type === "movie" ? "🎬 Movie" : "📺 TV Show"}</Card.Text>
                    <Button variant="warning" onClick={() => fetchMovieDetails(item)}>View Details</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {selectedMovie && (
        <Modal show={!!selectedMovie} onHide={() => setSelectedMovie(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedMovie.title || selectedMovie.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4}>
                <img src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : 'https://via.placeholder.com/300'} alt={selectedMovie.title} className="img-fluid rounded" />
              </Col>
              <Col md={4}>
                <h5>Description</h5>
                <p>{selectedMovie.overview || "No description available."}</p>
                <h6>⭐ Rating: {selectedMovie.vote_average ? selectedMovie.vote_average.toFixed(1) : "N/A"}</h6>
                <h6>📅 Release Date: {selectedMovie.release_date || selectedMovie.first_air_date || "N/A"}</h6>
              </Col>
              <Col md={4}>
                <h5>Cast</h5>
                <Row>
                  {cast.map((actor) => (
                    <Col key={actor.id} xs={6} className="text-center mb-3">
                      <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/100'} alt={actor.name} className="rounded-circle mb-2" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                      <p className="small mb-0">{actor.name}</p>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default CustomNavbar;