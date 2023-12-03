import React from "react";
import "./Header.scss";
import landing from "../../img/landing-background.png";
import { Link } from "react-router-dom";
import Content from "./Content/Content";
import Nav from "./Nav/Nav";

const Header = () => {
  return (
    <header>
      <Content />
      <Nav />
    </header>
  );
};

export default Header;
