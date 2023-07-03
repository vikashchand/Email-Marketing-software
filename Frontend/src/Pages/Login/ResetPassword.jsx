import React from 'react';
import { useFormik } from 'formik';
import { resetPasswordSchema } from '../../Schemas/index';
import { Link } from 'react-router-dom';
import '../Registration/Registration.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const initialValues = {
  email: '',
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: (values, action) => {
      console.log('Reset Password Form Values:', values);
      action.resetForm();
      resetPasswordHandle(); // Call the function to handle password reset
    },
  });



  const resetPasswordHandle = () => {
    axios
      .post('https://email-marketing-vikash.vercel.app/user/forget-Password', {
        email: values.email,
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data.status === 200) {
          toast.success(data.message);
          
        } else if (data.status === 404) {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error('This email doesnt exist.');
      });
  };
  
  
  return (
    <>
      <div className="container">
        <div className="modal">
          <div className="modal-container">
            <div className="modal-left">
              <h1 className="modal-title">Reset Password</h1>
              <p className="modal-desc">Enter your email to reset your password</p>
              <ToastContainer />
              <form onSubmit={handleSubmit}>
                <div className="input-block">
                  <label htmlFor="email" className="input-label">
                    Email
                  </label>
                 
                  <input
  type="email"
  autoComplete="off"
  name="email"
  id="email"
  placeholder="Email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
/>
                  {errors.email && touched.email ? (
                    <p className="form-error">{errors.email}</p>
                  ) : null}
                </div>
                <div className="modal-buttons">
                  <button className="input-button" type="submit" onClick={resetPasswordHandle} >
                    Reset Password
                  </button>
                </div>
              </form>
              <p className="sign-up">
                Remember your password? <Link to="/login">Login instead</Link>
              </p>
            </div>
            <div className="modal-right">
              <img
                src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
