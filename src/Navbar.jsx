import React, {useState} from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import {PiGavel} from 'react-icons/pi';
import './styles.css';

const navItems = [
  {
    text: 'Home',
    href: '/',
  },
  {
    text: 'Auctions',
    href: '/auctions',
  },
  {
    text: 'Players',
    href: '/players',
  },
  {
    text: 'Team',
    href: '/team',
  },
  {
    text: 'Admin',
    href: '/admin',
  },
  {
    text: 'About',
    href: '/about',
  },
];

export default function Navbar() {
  const [openBasic, setOpenBasic] = useState(false);
  return (
    <MDBNavbar
      expand="lg"
      id="mainNavBar"
      dark
      bgColor="dark"
      style={{zIndex: 2000}}
    >
      <MDBContainer fluid>
        <MDBNavbarBrand className="navbar-brand-margin fs-2" href="/">
          <PiGavel className="me-2" />
          Cric
        </MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setOpenBasic(!openBasic)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar open={openBasic} center>
          <MDBNavbarNav
            right
            fullWidth={false}
            className="my-2 navbar-items-margin fs-5"
          >
            {navItems.map((item) => {
              return (
                <MDBNavbarItem key={item.text}>
                  <MDBNavbarLink
                    active={document.URL.indexOf(item.href) != -1}
                    href={item.href}
                  >
                    {item.text}
                  </MDBNavbarLink>
                </MDBNavbarItem>
              );
            })}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
