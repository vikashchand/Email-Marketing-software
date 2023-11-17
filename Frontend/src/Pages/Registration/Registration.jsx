import React,{useState} from 'react'
import { useFormik } from "formik";
import { signUpSchema } from "../../Schemas";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Registration.css'
import axios from 'axios';
import work from '../../assets/work.jpg';




const initialValues = {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  



const Registration = () => {

  const [showPassword, setShowPassword] = useState(false);

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signUpSchema,
      onSubmit: (values, action) => {
        
        action.resetForm();
      },
    });
 

  const signupHandle =()=>{
    axios.post('https://email-marketing-vikash.vercel.app/user/register',{
      username:values.username,email:values.email,password:values.password
    }).then((data)=>{
      if(data.data.status===200){
        toast.success(data.data.message)
      }
      else{
        toast.error(data.data.message)
      }
    })
    .catch((error)=>toast.error(error))
  }
  

  return (
    <>
    <div >
    <div className="heading-tab">
    <h1>Email Marketing Tool</h1>
  </div>
    <div className="container">
    
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
      <div className="modal">
        <div className="modal-container">
          <div className="modal-left">
            <h1 className="modal-title">Welcome!</h1>
            <p className="modal-desc">
             
            </p>
            <form onSubmit={handleSubmit}>
              <div className="input-block">
                <label htmlFor="username" className="input-label">
                username
                </label>
                <input
                  type="name"
                  autoComplete="off"
                  name="username"
                  id="username"
                  placeholder="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                
              </div>
              {errors.username && touched.username ? (
                <p className="form-error">{errors.username}</p>
              ) : null}
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
                
              </div>
              {errors.email && touched.email ? (
                <p className="form-error">{errors.email}</p>
              ) : null}
              <div className="input-block">
                  <label htmlFor="password" className="input-label"  onClick={() => setShowPassword(!showPassword)}>
                    Password  👁️
                  </label>
                  <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="off"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                
              </div>
              {errors.password && touched.password ? (
                <p className="form-error">{errors.password}</p>
              ) : null}
              <div className="input-block">
                <label htmlFor="confirm_password" className="input-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  autoComplete="off"
                  name="confirm_password"
                  id="confirm_password"
                  placeholder="Confirm Password"
                  value={values.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                
              </div>
              {errors.confirm_password && touched.confirm_password ? (
                <p className="form-error">{errors.confirm_password}</p>
              ) : null}
              <div className="modal-buttons">
                
                <button className="input-button" type="submit" 
                onClick={signupHandle}
                >
                  Registration
                </button>
              </div>
            </form>
            <p className="sign-up">
            Already have an account? <Link to="/login">Sign In now</Link>
            </p>
          </div>
          <div className="modal-right">
                <img
                  src={work}
                  alt=""
                />
              </div>
        </div>
      </div>
    </div>
    </div>
    
    
    </>
  )
}

export default Registration