import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {Navbar, Nav} from 'react-bootstrap';
import './styles.css';
import s1 from './resources/s1.svg';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
    text: 'Teams',
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
      <Navbar
        className="root-navbar"
        style={{paddingLeft: '15%'}}
        id="mainNavBar"
      >
        <Navbar.Brand className="root-navbar-brand" href="/">
          <img className="pr-3" src={s1} alt="" />
        CRIC
        </Navbar.Brand>
        <Nav className="p-2" style={{margin: '0 0 0 40%'}}>
          {navItems.map((item) => (
            <Nav.Link key={item.text} className="mx-2" href={item.href}>
              {item.text}
            </Nav.Link>
          ))}
        </Nav>
      </Navbar>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <footer className="pt-5 pb-2">
        <div className="d-flex justify-content-center">@devnev</div>
      </footer>
    </>,
);
