

import React from 'react';
import jwtDecode from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import './SideeNav.css'; // Import the CSS file

const SideeNav = () => {
 // const navigate = useNavigate();
  const token = localStorage.getItem('userInfo');
  let decodedToken = jwtDecode(token);
  const role = decodedToken.data?.is_admin;
  console.log(role, 'gg');



  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <div className="sidenav-container">
    <div className='menu'>  MENU</div>
   
          <NavLink to={'/home/about'}>
            SEND MAIL
            
          </NavLink>
          
          {role ==1 && (

            <>
            <NavLink to={'/home/task'}>
              Manage templates
            </NavLink>
            <NavLink to="/home/employees">Manage Employees</NavLink>

            </>
          )
        
        
        }

        <NavLink to={'/home/Customers'}>
            Customer
            Details
          </NavLink>
          <br/>

        <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>



        </div>
  );
};

export default SideeNav;


// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import './SideeNav.css'; // Import the CSS file

// const SideeNav = () => {
//   const role = 1; // Replace with the actual role value received from token or state

//   return (
//     <div className="sidenav-container">
//       <NavLink to={'/home/about'}>
//         <h1>about u</h1>
//       </NavLink>
      
//       {role === 1 && (
//         <NavLink to={'/home/task'}>
//           <h1>thanks</h1>
//         </NavLink>
//       )}
//     </div>
//   );
// };

// export default SideeNav;
