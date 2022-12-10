import React from "react"
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Navbar, Nav} from "react-bootstrap";
import "./styles.css"
import s1 from "./resources/s1.svg";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Navbar className="root-navbar">
            <Navbar.Brand className="root-navbar-brand" href="/"><img className="pr-3" src={s1} alt="" />CRIC</Navbar.Brand>
            <Nav className="p-2" style={{"margin" : "0 0 0 40%"}}>
                <Nav.Link className="mr-3" href="/">Home</Nav.Link>
                <Nav.Link className="mr-3" href="/auctions">Auctions</Nav.Link>
                <Nav.Link className="mr-3" href="/players">Players</Nav.Link>
                <Nav.Link className="mr-3" href="/admin">Admin</Nav.Link>
                <Nav.Link className="mr-3" href="/about">About</Nav.Link>
            </Nav>
        </Navbar>
        <App />
    </BrowserRouter>
);