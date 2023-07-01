import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './sendMail.css';

function Template() {
  const [template, setTemplate] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    // Fetch the template from the server when the component mounts
    fetchTemplate(selectedTemplate);
  }, [selectedTemplate]);

  const fetchTemplate = (templateName) => {
    fetch(`/template?template=${templateName}`)
      .then((response) => response.text())
      .then((data) => {
        setTemplate(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);
      });
  };

  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
  };

  const saveTemplate = () => {
    // Send the updated template to the server to be saved
    fetch(`http://localhost:5000/template?template=${selectedTemplate}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Update the content type to JSON
      },
      body: JSON.stringify({ template }), // Send the template as a JSON string
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        toast.success(data.message)
        setEditMode(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);
      });
  };

  const deleteTemplate = () => {
    // Delete the template on the server
    fetch(`http://localhost:5000/template?template=${selectedTemplate}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        toast.success(data.message)
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  return (
    <div className='template-container'>
    <ToastContainer/>
      <div className='template-section'>
        <h2>Select Template to Edit</h2>
        <select
          className='temp'
          value={selectedTemplate}
          onChange={handleTemplateChange}
        >
          <option value=''>Select a template</option>
          <option value='otp'>OTP</option>
          <option value='login'>Login</option>
          {/* Add more template options */}
        </select>
      </div>
      {editMode ? (
        <div>
          <textarea
            className='template-textarea'
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            style={{ width: '100%', height: '300px' }} // Increase the width and height here
          />
          <br />
          <button onClick={saveTemplate}>Save Template</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <div dangerouslySetInnerHTML={{ __html: template }} />
          <br />
          <button onClick={() => setEditMode(true)}>Edit Template</button>
          <button onClick={deleteTemplate}>Delete Template</button>
        </div>
      )}
    </div>
  );
}

export default Template;
