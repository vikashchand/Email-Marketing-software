import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './sendMail.css'
const SendMailPage = () => {
  const [templateName, setTemplateName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  const handleSendEmail = async () => {
    try {
      await axios.post('https://email-marketing-vikash.vercel.app/mail/send-email', {
        templateName,
        recipientEmail,
      });
      console.log('Email sent successfully!');
      toast.success('Email sent successfully!');
      // Add your logic or UI updates after successful email sending
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(`Error sending email: ${error}`);
    }
  };

  return (
    <div className="send-mail-container">
      
      <div className="template-section">
      <ToastContainer />
        <h2>Select Template to Send</h2>
        <select className='temp'
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        >
          <option value="">Select a template</option>
          <option value="otp">otp</option>
          <option value="login">login</option>
          {/* Add more template options */}
        </select>
      </div>
      <div className="recipient-section">
        <h2>Recipient Email</h2>
        <input
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
        />
      </div>
      <div className="button-section ">
        <button className='button' onClick={handleSendEmail}>Send Email</button>
      </div>
      
    </div>
  );
};

export default SendMailPage;
