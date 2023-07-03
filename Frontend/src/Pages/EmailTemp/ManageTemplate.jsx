import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './sendMail.css';

const ManageTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState('');
  const [newTemplateType, setNewTemplateType] = useState('');
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState('');

  useEffect(() => {
    // Fetch the templates from the backend when the component mounts
    fetchTemplates();
  }, []);

  const fetchTemplates = () => {
    // Make a GET request to fetch the templates from the backend
    fetch('https://email-marketing-vikash.vercel.app/user/templates')
      .then(response => response.json())
      .then(data => setTemplates(data))
      .catch(error => console.log(error));
  };

  const handleEdit = template => {
    setCurrentTemplate(template);
    setIsCreatingTemplate(false);
    setPreviewTemplate(null);
    setNewTemplateName(template.type);
  };
  

  // const handleDelete = templateId => {
  //   const confirmed = window.confirm('Are you sure you want to remove this Template?');
  //   if (confirmed) {
  //     try {
  //       // Make a DELETE request to the backend to delete the template
  //       fetch(`http://localhost:5000/user/templates/${templateId}`, { method: 'DELETE' })
  //         .then(() => {
  //           fetchTemplates();
  //           toast.success('Template deleted successfully');
  //         })
  //         .catch(error => console.error('Error removing templates:', error));
  //     } catch (error) {
  //       console.error('Error removing templates:', error);
  //     }
  //   }
  // };
  const handleDelete = templateId => {
    const confirmed = window.confirm('Are you sure you want to remove this Template?');
    if (confirmed) {
      try {
        
        // Get the template type based on the templateId
        const template = templates.find(template => template._id === templateId);
       // const templateType = template ? template.Type : '';
       console.log("hi",template.type);
        // Make a DELETE request to the backend to delete the template
        fetch(`https://email-marketing-vikash.vercel.app/user/templates/${templateId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            
            type: template.type , 
            // Use the updated template name
          }), // Send the template type as a string in the request body
           // Send the template type in the request body
        })
          .then(() => {
            fetchTemplates();
            toast.success('Template deleted successfully');
          })
          .catch(error => console.error('Error removing templates:', error));
      } catch (error) {
        console.error('Error removing templates:', error);
      }
    }
  };
  


  const handleCreate = () => {
    setIsCreatingTemplate(true);
    setCurrentTemplate(null);
    setPreviewTemplate(null);
  };

  const handleTemplateClose = () => {
    setCurrentTemplate(null);
    setIsCreatingTemplate(false);
    setPreviewTemplate(null);
    fetchTemplates();
  };

  const handleUpdate = () => {
    if (currentTemplate) {
      // Make a PUT request to update the existing template
      fetch(`https://email-marketing-vikash.vercel.app/user/templates/${currentTemplate._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: currentTemplate.body,
          type: newTemplateName, 
          templateId:currentTemplate._id// Use the updated template name
        }),
      })
        .then(() => {
          setCurrentTemplate(null);
          fetchTemplates();
          toast.success('Template updated successfully');
        })
        .catch(error => console.log(error));
    } else {
      if (newTemplate && newTemplateType) {
        // Make a POST request to create a new template
        fetch('https://email-marketing-vikash.vercel.app/user/templates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            body: newTemplate,
            type: newTemplateType,
            name: newTemplateName, // Include the new template name in the request body
          }),
        })
          .then(() => {
            setNewTemplate('');
            setNewTemplateType('');
            setNewTemplateName('');
            setIsCreatingTemplate(false);
            setPreviewTemplate(null);
            fetchTemplates();
            toast.success('Template created successfully');
          })
          .catch(error => console.log(error));
      } else {
        console.log('Please enter the template body, type, and name');
      }
    }
  };
  

  const handlePreview = template => {
    setPreviewTemplate(template);
  };

  return (

    <div className='managetemp-container'>
      
  
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
<br></br>

<h3>Craft, Customize, and Convey</h3>

   
      {!isCreatingTemplate && !currentTemplate && !previewTemplate && (
        <div className=''>
        
       
        <button onClick={handleCreate}>Create New Template</button>
          <h3>Available Templates</h3>
          <div className="managetemp-container">
          <table className='templist'>
            <thead>
              <tr>
                <th>Template Type</th>
                <th>Edit</th>
                <th>Delete</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                <tr key={template._id}>
                  <td className='tableroww'>{template.type}</td>
                  <td className='tableroww'>
                    <button onClick={() => handleEdit(template)}>Edit</button>
                  </td>
                  <td className='tableroww'>
                    <button onClick={() => handleDelete(template._id)}>Delete</button>
                  </td>
                  <td  className='tableroww'>
                    <button onClick={() => handlePreview(template)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        </div>
      )}

      {currentTemplate && (
        <div className="template-editor">
          <br></br>
          <br></br>
          <br></br>
          <h3>Edit Template</h3>
          <input
            type="text"
            value={newTemplateName}
            onChange={e => setNewTemplateName(e.target.value)}
            style={{ width: '50%', height: '30px', marginBottom: '10px' }}
          />
          <textarea
            value={currentTemplate.body}
            onChange={e => setCurrentTemplate({ ...currentTemplate, body: e.target.value ,_id: currentTemplate._id })}
            style={{ width: '50%', height: '200px' }}
          ></textarea>
          <div className="templateedits">
            <button onClick={handleUpdate}>Save</button>
            <button onClick={handleTemplateClose}>Close</button>
          </div>
        </div>
      )}
      
      {isCreatingTemplate && (
        <div className="templateeditor">
          <h3>Create New Template</h3>
          <textarea
            value={newTemplate}
            onChange={e => setNewTemplate(e.target.value)}
            style={{ width: '50%', height: '200px', border: '1px solid black', borderRadius: '5px' }}
            placeholder="Paste The Template Here"
          ></textarea>
          <div className="templateedits">
            <input
              type="text"
              value={newTemplateType}
              style={{ width: '30%', height: '30px', margin: '10px' }}
              onChange={e => setNewTemplateType(e.target.value)}
              placeholder="Template Name"
            />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={handleTemplateClose}>Close</button>
          </div>
        </div>
      )}

      {previewTemplate && (
        <div className="template-preview">
          <h3>Template Preview</h3>
          <div
            className="preview-body"
            dangerouslySetInnerHTML={{ __html: previewTemplate.body }}
          ></div>
          <button onClick={() => setPreviewTemplate(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ManageTemplate;
