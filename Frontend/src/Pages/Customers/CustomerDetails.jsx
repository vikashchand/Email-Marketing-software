import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUpload } from 'react-icons/fa';
import './CustomerDetails.css';

const CustomerDetails = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://email-marketing-vikash.vercel.app/user/customerDetails'); // Replace with your API endpoint to fetch users
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', selectedFile);

    axios
      .post('https://email-marketing-vikash.vercel.app/upload', formData)
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message); // Use response.data.message for success
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.error); // Use error.response.data.error for error
      });
  };


  const handleSetStatus = async (id, newStatus) => {

    try {
      await axios.put(`https://email-marketing-vikash.vercel.app/user/updatecustomerDetails/${id}`, { status: newStatus });

      fetchUsers();
    } catch (error) {
      console.error('Error updating account status:', error);
    }
  };

  return (    <div className="customer-details-container">
    <div className="custlist">
      <h2>Upload Excel Sheet</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="template-section custom-file-upload">
          <FaUpload className="upload-icon" />
          <span>Choose file</span>
          <input id="file-upload" type="file" onChange={handleFileChange} accept=".xls,.xlsx" />
        </label>
        <button type="submit">Upload</button>
      </form>
      <ToastContainer />

      <h1>Mailing list details</h1>
      <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr>
            <th>Customer_email</th>
            <th>Customer_name</th>
            <th>Template_id</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((user) => (
            <tr key={user._id}>
              <td className='tableroww'>{user.customer_email}</td>
              <td className='tableroww'>{user.customer_name}</td>
              <td className='tableroww'>{user.template_id}</td>
              <td className='tableroww'>{user.status}</td>
              <td className='tableroww'>
                {user.status !== 'sent' && (
                  <button onClick={() => handleSetStatus(user._id,'sent')}>Send Now</button>
                )}
              </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        );
        };
        
        
        export default CustomerDetails;