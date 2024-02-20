import { useState } from 'react';
import { Navbar, Container, Button, Form, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';

function NavHeader(props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("The webpage's webpage");

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleInputChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowForm(false);
  };

  return (
    <Navbar bg="navbar primary" variant="dark">
  <Container fluid>
    <Navbar.Brand href="/">{title}</Navbar.Brand>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link as={Link} to={`/pages/${props.user.id}`} className='page-paragraph'>Back Office</Nav.Link>
      </Nav>
      <Nav>
        {!props.loggedIn ? (
          <Link to="/login" className="btn btn-outline-light logout-button">
            Login
          </Link>
        ) : (
          <>
            {props.admin && (
              <>
                {!showForm ? (
                  <Button onClick={handleButtonClick} variant="outline-light" className='change-title-button'>Change Title</Button>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col xs={6}>
                        <Form.Control type="text" className="form-input" placeholder="New Title" minLength={2} required={true} value={title} onChange={handleInputChange}/>
                      </Col>
                      <Col xs={4}>
                        <Button type="submit" variant="light" className='edit-button' >Update</Button>
                      </Col>  
                    </Row>
                  </Form>
                )}
              </>
            )}
            &nbsp;
            <LogoutButton logout={props.handleLogout} />
          </>
        )}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

  );
}

export default NavHeader;
