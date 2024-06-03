import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Card, FormControl, InputGroup, Button, Form } from 'react-bootstrap';
import './styles.scss';

const PlanetsApp = () => {
  const [bodies, setBodies] = useState([]);
  const [selectedBody, setSelectedBody] = useState(null);
  const [bodyDetails, setBodyDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBodies, setFilteredBodies] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [radiusFilter, setRadiusFilter] = useState('');

  useEffect(() => {
    const fetchBodies = async () => {
      try {
        const response = await fetch('https://api.le-systeme-solaire.net/rest.php/bodies');
        const data = await response.json();
        const allBodies = data.bodies.filter(body => body.meanRadius > 200 && body.bodyType !== 'Dwarf Planet');
        setBodies(allBodies);
        setFilteredBodies(allBodies);
      } catch (error) {
        console.error('Error fetching celestial bodies data:', error);
      }
    };

    fetchBodies();
  }, []);

  useEffect(() => {
    const fetchBodyDetails = async () => {
      if (selectedBody) {
        try {
          const response = await fetch(`https://api.le-systeme-solaire.net/rest.php/bodies/${selectedBody.id}`);
          const data = await response.json();
          setBodyDetails(data);
        } catch (error) {
          console.error('Error fetching body details:', error);
        }
      } else {
        setBodyDetails(null);
      }
    };

    fetchBodyDetails();
  }, [selectedBody]);

  const handleBodyClick = (body) => {
    setSelectedBody(body);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    let filtered = bodies.filter(body => body.englishName.toLowerCase().includes(searchQuery.toLowerCase()));
    filtered = filterBodies(filtered);
    setFilteredBodies(filtered);
  };

  const handleReset = () => {
    setSearchQuery('');
    setRadiusFilter('');
    setFilteredBodies(filterBodies(bodies));
  };

  const handleCategoryChange = (category) => {
    setFilterCategory(category);
    setFilteredBodies(filterBodies(bodies, category, radiusFilter));
  };

  const handleRadiusFilterChange = (event) => {
    setRadiusFilter(event.target.value);
    setFilteredBodies(filterBodies(bodies, filterCategory, event.target.value));
  };

  const filterBodies = (bodiesToFilter, category = filterCategory, radius = radiusFilter) => {
    return bodiesToFilter.filter(body => {
      if (category === 'planets' && !body.isPlanet) return false;
      if (category === 'moons' && body.bodyType !== 'Moon') return false;
      if (category === 'stars' && body.bodyType !== 'Star') return false;
      if (category === 'asteroids' && body.bodyType !== 'Asteroid') return false;
      if (radius && body.meanRadius <= parseFloat(radius)) return false;
      return true;
    });
  };

  const getImageSource = (bodyName) => {
    const formattedName = bodyName.replace(/\s+/g, '');
    return `/images/${formattedName}.jpeg`;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="landing-page" id="landing-page">
        <div className="galaxy-animation-container">
          <img src="/images/galaxy-animation.gif" alt="Galaxy Animation" className="galaxy-animation" />
          <div className="animated-text">Hello, stranger! Let's learn more about space!</div>
          <Button variant="primary" className="learn-more-button" href="#main-content">Learn more</Button>
        </div>
      </div>
      <Container id="main-content">
        <Row className="my-4">
          <Col md={4} className="menu-column">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Enter celestial body name"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
              <Button variant="primary" onClick={handleSearch}>Search</Button>
              <Button variant="secondary" onClick={handleReset}>Reset</Button>
            </InputGroup>
            <Form.Group controlId="radiusFilter">
              <Form.Label>Filter by Mean Radius (km)</Form.Label>
              <FormControl
                type="number"
                placeholder="Enter minimum radius"
                value={radiusFilter}
                onChange={handleRadiusFilterChange}
              />
            </Form.Group>
            <div className="filters mt-3">
              <Button variant="primary" onClick={() => handleCategoryChange('all')} className="wide-button">
                All Objects
              </Button>
              <div className="category-buttons">
                <Button variant="primary" onClick={() => handleCategoryChange('planets')}>
                  Planets
                </Button>
                <Button variant="primary" onClick={() => handleCategoryChange('moons')}>
                  Moons
                </Button>
                <Button variant="primary" onClick={() => handleCategoryChange('stars')}>
                  Stars
                </Button>
                <Button variant="primary" onClick={() => handleCategoryChange('asteroids')}>
                  Asteroids
                </Button>
              </div>
            </div>
            <div className="body-list">
              <ListGroup>
                {filteredBodies.map(body => (
                  <ListGroup.Item
                    key={body.id}
                    onClick={() => handleBodyClick(body)}
                    active={selectedBody === body}
                  >
                    {body.englishName}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
          <Col md={8}>
            {bodyDetails && (
              <Card className="transparent-card">
                <Card.Header>
                  <Card.Title>{bodyDetails.englishName}</Card.Title>
                </Card.Header>
                <Card.Body className="text-center">
                  <div className="img-container">
                    <img
                      src={getImageSource(bodyDetails.englishName)}
                      alt={bodyDetails.englishName}
                      onError={(e) => { e.target.src = '/images/default.jpeg'; }}
                    />
                  </div>
                  <p>Mass: {bodyDetails.mass?.massValue * 10 ** bodyDetails.mass?.massExponent} kg</p>
                  <p>Volume: {bodyDetails.vol?.volValue * 10 ** bodyDetails.vol?.volExponent} km³</p>
                  <p>Density: {bodyDetails.density} g/cm³</p>
                  <p>Gravity: {bodyDetails.gravity} m/s²</p>
                  <p>Mean radius: {bodyDetails.meanRadius} km</p>
                  <p>Body type: {bodyDetails.bodyType}</p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
        <div className="back-to-top">
          <Button variant="secondary" href="#landing-page">Back to top</Button>
        </div>
      </Container>
    </>
  );
};

export default PlanetsApp;
