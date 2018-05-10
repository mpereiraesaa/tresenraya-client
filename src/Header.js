import React from "react";
import logo from "./logo.svg";
import "./header.css";

const Header = (props) => (
    <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Bienvenido a tres en raya</h1>
    </header>
)

export default Header;
