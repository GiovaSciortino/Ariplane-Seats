import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { LogoutButton, LoginButton } from './Auth';

function Navigation(props) {
  return (
   <Navbar bg="primary" data-bs-theme="light">
      <Container fluid>
        <Link to="/">
          <Navbar.Brand>
            <i className="bi bi-airplane-engines"/> Airplane Seats
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
          </Nav>
          <Nav className="ml-md-auto">
            <Navbar.Text className="mx-2">
              {props.user && props.user.name && `Welcome, ${props.user.name}!`}
            </Navbar.Text>
            <Form className="mx-2">
              {props.loggedIn ? <LogoutButton logout={props.logout} /> : <LoginButton />}
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export  {Navigation};