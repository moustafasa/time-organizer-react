import React from "react";
import Header from "./Header/Header";
import { Outlet, ScrollRestoration } from "react-router-dom";
import PopUp from "./PopUp/PopUp";

const LayOut = () => {
  return (
    <>
      <Header />
      <section id="body">
        <Outlet />
      </section>
      <PopUp />
      <ScrollRestoration
        getKey={(location, matches) => {
          return location.pathname;
        }}
      />
    </>
  );
};

export default LayOut;
