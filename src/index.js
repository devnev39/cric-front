import React from "react"
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {Navbar, Nav} from "react-bootstrap";
import "./styles.css"
import s1 from "./resources/s1.svg";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
    {/* <nav className="navbar navbar-expand-lg bg-dark">
    <div className="container-fluid">
        <a className="navbar-brand" href="/">Navbar</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
            <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/">Home</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/auctions">Auctions</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/team">Teams</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/about">About</a>
            </li>
        </ul>
        </div>
    </div>
    </nav> */}
        <Navbar className="root-navbar" id="mainNavBar">
            <Navbar.Brand className="root-navbar-brand" href="/"><img className="pr-3" src={s1} alt="" />CRIC</Navbar.Brand>
            <Nav className="p-2" style={{"margin" : "0 0 0 40%"}}>
                <Nav.Link className="mr-3" href="/">Home</Nav.Link>
                <Nav.Link className="mr-3" href="/auctions">Auctions</Nav.Link>
                <Nav.Link className="mr-3" href="/players">Players</Nav.Link>
                <Nav.Link className="mr-3" href="/team">Teams</Nav.Link>
                <Nav.Link className="mr-3" href="/admin">Admin</Nav.Link>
                <Nav.Link className="mr-3" href="/about">About</Nav.Link>
            </Nav>
        </Navbar>
        
        <App />
        <footer className="pt-5 pb-2">
            <div className="d-flex justify-content-center">
                @devnev
            </div>
            
        </footer>
    </BrowserRouter>
);