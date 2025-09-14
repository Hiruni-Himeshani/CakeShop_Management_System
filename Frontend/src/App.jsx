import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import AddCake from "./pages/cake_management/AddCake";
import CakeList from "./pages/cake_management/CakeList";
import EditCake from "./pages/cake_management/EditCake";
import Login from "./pages/Login/Login";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="addcake" element={<AddCake />} />
            <Route path="cakelist" element={<CakeList />} />
            <Route path="editcake/:id" element={<EditCake />} />
          </Route>
        </Routes>
      </div>
      <ToastContainer />
    </>
  );
};

export default App;
