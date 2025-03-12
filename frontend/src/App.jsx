import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserLayout />} />
        <Route>{/*Admin Layout*/}</Route>
      </Routes>
    </>
  );
};

export default App;
