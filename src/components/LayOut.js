import React from "react";
import Header from "./Header/Header";
import { Outlet } from "react-router-dom";
import PopUp from "./PopUp/PopUp";

const LayOut = () => {
  return (
    <>
      <Header />
      <section id="body">
        <Outlet />
      </section>
      <PopUp />
    </>
  );
};

export default LayOut;
