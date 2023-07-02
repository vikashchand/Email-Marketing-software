import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUpload, FaDownload } from 'react-icons/fa';
import './CustomerDetails.css';

const CustomerDetails = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedButton, setSelectedButton] = useState('');

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);

    if (event.target.checked) {
      const notSentCustomerEmails = customers
        .filter((user) => user.status !== 'sent')
        .map((user) => user.customer_email);
      setSelectedCustomers(notSentCustomerEmails);
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleCustomerCheckboxChange = (event, customerEmail) => {
    if (event.target.checked) {
      setSelectedCustomers((prevSelectedCustomers) => [...prevSelectedCustomers, customerEmail]);
    } else {
      setSelectedCustomers((prevSelectedCustomers) =>
        prevSelectedCustomers.filter((email) => email !== customerEmail)
      );
      setSelectAll(false);
    }
  };

  const handleSendNow = async () => {
    try {
      // Perform the send now action for the selected customers
      for (const customerEmail of selectedCustomers) {
        const customer = customers.find((user) => user.customer_email === customerEmail);
        if (customer && customer.status !== 'sent') {
          try {
            const response = await axios.post('http://localhost:5000/mail/send-email', {
              recipientEmail: customerEmail,
              templateName: customer.template_name
            });

            // Check the response from the backend
            if (response.status === 200) {
              // If email sent successfully, update the status to 'sent'
              await axios.put(`http://localhost:5000/user/updatecustomerDetails/${customer._id}`, {
                status: 'sent'
              });
              toast.success(`Sending mail to ${customerEmail}`); // Display success toast message
            } else if (response.status === 400 && response.data.error === 'Recipient email does not exist') {
              // If recipient email does not exist, update the status to the error message
              await axios.put(`http://localhost:5000/user/updatecustomerDetails/${customer._id}`, {
                status: response.data.error
              });
              toast.error(response.data.error); // Display error toast message
            }
          } catch (error) {
            console.error('Error sending email:', error);
            const errorMessage = error.response?.data?.error || 'Error sending email';
            toast.error(errorMessage); // Display error toast message
            // If an error occurred while sending email, update the status to 'error' and display the error message
            await axios.put(`http://localhost:5000/user/updatecustomerDetails/${customer._id}`, { status: errorMessage });
          }
        }
      }
      fetchUsers();
      setSelectedCustomers([]); // Clear the selected customers
      setSelectAll(false); // Uncheck the "Select All" checkbox
    } catch (error) {
      console.error('Error updating account status:', error);
      toast.error('Error sending email'); // Display error toast message
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchUsers, 1000); // Run fetchUsers every 10 seconds

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/customerDetails'); // Replace with your API endpoint to fetch users
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   const formData = new FormData();
  //   formData.append('file', selectedFile);

  //   axios
  //     .post('http://localhost:5000/upload', formData)
  //     .then((response) => {
  //       console.log(response.data);
  //       toast.success(response.data.message); // Use response.data.message for success
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       toast.error(error.response.data.error); // Use error.response.data.error for error
  //     });
  // };
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', selectedFile);

    axios
      .post('http://localhost:5000/upload', formData)
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message); // Use response.data.message for success
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.error); // Use error.response.data.error for error
      });
  };
  const generateReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/generateReport', {
        params: {
          startDate,
          endDate
        }
      }); // Replace with your API endpoint to generate the report
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'customer_report.csv'); // Set the desired file name and extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  return (
    <div className="customer-details-container">
    <br></br>
    <br></br>
    <br></br>
    <h1>Connect, Communicate, and Track</h1>
    <p> Customer Engagement Hub - List Upload, Email Campaigns, and Sent Mail Reports</p>
    <div className="button-group">
        <button className={`button ${selectedButton === 'upload' ? 'active' : ''}`} onClick={() => handleButtonClick('upload')}>
          Upload
        </button>
        <button className={`button ${selectedButton === 'generate' ? 'active' : ''}`} onClick={() => handleButtonClick('generate')}>
         Report
        </button>
        <button className={`button ${selectedButton === 'send' ? 'active' : ''}`} onClick={() => handleButtonClick('send')}>
          Send Mail
        </button>
      </div>
      <div className="custlist">
      
        
        {selectedButton === 'upload' && (
          <form className='fm' onSubmit={handleSubmit}>
          <h2>Upload Excel Sheet</h2>

            <label htmlFor="file-upload" className="template-section custom-file-upload">
              <FaUpload className="upload-icon" />
              <span>Choose file</span>
              <input id="file-upload" type="file" onChange={handleFileChange} accept=".xls,.xlsx" />
            </label>
            <button className='button' type="submit">EXPORT DATA</button>
          </form>
        )}
        {selectedButton === 'generate' && (
          <div className="date-range">
            <label htmlFor="start-date">Start Date:</label>
            <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

            <label htmlFor="end-date">End Date:</label>
            <input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

            <button onClick={generateReport}>
              <FaDownload className="download-icon" />
              Download
            </button>
          </div>
        )}
        {selectedButton === 'send' && (
          <>
            <h1>Mailing list details</h1>
            <table>
              <thead>
                <tr>
                  <th>Customer_email</th>
                  <th>Customer_name</th>
                  <th>Template_name</th>
                  <th>Status</th>
                  <th>
                    Select All
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((user) => (
                  <tr key={user.customer_email}>
                    <td className="tableroww">{user.customer_email}</td>
                    <td className="tableroww">{user.customer_name}</td>
                    <td className="tableroww">{user.template_name}</td>
                    <td className="tableroww">{user.status}</td>
                    <td className="tableroww">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(user.customer_email)}
                        onChange={(event) => handleCustomerCheckboxChange(event, user.customer_email)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedCustomers.length > 0 && (
              <button className='button' onClick={handleSendNow}>
                Send Now
              </button>
            )}
          </>
        )}
      
        <ToastContainer
          position="bottom-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
  );
};

export default CustomerDetails;
