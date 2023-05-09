import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ForestOutlinedIcon from '@mui/icons-material/ForestOutlined';

const NavbarTop = ({ connect, connected, accountType }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/" style={{display: 'flex', alignItems: 'center'}}>
            <ForestOutlinedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} color="success" /> 
            Carbon Credits
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {(accountType == 0 || accountType == 1) && <Nav.Link href="/details">Details</Nav.Link>}
            {(accountType == 0 || accountType == 1) && <Nav.Link href="/request-credits">Request Credits</Nav.Link>}
            {(accountType == 0 || accountType == 1) && <Nav.Link href="/requests">My Requests</Nav.Link>}
            {(accountType == 0 || accountType == 1) && <Nav.Link href="/open-requests">View public requests</Nav.Link>}
            {(accountType == 0 || accountType == 1) && <Nav.Link href="/timeline">Timeline</Nav.Link>}
            {(accountType != 0 && accountType != 1) && <Nav.Link href="/">Registration requests</Nav.Link>}
          </Nav>
          <Nav>
            {!connected ? (
              <Button onClick={connect}>Connect to Metamask</Button>
            ) : (
                <Button onClick={() => {}} variant="outline-info" disabled>Connected to Metamask</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;