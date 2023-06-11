import React from 'react'

import './Home.css'
import {Routes,Route} from 'react-router-dom'
import About from '../about/About'
import SideeNav from '../../components/SideeNav'
import Task from '../tasks/Task'
import jwtDecode from 'jwt-decode';
import ManageUsers from '../manage users/ManageUsers'
import CustomerDetails from '../Customers/CustomerDetails'

const Home = () => {
  const token = localStorage.getItem('userInfo');
  let decodedToken = jwtDecode(token);
  const role = decodedToken.data?.is_admin;
  //console.log(decodedToken);
  console.log(role, 'gg');
  return (
    <div className="home-container">
    <div className="side-nav-container">
      <SideeNav />
    </div>
    <div className="content-container">
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/Customers" element={<CustomerDetails />} />
        {role ==1 && (
          <>
          <Route path="/task" element={<Task />} />
          <Route path="/employees" element={<ManageUsers />} />
          </>
        )}
        
      </Routes>
    </div>
  </div>
  )
}

export default Home