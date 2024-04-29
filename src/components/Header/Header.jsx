import React from "react";
import "./Header.scss";
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
