import React from 'react';
import './Home.css';
import { Routes, Route } from 'react-router-dom';
import About from '../about/About';
import SideeNav from '../../components/SideeNav';
import Task from '../tasks/Task';
import jwtDecode from 'jwt-decode';
import ManageUsers from '../manage users/ManageUsers';
import CustomerDetails from '../Customers/CustomerDetails';
import LandingPage from '../LandingPage/LandingPage';
import Audit from '../Audit/Audit';

const Home = () => {
  const token = localStorage.getItem('userInfo');
  let decodedToken = jwtDecode(token);
  const role = decodedToken.data[0]?.is_admin;
  console.log(role, 'gg');
  return (
    <div>
      
      <div className="home-container">
      <div className="side-nav-container">
        <SideeNav />
      </div>
      <div className="content-container">
      <div className="heading-tab">
        <h1>Email Marketing Tool</h1>
      </div>
        <Routes>
          <Route path="/LandingPage" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/customers" element={<CustomerDetails />} />
          {role == 1 && (
            <>
              <Route path="/task" element={<Task />} />
              <Route path="/employees" element={<ManageUsers />} />
              <Route path="/audit" element={<Audit/>} />
            </>
          )}
        </Routes>
      </div>
      </div>
    </div>
  );
};

export default Home;
